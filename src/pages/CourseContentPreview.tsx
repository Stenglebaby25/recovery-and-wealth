import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import CoursePreview from '@/components/CoursePreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  FileText, 
  Download, 
  CheckCircle,
  Clock,
  Target,
  Users,
  GraduationCap
} from 'lucide-react';

const CourseContentPreview = () => {
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);

  // Course content with the actual lesson materials you've uploaded
  const courseContent = {
    1: {
      title: "Understanding the Link Between Addiction and Financial Instability",
      lessons: [
        "Financial Recovery Foundations",
        "Psychology of Addiction & Money",
        "Building Recovery-Centered Awareness"
      ],
      resources: [
        "/learning-resources/A_Revolutionary_Approach_to_Sustainable_Recovery_1.pdf"
      ]
    },
    2: {
      title: "Creating a Recovery-Centered Budget",
      lessons: [
        "Essential Budgeting Skills",
        "Recovery-Specific Financial Planning", 
        "Tracking Systems & Tools"
      ],
      resources: [
        "/learning-resources/R_W_-_Personal_Budget_Worksheet.pdf"
      ]
    },
    3: {
      title: "Building Your Financial Safety Net",
      lessons: [
        "Emergency Fund Essentials",
        "Automated Savings Strategies",
        "Milestone Celebration System"
      ],
      resources: [
        "/learning-resources/Annual_Drain_SVG.svg"
      ]
    },
    4: {
      title: "Understanding Debt and Credit",
      lessons: [
        "Debt Reduction Strategies",
        "Credit Score Building",
        "Responsible Credit Use"
      ],
      resources: [
        "/learning-resources/Financial_Foundations_-_A_Roadmap_to_Stability_in_Recovery.pdf"
      ]
    },
    5: {
      title: "Planning for the Future",
      lessons: [
        "SMART Financial Goals",
        "Retirement Planning Basics",
        "Celebrating Milestones"
      ],
      resources: [
        "/learning-resources/Power_of_Potential_design.svg"
      ]
    },
    6: {
      title: "Career & Income Growth",
      lessons: [
        "Employment Strategies & Job Search Skills",
        "Managing Unemployment Without Relapse",
        "Career Planning & Education"
      ],
      resources: [
        "Career Development Guide (Uploaded PDFs)",
        "Unemployment Management Strategies"
      ]
    },
    7: {
      title: "Mind Over Money",
      lessons: [
        "Psychology of Spending & Impulse Management",
        "Mindset Shift & Healthy Money Relationships",
        "Celebrating Financial Successes"
      ],
      resources: [
        "/learning-resources/Sober_Money_Mindset_-_Checklist.pdf",
        "/learning-resources/Money_Mindset_Workbook.pdf"
      ]
    },
    8: {
      title: "Building a Support System & Sustaining Your Journey",
      lessons: [
        "Building Strong Support Networks",
        "Financial Self-Assessment",
        "Maintaining Financial Sobriety",
        "Creating Your Recovery Plan"
      ],
      resources: [
        "Support System Building Guide",
        "Financial Assessment Tools"
      ]
    }
  };

  const handleResourceDownload = (resource: string) => {
    if (resource.startsWith('/')) {
      // Direct download for files in public folder
      const link = document.createElement('a');
      link.href = resource;
      link.download = resource.split('/').pop() || 'resource';
      link.click();
    } else {
      // For other resources, show info
      alert(`Resource: ${resource}\nThis would typically be available for download in the full course platform.`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                8-Week Financial Recovery Course Content
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Review the complete course structure and access all lesson materials you've uploaded
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="outline" className="px-4 py-2">
                  <BookOpen className="w-4 h-4 mr-2" />
                  8 Modules
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <Target className="w-4 h-4 mr-2" />
                  25+ Lessons
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Worksheets & Resources
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <Users className="w-4 h-4 mr-2" />
                  Community Support
                </Badge>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Course Overview</TabsTrigger>
                <TabsTrigger value="content">Detailed Content</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-8">
                <CoursePreview />
              </TabsContent>

              <TabsContent value="content" className="mt-8">
                <div className="grid gap-6">
                  {Object.entries(courseContent).map(([week, content]) => (
                    <Card key={week} className="transition-all duration-300 hover:shadow-lg">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl">
                            Week {week}: {content.title}
                          </CardTitle>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedWeek(selectedWeek === parseInt(week) ? null : parseInt(week))}
                          >
                            {selectedWeek === parseInt(week) ? 'Hide Details' : 'View Details'}
                          </Button>
                        </div>
                      </CardHeader>
                      
                      {selectedWeek === parseInt(week) && (
                        <CardContent className="pt-0">
                          <div className="grid md:grid-cols-2 gap-6">
                            {/* Lessons */}
                            <div>
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" />
                                Lesson Topics
                              </h4>
                              <div className="space-y-2">
                                {content.lessons.map((lesson, index) => (
                                  <div key={index} className="flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                    <span className="text-sm">{lesson}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Resources */}
                            <div>
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Resources & Materials
                              </h4>
                              <div className="space-y-2">
                                {content.resources.map((resource, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-muted-foreground" />
                                    <Button
                                      variant="link"
                                      className="h-auto p-0 text-sm"
                                      onClick={() => handleResourceDownload(resource)}
                                    >
                                      {resource.includes('/') ? resource.split('/').pop() : resource}
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Start Full Lesson Button */}
                          <div className="mt-6 flex gap-3">
                            <Button onClick={() => navigate(`/course/week/${week}`)}>
                              <BookOpen className="w-4 h-4 mr-2" />
                              Start Full Lesson
                            </Button>
                          </div>

                          {/* Implementation Status */}
                          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                            <h5 className="font-medium mb-2">Implementation Notes:</h5>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Course structure and content uploaded and reviewed</li>
                              <li>• Ready for integration into learning management system</li>
                              <li>• Progress tracking and user engagement features available</li>
                              <li>• Community features and discussion forums planned</li>
                            </ul>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>

                {/* Quick Access to Resources */}
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Quick Access to Course Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        onClick={() => handleResourceDownload('/learning-resources/R_W_-_Personal_Budget_Worksheet.pdf')}
                        className="justify-start"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Budget Worksheet
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleResourceDownload('/learning-resources/Money_Mindset_Workbook.pdf')}
                        className="justify-start"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Money Mindset Workbook
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleResourceDownload('/learning-resources/Sober_Money_Mindset_-_Checklist.pdf')}
                        className="justify-start"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Mindset Checklist
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleResourceDownload('/learning-resources/Financial_Foundations_-_A_Roadmap_to_Stability_in_Recovery.pdf')}
                        className="justify-start"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Financial Foundations
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleResourceDownload('/learning-resources/A_Revolutionary_Approach_to_Sustainable_Recovery_1.pdf')}
                        className="justify-start"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Recovery Approach Guide
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseContentPreview;