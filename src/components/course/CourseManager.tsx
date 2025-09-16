import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Video, 
  FileText, 
  BookOpen, 
  Clock,
  Save,
  Upload,
  Play
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  description: string;
  learning_pathway: string;
  content_type: string;
}

interface Module {
  id: string;
  course_id: string;
  module_number: number;
  title: string;
  description: string;
  learning_objectives: string[];
  estimated_duration: number;
}

interface Lesson {
  id: string;
  course_id: string;
  module_id: string;
  lesson_number: number;
  title: string;
  description: string;
  content_type: string;
  video_url?: string;
  text_content?: string;
  estimated_duration: number;
  learning_objectives: string[];
}

const CourseManager: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchModules(selectedCourse);
      fetchLessons(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at');
      
      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchModules = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');
      
      if (error) throw error;
      setModules(data || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const fetchLessons = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');
      
      if (error) throw error;
      setLessons(data || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const createLesson = async (lessonData: Partial<Lesson>) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .insert({
          course_id: selectedCourse,
          module_id: selectedModule,
          lesson_number: lessonData.lesson_number || 1,
          title: lessonData.title || '',
          ...lessonData,
          learning_objectives: lessonData.learning_objectives || []
        })
        .select()
        .single();

      if (error) throw error;
      
      setLessons(prev => [...prev, data]);
      toast.success('Lesson created successfully!');
      setIsLessonDialogOpen(false);
      setEditingLesson(null);
    } catch (error) {
      console.error('Error creating lesson:', error);
      toast.error('Failed to create lesson');
    }
  };

  const updateLesson = async (lessonId: string, updates: Partial<Lesson>) => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .update(updates)
        .eq('id', lessonId)
        .select()
        .single();

      if (error) throw error;
      
      setLessons(prev => prev.map(lesson => 
        lesson.id === lessonId ? { ...lesson, ...data } : lesson
      ));
      toast.success('Lesson updated successfully!');
      setIsLessonDialogOpen(false);
      setEditingLesson(null);
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast.error('Failed to update lesson');
    }
  };

  const deleteLesson = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;

    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;
      
      setLessons(prev => prev.filter(lesson => lesson.id !== lessonId));
      toast.success('Lesson deleted successfully!');
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Failed to delete lesson');
    }
  };

  const openLessonDialog = (lesson?: Lesson) => {
    setEditingLesson(lesson || null);
    setIsLessonDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Course Management</h1>
          <Badge variant="outline">Admin Panel</Badge>
        </div>

        {/* Course Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Course</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a course to manage" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title} ({course.learning_pathway})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedCourse && (
          <>
            {/* Module Selection */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Course Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {modules.map(module => (
                    <div 
                      key={module.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedModule === module.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedModule(module.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">Module {module.module_number}: {module.title}</h3>
                          <p className="text-sm text-muted-foreground">{module.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{module.estimated_duration}min</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Lessons Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Lessons</CardTitle>
                  <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => openLessonDialog()}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Lesson
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <LessonEditor 
                        lesson={editingLesson}
                        onSave={editingLesson ? 
                          (updates) => updateLesson(editingLesson.id, updates) :
                          createLesson
                        }
                        onCancel={() => {
                          setIsLessonDialogOpen(false);
                          setEditingLesson(null);
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {selectedModule ? (
                  <div className="space-y-4">
                    {lessons
                      .filter(lesson => lesson.module_id === selectedModule)
                      .map(lesson => (
                        <LessonCard 
                          key={lesson.id}
                          lesson={lesson}
                          onEdit={() => openLessonDialog(lesson)}
                          onDelete={() => deleteLesson(lesson.id)}
                        />
                      ))}
                    {lessons.filter(lesson => lesson.module_id === selectedModule).length === 0 && (
                      <p className="text-muted-foreground text-center py-8">
                        No lessons in this module. Click "Add Lesson" to get started.
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Select a module to view and manage its lessons.
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

// Lesson Card Component
const LessonCard: React.FC<{
  lesson: Lesson;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ lesson, onEdit, onDelete }) => {
  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'text': return <FileText className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {getContentIcon(lesson.content_type)}
              <h3 className="font-semibold">
                Lesson {lesson.lesson_number}: {lesson.title}
              </h3>
              <Badge variant="outline" className="text-xs">
                {lesson.content_type}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{lesson.description}</p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{lesson.estimated_duration}min</span>
              </span>
              <span>{lesson.learning_objectives?.length || 0} objectives</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Lesson Editor Component
const LessonEditor: React.FC<{
  lesson?: Lesson | null;
  onSave: (data: Partial<Lesson>) => void;
  onCancel: () => void;
}> = ({ lesson, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    lesson_number: lesson?.lesson_number || 1,
    title: lesson?.title || '',
    description: lesson?.description || '',
    content_type: lesson?.content_type || 'mixed',
    video_url: lesson?.video_url || '',
    text_content: lesson?.text_content || '',
    estimated_duration: lesson?.estimated_duration || 30,
    learning_objectives: lesson?.learning_objectives?.join('\n') || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: Partial<Lesson> = {
      ...formData,
      learning_objectives: formData.learning_objectives
        .split('\n')
        .map(obj => obj.trim())
        .filter(obj => obj.length > 0)
    };
    
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DialogHeader>
        <DialogTitle>
          {lesson ? 'Edit Lesson' : 'Create New Lesson'}
        </DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Lesson Number</label>
          <Input
            type="number"
            value={formData.lesson_number}
            onChange={(e) => setFormData(prev => ({ ...prev, lesson_number: parseInt(e.target.value) }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Content Type</label>
          <Select 
            value={formData.content_type} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, content_type: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mixed">Mixed Content</SelectItem>
              <SelectItem value="video">Video Only</SelectItem>
              <SelectItem value="text">Text Only</SelectItem>
              <SelectItem value="interactive">Interactive</SelectItem>
              <SelectItem value="quiz">Quiz</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Video URL (optional)</label>
        <Input
          type="url"
          value={formData.video_url}
          onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Estimated Duration (minutes)</label>
        <Input
          type="number"
          value={formData.estimated_duration}
          onChange={(e) => setFormData(prev => ({ ...prev, estimated_duration: parseInt(e.target.value) }))}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Learning Objectives (one per line)</label>
        <Textarea
          value={formData.learning_objectives}
          onChange={(e) => setFormData(prev => ({ ...prev, learning_objectives: e.target.value }))}
          placeholder="Understand the basics of budgeting&#10;Create a personal spending plan&#10;Identify spending triggers"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Text Content</label>
        <Textarea
          value={formData.text_content}
          onChange={(e) => setFormData(prev => ({ ...prev, text_content: e.target.value }))}
          placeholder="Enter the main lesson content here..."
          rows={6}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" />
          {lesson ? 'Update' : 'Create'} Lesson
        </Button>
      </div>
    </form>
  );
};

export default CourseManager;