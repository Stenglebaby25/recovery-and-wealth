import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Copy, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { format } from 'date-fns';

interface ReviewerCode {
  id: string;
  code: string;
  description: string | null;
  duration_days: number;
  max_uses: number | null;
  current_uses: number;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}

const AdminReviewerCodes = () => {
  const [codes, setCodes] = useState<ReviewerCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  // Form state
  const [description, setDescription] = useState('');
  const [durationDays, setDurationDays] = useState('365');
  const [maxUses, setMaxUses] = useState('');

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('reviewer_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCodes(data || []);
    } catch (error) {
      console.error('Error fetching codes:', error);
      toast({
        title: "Error",
        description: "Failed to load reviewer codes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCode = () => {
    // Generate a random 8-character code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const createCode = async () => {
    if (!description.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    try {
      const newCode = generateCode();
      const { error } = await supabase
        .from('reviewer_codes')
        .insert({
          code: newCode,
          description: description.trim(),
          duration_days: parseInt(durationDays),
          max_uses: maxUses ? parseInt(maxUses) : null,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Reviewer code created: ${newCode}`,
      });

      // Reset form
      setDescription('');
      setMaxUses('');
      fetchCodes();
    } catch (error) {
      console.error('Error creating code:', error);
      toast({
        title: "Error",
        description: "Failed to create reviewer code",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const toggleCodeStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('reviewer_codes')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Code ${!currentStatus ? 'activated' : 'deactivated'}`,
      });

      fetchCodes();
    } catch (error) {
      console.error('Error toggling code:', error);
      toast({
        title: "Error",
        description: "Failed to update code status",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: "Access code copied to clipboard",
    });
  };

  const getShareableLink = (code: string) => {
    return `${window.location.origin}/auth?code=${code}`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Reviewer Access Code</CardTitle>
          <CardDescription>
            Create access codes that grant premium access for reviewers and beta testers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                placeholder="e.g., Treatment Center Review Q1 2024"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxUses">Max Uses (optional)</Label>
              <Input
                id="maxUses"
                type="number"
                placeholder="Unlimited"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={createCode} disabled={generating} variant="highlight">
            <Plus className="w-4 h-4 mr-2" />
            {generating ? 'Generating...' : 'Generate Code'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Reviewer Codes</CardTitle>
          <CardDescription>
            Share these codes with reviewers to give them automatic premium access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codes.map((code) => (
                <TableRow key={code.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="px-2 py-1 bg-muted rounded font-mono text-sm">
                        {code.code}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(code.code)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{code.description}</TableCell>
                  <TableCell>{code.duration_days} days</TableCell>
                  <TableCell>
                    {code.current_uses}
                    {code.max_uses ? ` / ${code.max_uses}` : ' / ∞'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={code.is_active ? "default" : "secondary"}>
                      {code.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(code.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCodeStatus(code.id, code.is_active)}
                      >
                        {code.is_active ? (
                          <ToggleRight className="w-4 h-4" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(getShareableLink(code.code))}
                        title="Copy signup link"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {codes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No reviewer codes created yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReviewerCodes;