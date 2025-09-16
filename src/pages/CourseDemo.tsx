import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import LessonPlayer from '@/components/course/LessonPlayer';
import CourseManager from '@/components/course/CourseManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Settings, 
  Play, 
  Users, 
  TrendingUp,
  Award,
  Clock,
  CheckCircle
} from 'lucide-react';

const CourseDemo = () => {
  const [activeDemo, setActiveDemo] = useState<'overview' | 'player' | 'manager'>('overview');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');

  const demoFeatures = [
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: "Rich Content Support",
      description: "Videos, slides, text, and interactive elements in one lesson",
      details: [
        "Video integration with progress tracking",
        "Presentation slides with navigation",
        "Rich text content with formatting", 
        "Interactive exercises and quizzes",
        "Downloadable resources"
      ]
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary" />,
      title: "Progress Tracking",
      description: "Detailed analytics on user engagement and completion",
      details: [
        "Real-time progress percentages",
        "Time spent tracking",
        "Video watch progress",
        "Quiz scores and attempts",
        "User notes and bookmarks"
      ]
    },
    {
      icon: <Settings className="w-8 h-8 text-primary" />,
      title: "Course Management",
      description: "Easy-to-use admin interface for content creation",
      details: [
        "Visual course structure builder",
        "Drag-and-drop lesson organization",
        "Rich content editor",
        "Preview and publish workflow",
        "Analytics dashboard"
      ]
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: "Access Control",
      description: "Flexible permissions for free and premium content",
      details: [
        "Role-based access control",
        "Premium subscription integration", 
        "Course prerequisites",
        "Time-based access",
        "Group enrollments"
      ]
    }
  ];

  const demoLessons = [
    {
      id: "demo-1",
      title: "Foundation Assessment",
      description: "Evaluate your current financial situation and set recovery goals",
      duration: 45,
      type: "mixed",
      completed: false
    },
    {
      id: "demo-2", 
      title: "Creating Your Budget",
      description: "Build a sustainable spending plan that supports your recovery",
      duration: 60,
      type: "video",
      completed: false
    },
    {
      id: "demo-3",
      title: "Emergency Fund Basics",
      description: "Learn why emergency funds are crucial in early recovery",
      duration: 30,
      type: "interactive",
      completed: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          {activeDemo === 'overview' && (
            <>
              {/* Header */}
              <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">
                  Course Platform Demo
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                  See how our internal course platform creates engaging, interactive learning experiences 
                  with full content management capabilities powered by Supabase.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Badge variant="outline" className="px-4 py-2">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Rich Content
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analytics
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Settings className="w-4 h-4 mr-2" />
                    Easy Management
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2">
                    <Users className="w-4 h-4 mr-2" />
                    Access Control
                  </Badge>
                </div>
              </div>

              {/* Demo Navigation */}
              <div className="grid md:grid-cols-3 gap-6 mb-16">
                <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => setActiveDemo('player')}>
                  <CardHeader className="text-center">
                    <Play className="w-12 h-12 text-primary mx-auto mb-4" />
                    <CardTitle>Student Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">
                      Experience how students interact with lessons, track progress, and engage with content.
                    </p>
                    <Button className="w-full mt-4">Try Lesson Player</Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer transition-all hover:shadow-lg" onClick={() => setActiveDemo('manager')}>
                  <CardHeader className="text-center">
                    <Settings className="w-12 h-12 text-primary mx-auto mb-4" />
                    <CardTitle>Admin Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">
                      See how easy it is to create, edit, and manage course content with our admin tools.
                    </p>
                    <Button className="w-full mt-4">View Course Manager</Button>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/20">
                  <CardHeader className="text-center">
                    <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                    <CardTitle>Built with Supabase</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">
                      Powered by Supabase for real-time updates, secure authentication, and scalable storage.
                    </p>
                    <div className="mt-4 text-center">
                      <Badge variant="secondary">Database</Badge>
                      <Badge variant="secondary" className="ml-2">Auth</Badge>
                      <Badge variant="secondary" className="ml-2">Storage</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Feature Grid */}
              <div className="grid md:grid-cols-2 gap-8 mb-16">
                {demoFeatures.map((feature, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground mb-4">{feature.description}</p>
                        <ul className="space-y-2">
                          {feature.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-center text-sm">
                              <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Sample Lesson Structure */}
              <Card className="mb-16">
                <CardHeader>
                  <CardTitle>Sample 8-Week Course Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {demoLessons.map((lesson, index) => (
                      <div 
                        key={lesson.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold">{lesson.title}</h4>
                            <p className="text-sm text-muted-foreground">{lesson.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{lesson.duration}min</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {lesson.type}
                          </Badge>
                          <Button 
                            size="sm" 
                            onClick={() => {
                              setSelectedLessonId(lesson.id);
                              setActiveDemo('player');
                            }}
                          >
                            Start
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Technical Implementation */}
              <Card>
                <CardHeader>
                  <CardTitle>Technical Implementation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-3">Database Schema</h4>
                      <ul className="text-sm space-y-2 text-muted-foreground">
                        <li>• <code>courses</code> - Course metadata and settings</li>
                        <li>• <code>course_modules</code> - Weekly modules organization</li>
                        <li>• <code>lessons</code> - Individual lesson content</li>
                        <li>• <code>user_lesson_progress</code> - Detailed tracking</li>
                        <li>• Row Level Security for access control</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Content Types Supported</h4>
                      <ul className="text-sm space-y-2 text-muted-foreground">
                        <li>• Video lessons with progress tracking</li>
                        <li>• Interactive presentation slides</li>
                        <li>• Rich text content with formatting</li>
                        <li>• Quiz and assessment tools</li>
                        <li>• Downloadable worksheets</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeDemo === 'player' && (
            <div>
              <div className="mb-6">
                <Button variant="outline" onClick={() => setActiveDemo('overview')}>
                  ← Back to Overview
                </Button>
              </div>
              <Card className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Lesson Player Demo</h2>
                <p className="text-muted-foreground mb-6">
                  This would show the full lesson player interface with video, content tabs, progress tracking, and note-taking.
                </p>
                <div className="bg-muted/50 p-8 rounded-lg">
                  <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Interactive lesson player will be rendered here with real lesson data from the database.
                  </p>
                </div>
              </Card>
            </div>
          )}

          {activeDemo === 'manager' && (
            <div>
              <div className="mb-6">
                <Button variant="outline" onClick={() => setActiveDemo('overview')}>
                  ← Back to Overview
                </Button>
              </div>
              <CourseManager />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseDemo;