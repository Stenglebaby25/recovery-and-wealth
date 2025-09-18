import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, Search, Download, FileText, AlertCircle, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Lead {
  id: string;
  email: string;
  lead_type: string;
  source_page: string | null;
  metadata: any;
  created_at: string;
}

const AdminLeadManagement = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        toast.error('Failed to load leads');
        return;
      }

      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const exportLeads = () => {
    const csvContent = [
      ['Email', 'Type', 'Source Page', 'Date', 'Metadata'].join(','),
      ...filteredLeads.map(lead => [
        lead.email,
        lead.lead_type,
        lead.source_page || '',
        new Date(lead.created_at).toISOString(),
        JSON.stringify(lead.metadata || {})
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Leads exported successfully');
  };

  const getLeadTypeBadge = (type: string) => {
    const colors: { [key: string]: string } = {
      'newsletter': 'default',
      'course': 'secondary',
      'coaching': 'destructive',
      'download': 'outline'
    };
    
    return <Badge variant={colors[type] as any || 'outline'}>{type}</Badge>;
  };

  const filterByDate = (lead: Lead) => {
    if (dateFilter === 'all') return true;
    
    const leadDate = new Date(lead.created_at);
    const now = new Date();
    
    switch (dateFilter) {
      case 'today':
        return leadDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return leadDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return leadDate >= monthAgo;
      default:
        return true;
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.lead_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.source_page?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || lead.lead_type === filterType;
    const matchesDate = filterByDate(lead);
    
    return matchesSearch && matchesType && matchesDate;
  });

  const getLeadStats = () => {
    const total = filteredLeads.length;
    const byType = filteredLeads.reduce((acc, lead) => {
      acc[lead.lead_type] = (acc[lead.lead_type] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    
    return { total, byType };
  };

  const stats = getLeadStats();

  if (loading) {
    return (
      <Card className="border-0 shadow-soft bg-gradient-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-soft bg-gradient-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Leads</p>
          </CardContent>
        </Card>
        
        {Object.entries(stats.byType).map(([type, count]) => (
          <Card key={type} className="border-0 shadow-soft bg-gradient-card">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{count}</div>
              <p className="text-sm text-muted-foreground capitalize">{type} Leads</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-soft bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Lead Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="newsletter">Newsletter</SelectItem>
                <SelectItem value="course">Course</SelectItem>
                <SelectItem value="coaching">Coaching</SelectItem>
                <SelectItem value="download">Download</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={exportLeads} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Leads Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Metadata</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">No leads found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div className="font-medium">{lead.email}</div>
                      </TableCell>
                      <TableCell>
                        {getLeadTypeBadge(lead.lead_type)}
                      </TableCell>
                      <TableCell>
                        {lead.source_page ? (
                          <Badge variant="outline">{lead.source_page}</Badge>
                        ) : (
                          <span className="text-muted-foreground">Not specified</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{new Date(lead.created_at).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {lead.metadata && Object.keys(lead.metadata).length > 0 ? (
                          <div className="text-sm">
                            {Object.entries(lead.metadata).slice(0, 2).map(([key, value]) => (
                              <div key={key} className="text-muted-foreground">
                                {key}: {String(value)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No data</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Showing {filteredLeads.length} of {leads.length} leads</span>
            <span>
              {filteredLeads.length > 0 && (
                `Latest: ${new Date(filteredLeads[0].created_at).toLocaleDateString()}`
              )}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLeadManagement;