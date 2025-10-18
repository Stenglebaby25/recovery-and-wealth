import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, UserPlus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Organization {
  id: string;
  name: string;
}

interface SponsoredClient {
  user_id: string;
  full_name: string | null;
  email: string;
  sponsored_until: string | null;
  organization_name: string;
}

const AdminClientManagement = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [clients, setClients] = useState<SponsoredClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    email: "",
    full_name: "",
    organization_id: "",
    sponsored_months: "3",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [orgsResult, clientsResult] = await Promise.all([
        supabase.from("organizations").select("id, name").eq("is_active", true).order("name"),
        supabase
          .from("profiles")
          .select(`
            user_id,
            full_name,
            sponsored_until,
            organizations!inner(name)
          `)
          .not("organization_id", "is", null),
      ]);

      if (orgsResult.error) throw orgsResult.error;
      if (clientsResult.error) throw clientsResult.error;

      setOrganizations(orgsResult.data || []);

      // Get emails from auth.users
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      
      const clientsWithEmail: SponsoredClient[] = (clientsResult.data || []).map((client: any) => {
        const authUser = authUsers?.users.find((u: any) => u.id === client.user_id);
        return {
          user_id: client.user_id,
          full_name: client.full_name,
          email: authUser?.email || "Unknown",
          sponsored_until: client.sponsored_until,
          organization_name: client.organizations.name,
        };
      });

      setClients(clientsWithEmail);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addClient = async () => {
    if (!newClient.email || !newClient.organization_id) {
      toast({
        title: "Error",
        description: "Email and organization are required",
        variant: "destructive",
      });
      return;
    }

    try {
      // Calculate sponsored_until date
      const sponsoredUntil = new Date();
      sponsoredUntil.setMonth(sponsoredUntil.getMonth() + parseInt(newClient.sponsored_months));

      // Check if user exists, if not create them
      const { data: existingUser } = await supabase.auth.admin.listUsers();
      let userId = existingUser?.users.find((u: any) => u.email === newClient.email)?.id;

      if (!userId) {
        // Create new user with temporary password
        const tempPassword = Math.random().toString(36).slice(-12) + "Aa1!";
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: newClient.email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: { full_name: newClient.full_name },
        });

        if (createError) throw createError;
        userId = newUser.user?.id;
      }

      // Update profile with sponsorship
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          organization_id: newClient.organization_id,
          sponsored_until: sponsoredUntil.toISOString(),
          subscription_status: "premium",
          full_name: newClient.full_name || null,
        })
        .eq("user_id", userId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Client added successfully",
      });

      setNewClient({ email: "", full_name: "", organization_id: "", sponsored_months: "3" });
      setIsDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const removeSponsorship = async (userId: string) => {
    try {
      // Set trial period (14 days from now)
      const trialExpires = new Date();
      trialExpires.setDate(trialExpires.getDate() + 14);

      const { error } = await supabase
        .from("profiles")
        .update({
          organization_id: null,
          sponsored_until: null,
          trial_started_at: new Date().toISOString(),
          trial_expires_at: trialExpires.toISOString(),
          subscription_status: "trial",
        })
        .eq("user_id", userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Client moved to 14-day trial period",
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Sponsored Clients
            </CardTitle>
            <CardDescription>Manage treatment center client access</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Sponsored Client</DialogTitle>
                <DialogDescription>
                  Grant premium access to a client through facility sponsorship
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="client@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={newClient.full_name}
                    onChange={(e) => setNewClient({ ...newClient, full_name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="organization">Treatment Center *</Label>
                  <Select
                    value={newClient.organization_id}
                    onValueChange={(value) => setNewClient({ ...newClient, organization_id: value })}
                  >
                    <SelectTrigger id="organization">
                      <SelectValue placeholder="Select facility" />
                    </SelectTrigger>
                    <SelectContent>
                      {organizations.map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="months">Sponsorship Duration</Label>
                  <Select
                    value={newClient.sponsored_months}
                    onValueChange={(value) => setNewClient({ ...newClient, sponsored_months: value })}
                  >
                    <SelectTrigger id="months">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Month</SelectItem>
                      <SelectItem value="3">3 Months</SelectItem>
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="12">12 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addClient}>Add Client</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Organization</TableHead>
              <TableHead>Access Until</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.user_id}>
                <TableCell>{client.full_name || "—"}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.organization_name}</TableCell>
                <TableCell>
                  {client.sponsored_until
                    ? new Date(client.sponsored_until).toLocaleDateString()
                    : "—"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeSponsorship(client.user_id)}
                  >
                    End Program
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {clients.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No sponsored clients found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminClientManagement;
