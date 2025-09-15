import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Video, 
  Headphones, 
  BookOpen,
  Lock,
  Star,
  CheckSquare,
  PenTool,
  FileCheck,
  GraduationCap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  resource_type: string;
  file_url?: string;
  external_url?: string;
  tags: string[];
  order_index: number;
}

const ResourceLibrary = () => {
  const { user, isPremium } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchResources();
  }, [user]);

  useEffect(() => {
    filterResources();
  }, [resources, searchTerm, selectedCategory]);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('order_index');

      if (!error && data) {
        setResources(data);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    setFilteredResources(filtered);
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      worksheet: FileText,
      template: FileText,
      guide: BookOpen,
      video: Video,
      audio: Headphones,
      workbook: PenTool,
      checklist: CheckSquare,
      ebook: GraduationCap,
      whitepaper: FileCheck
    };
    return icons[category as keyof typeof icons] || FileText;
  };

  const getResourceTypeColor = (type: string) => {
    return type === 'premium' 
      ? 'bg-primary/10 text-primary border-primary/20'
      : 'bg-secondary/10 text-secondary border-secondary/20';
  };

  const canAccessResource = (resource: Resource) => {
    return resource.resource_type === 'free' || isPremium;
  };

  const categories = ['all', 'worksheet', 'workbook', 'checklist', 'ebook', 'whitepaper', 'template', 'guide', 'video', 'audio'];
  const categoryLabels = {
    all: 'All Resources',
    worksheet: 'Worksheets',
    workbook: 'Workbooks',
    checklist: 'Checklists',
    ebook: 'E-Books',
    whitepaper: 'White Papers',
    template: 'Templates', 
    guide: 'Guides',
    video: 'Videos',
    audio: 'Audio'
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Resource Library</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Access comprehensive learning materials including workbooks, worksheets, e-books, checklists, and guides to support your financial recovery journey.
        </p>
      </div>

      {/* Premium Banner */}
      {!isPremium && (
        <Card className="bg-gradient-hero text-white">
          <CardContent className="p-6 text-center">
            <Star className="w-8 h-8 mx-auto mb-3 opacity-90" />
            <h3 className="text-xl font-semibold mb-2">Unlock Premium Resources</h3>
            <p className="opacity-90 mb-4">
              Get access to comprehensive workbooks, advanced guides, e-books, and exclusive learning materials with a premium subscription.
            </p>
            <Button variant="outline" className="bg-white text-primary hover:bg-white/90">
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {categoryLabels[category as keyof typeof categoryLabels]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => {
          const IconComponent = getCategoryIcon(resource.category);
          const canAccess = canAccessResource(resource);
          
          return (
            <Card 
              key={resource.id} 
              className={`transition-all hover:shadow-medium ${
                !canAccess ? 'opacity-75' : ''
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${
                      canAccess 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <Badge 
                        variant="outline" 
                        className={getResourceTypeColor(resource.resource_type)}
                      >
                        {resource.resource_type}
                      </Badge>
                    </div>
                  </div>
                  {!canAccess && <Lock className="w-4 h-4 text-muted-foreground" />}
                </div>
                <CardTitle className="text-lg leading-tight">
                  {resource.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {resource.description}
                </p>
                
                {resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                    {resource.tags.length > 3 && (
                      <Badge variant="secondary">
                        +{resource.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <Button 
                  variant={canAccess ? "default" : "outline"} 
                  size="sm" 
                  className="w-full"
                  disabled={!canAccess}
                  onClick={() => {
                    if (canAccess) {
                      if (resource.file_url) {
                        window.open(resource.file_url, '_blank');
                      } else if (resource.external_url) {
                        window.open(resource.external_url, '_blank');
                      }
                    }
                  }}
                >
                  {!canAccess ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Premium Required
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Access Resource
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No resources found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResourceLibrary;