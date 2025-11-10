import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Building2, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Organization {
  id: string;
  name: string;
  organization_type: string;
  contact_email: string | null;
  contact_phone: string | null;
  is_active: boolean;
  created_at: string;
  seat_count: number;
  seats_used: number;
  access_code: string | null;
  subscription_tier: string;
  subscription_active: boolean;
}

const AdminFacilityManagement = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newOrg, setNewOrg] = useState({
    name: "",
    contact_email: "",
    contact_phone: "",
    seat_count: 30,
    subscription_tier: "basic",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .order("name");

      if (error) throw error;
      setOrganizations(data || []);
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

  const createOrganization = async () => {
    if (!newOrg.name.trim()) {
      toast({
        title: "Error",
        description: "Organization name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate unique access code
      const accessCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      const { error } = await supabase.from("organizations").insert([
        {
          name: newOrg.name,
          contact_email: newOrg.contact_email || null,
          contact_phone: newOrg.contact_phone || null,
          seat_count: newOrg.seat_count,
          subscription_tier: newOrg.subscription_tier,
          access_code: accessCode,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Treatment center created with access code: ${accessCode}`,
      });

      setNewOrg({ name: "", contact_email: "", contact_phone: "", seat_count: 30, subscription_tier: "basic" });
      setIsDialogOpen(false);
      fetchOrganizations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleActive = async (orgId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("organizations")
        .update({ is_active: !currentStatus })
        .eq("id", orgId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Organization ${!currentStatus ? "activated" : "deactivated"}`,
      });

      fetchOrganizations();
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
              <Building2 className="h-5 w-5" />
              Treatment Centers
            </CardTitle>
            <CardDescription>Manage treatment center facilities</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Facility
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Treatment Center</DialogTitle>
                <DialogDescription>
                  Add a new treatment center that can sponsor client access
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Facility Name *</Label>
                  <Input
                    id="name"
                    value={newOrg.name}
                    onChange={(e) => setNewOrg({ ...newOrg, name: e.target.value })}
                    placeholder="Enter facility name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Contact Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newOrg.contact_email}
                    onChange={(e) => setNewOrg({ ...newOrg, contact_email: e.target.value })}
                    placeholder="contact@facility.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Contact Phone</Label>
                  <Input
                    id="phone"
                    value={newOrg.contact_phone}
                    onChange={(e) => setNewOrg({ ...newOrg, contact_phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="seats">Number of Seats *</Label>
                  <Input
                    id="seats"
                    type="number"
                    min="1"
                    value={newOrg.seat_count}
                    onChange={(e) => setNewOrg({ ...newOrg, seat_count: parseInt(e.target.value) || 0 })}
                    placeholder="30"
                  />
                </div>
                <div>
                  <Label htmlFor="tier">Subscription Tier</Label>
                  <select
                    id="tier"
                    value={newOrg.subscription_tier}
                    onChange={(e) => setNewOrg({ ...newOrg, subscription_tier: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="basic">Basic ($297/month)</option>
                    <option value="premium">Premium ($497/month)</option>
                    <option value="enterprise">Enterprise ($997/month)</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createOrganization}>Create Facility</Button>
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
              <TableHead>Access Code</TableHead>
              <TableHead>Seats</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id}>
                <TableCell className="font-medium">{org.name}</TableCell>
                <TableCell>
                  <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                    {org.access_code || "—"}
                  </code>
                </TableCell>
                <TableCell>
                  <span className={org.seats_used >= org.seat_count ? "text-destructive font-semibold" : ""}>
                    {org.seats_used} / {org.seat_count}
                  </span>
                </TableCell>
                <TableCell className="capitalize">{org.subscription_tier}</TableCell>
                <TableCell className="text-sm">
                  <div>{org.contact_email || "—"}</div>
                  <div className="text-muted-foreground">{org.contact_phone || ""}</div>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      org.is_active && org.subscription_active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {org.is_active && org.subscription_active ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(org.id, org.is_active)}
                  >
                    {org.is_active ? "Deactivate" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {organizations.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No treatment centers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdminFacilityManagement;
