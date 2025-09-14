import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Users, 
  Phone, 
  Mail, 
  Calendar, 
  Edit2, 
  Trash2,
  Heart,
  Shield
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Sponsor {
  id: string;
  sponsor_name: string;
  sponsor_email?: string;
  sponsor_phone?: string;
  relationship_type: string;
  program_type: string;
  connected_at: string;
  notes?: string;
}

const SponsorManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingDialog, setIsAddingDialog] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [formData, setFormData] = useState({
    sponsor_name: '',
    sponsor_email: '',
    sponsor_phone: '',
    relationship_type: 'sponsor',
    program_type: '12_step',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      fetchSponsors();
    }
  }, [user]);

  const fetchSponsors = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('sponsors')
        .select('*')
        .eq('user_id', user.id)
        .order('connected_at', { ascending: false });

      if (!error && data) {
        setSponsors(data);
      }
    } catch (error) {
      console.error('Error fetching sponsors:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      sponsor_name: '',
      sponsor_email: '',
      sponsor_phone: '',
      relationship_type: 'sponsor',
      program_type: '12_step',
      notes: ''
    });
    setEditingSponsor(null);
  };

  const handleSave = async () => {
    if (!user || !formData.sponsor_name.trim()) {
      toast({
        title: "Error",
        description: "Please enter the sponsor's name.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingSponsor) {
        // Update existing sponsor
        const { error } = await supabase
          .from('sponsors')
          .update({
            sponsor_name: formData.sponsor_name,
            sponsor_email: formData.sponsor_email || null,
            sponsor_phone: formData.sponsor_phone || null,
            relationship_type: formData.relationship_type,
            program_type: formData.program_type,
            notes: formData.notes || null
          })
          .eq('id', editingSponsor.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Sponsor updated successfully!",
        });
      } else {
        // Add new sponsor
        const { error } = await supabase
          .from('sponsors')
          .insert({
            user_id: user.id,
            sponsor_name: formData.sponsor_name,
            sponsor_email: formData.sponsor_email || null,
            sponsor_phone: formData.sponsor_phone || null,
            relationship_type: formData.relationship_type,
            program_type: formData.program_type,
            notes: formData.notes || null
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Sponsor added successfully!",
        });
      }

      resetForm();
      setIsAddingDialog(false);
      fetchSponsors();
    } catch (error) {
      console.error('Error saving sponsor:', error);
      toast({
        title: "Error",
        description: "Failed to save sponsor. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (sponsor: Sponsor) => {
    setFormData({
      sponsor_name: sponsor.sponsor_name,
      sponsor_email: sponsor.sponsor_email || '',
      sponsor_phone: sponsor.sponsor_phone || '',
      relationship_type: sponsor.relationship_type,
      program_type: sponsor.program_type,
      notes: sponsor.notes || ''
    });
    setEditingSponsor(sponsor);
    setIsAddingDialog(true);
  };

  const handleDelete = async (sponsorId: string) => {
    if (!confirm('Are you sure you want to remove this sponsor/mentor?')) return;

    try {
      const { error } = await supabase
        .from('sponsors')
        .delete()
        .eq('id', sponsorId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Sponsor removed successfully!",
      });

      fetchSponsors();
    } catch (error) {
      console.error('Error deleting sponsor:', error);
      toast({
        title: "Error",
        description: "Failed to remove sponsor. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getRelationshipIcon = (type: string) => {
    const icons = {
      sponsor: Shield,
      mentor: Users,
      accountability_partner: Heart
    };
    return icons[type as keyof typeof icons] || Users;
  };

  const getRelationshipColor = (type: string) => {
    const colors = {
      sponsor: 'bg-primary/10 text-primary border-primary/20',
      mentor: 'bg-secondary/10 text-secondary border-secondary/20',
      accountability_partner: 'bg-accent/10 text-accent border-accent/20'
    };
    return colors[type as keyof typeof colors] || colors.sponsor;
  };

  const formatProgramType = (type: string) => {
    const labels = {
      '12_step': '12-Step Program',
      'smart_recovery': 'SMART Recovery',
      'other': 'Other Program'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const formatRelationshipType = (type: string) => {
    const labels = {
      sponsor: 'Sponsor',
      mentor: 'Mentor',
      accountability_partner: 'Accountability Partner'
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded"></div>
        <div className="grid gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Sponsors & Mentors</h2>
          <p className="text-muted-foreground">
            Connect with your support network for accountability and guidance.
          </p>
        </div>
        <Dialog open={isAddingDialog} onOpenChange={(open) => {
          setIsAddingDialog(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingSponsor ? 'Edit Contact' : 'Add New Contact'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name *</label>
                <Input
                  value={formData.sponsor_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, sponsor_name: e.target.value }))}
                  placeholder="Enter name"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.sponsor_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, sponsor_email: e.target.value }))}
                  placeholder="Email address"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Phone</label>
                <Input
                  type="tel"
                  value={formData.sponsor_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, sponsor_phone: e.target.value }))}
                  placeholder="Phone number"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Relationship Type</label>
                <Select 
                  value={formData.relationship_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, relationship_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sponsor">Sponsor</SelectItem>
                    <SelectItem value="mentor">Mentor</SelectItem>
                    <SelectItem value="accountability_partner">Accountability Partner</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Program Type</label>
                <Select 
                  value={formData.program_type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, program_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12_step">12-Step Program</SelectItem>
                    <SelectItem value="smart_recovery">SMART Recovery</SelectItem>
                    <SelectItem value="other">Other Program</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes or reminders..."
                  rows={3}
                />
              </div>

              <Button onClick={handleSave} className="w-full">
                {editingSponsor ? 'Update Contact' : 'Add Contact'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {sponsors.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No contacts yet</h3>
            <p className="text-muted-foreground mb-4">
              Add your sponsor, mentor, or accountability partner to strengthen your support network.
            </p>
            <Button onClick={() => setIsAddingDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Contact
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sponsors.map((sponsor) => {
            const IconComponent = getRelationshipIcon(sponsor.relationship_type);
            
            return (
              <Card key={sponsor.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-lg ${getRelationshipColor(sponsor.relationship_type)}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{sponsor.sponsor_name}</h3>
                          <Badge variant="outline" className={getRelationshipColor(sponsor.relationship_type)}>
                            {formatRelationshipType(sponsor.relationship_type)}
                          </Badge>
                          <Badge variant="secondary">
                            {formatProgramType(sponsor.program_type)}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-muted-foreground mb-3">
                          {sponsor.sponsor_email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <a href={`mailto:${sponsor.sponsor_email}`} className="hover:text-foreground">
                                {sponsor.sponsor_email}
                              </a>
                            </div>
                          )}
                          {sponsor.sponsor_phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <a href={`tel:${sponsor.sponsor_phone}`} className="hover:text-foreground">
                                {sponsor.sponsor_phone}
                              </a>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Connected {new Date(sponsor.connected_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {sponsor.notes && (
                          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                            {sponsor.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(sponsor)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(sponsor.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SponsorManagement;