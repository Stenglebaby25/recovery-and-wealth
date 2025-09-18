import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookOpen, FileText, Search, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  description: string | null;
  content_type: string;
  learning_pathway: string;
  week_number: number | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface Resource {
  id: string;
  title: string;
  description: string | null;
  category: string;
  resource_type: string;
  file_url: string | null;
  external_url: string | null;
  order_index: number;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

const AdminContentManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('courses');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      
      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('order_index', { ascending: true });

      if (coursesError) {
        console.error('Error fetching courses:', coursesError);
        toast.error('Failed to load courses');
      } else {
        setCourses(coursesData || []);
      }

      // Fetch resources
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select('*')
        .order('order_index', { ascending: true });

      if (resourcesError) {
        console.error('Error fetching resources:', resourcesError);
        toast.error('Failed to load resources');
      } else {
        setResources(resourcesData || []);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const getContentTypeBadge = (type: string) => {
    switch (type) {
      case 'free':
        return <Badge variant="secondary">Free</Badge>;
      case 'premium':
        return <Badge variant="default">Premium</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredResources = resources.filter(resource => 
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <Card className="border-0 shadow-soft bg-gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Content Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            {/* Search */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add {activeTab === 'courses' ? 'Course' : 'Resource'}
              </Button>
            </div>

            <TabsContent value="courses" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Pathway</TableHead>
                      <TableHead>Week</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{course.title}</div>
                            {course.description && (
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {course.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getContentTypeBadge(course.content_type)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{course.learning_pathway}</Badge>
                        </TableCell>
                        <TableCell>{course.week_number || '-'}</TableCell>
                        <TableCell>{course.order_index}</TableCell>
                        <TableCell>
                          {new Date(course.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Total courses: {filteredCourses.length} | 
                Free: {filteredCourses.filter(c => c.content_type === 'free').length} | 
                Premium: {filteredCourses.filter(c => c.content_type === 'premium').length}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResources.map((resource) => (
                      <TableRow key={resource.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{resource.title}</div>
                            {resource.description && (
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {resource.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{resource.category}</Badge>
                        </TableCell>
                        <TableCell>
                          {getContentTypeBadge(resource.resource_type)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {resource.file_url && <FileText className="w-4 h-4" />}
                            {resource.external_url && <Badge variant="secondary">External</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {resource.tags?.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {resource.tags && resource.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{resource.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(resource.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Total resources: {filteredResources.length} | 
                Free: {filteredResources.filter(r => r.resource_type === 'free').length} | 
                Premium: {filteredResources.filter(r => r.resource_type === 'premium').length}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContentManagement;