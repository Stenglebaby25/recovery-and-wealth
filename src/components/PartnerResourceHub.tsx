import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ExternalLink, 
  Building2, 
  PiggyBank, 
  CreditCard, 
  Shield, 
  GraduationCap, 
  Heart,
  Star,
  Sparkles
} from 'lucide-react';

interface PartnerApp {
  name: string;
  description: string;
  category: string;
  url: string;
  featured?: boolean;
  recoveryFriendly?: boolean;
}

const partnerApps: PartnerApp[] = [
  // Banking
  {
    name: 'Varo Money',
    description: 'No-fee mobile banking with early direct deposit, high-yield savings, and no minimum balance requirements.',
    category: 'Banking',
    url: 'https://www.varomoney.com/',
    recoveryFriendly: true
  },
  {
    name: 'Chime',
    description: 'Fee-free mobile banking with automatic savings features and early paycheck access.',
    category: 'Banking',
    url: 'https://www.chime.com/',
    recoveryFriendly: true
  },
  {
    name: 'Cash App',
    description: 'Send and receive money, invest in stocks, and manage your finances from your phone.',
    category: 'Banking',
    url: 'https://cash.app/',
  },
  
  // Budgeting
  {
    name: 'YNAB',
    description: 'You Need A Budget - Award-winning budgeting app that helps you gain total control of your money.',
    category: 'Budgeting',
    url: 'https://www.ynab.com/',
    featured: true,
    recoveryFriendly: true
  },
  {
    name: 'RocketMoney',
    description: 'Track subscriptions, lower bills, and manage all your finances in one place.',
    category: 'Budgeting',
    url: 'https://www.rocketmoney.com/',
    featured: true
  },
  {
    name: 'Bright Money',
    description: 'AI-powered app that helps you pay off debt faster and build savings automatically.',
    category: 'Budgeting',
    url: 'https://www.brightmoney.co/',
    recoveryFriendly: true
  },
  
  // Credit
  {
    name: 'Credit Karma',
    description: 'Free credit scores, reports, and insights to help you understand and improve your credit.',
    category: 'Credit',
    url: 'https://www.creditkarma.com/',
    featured: true
  },
  {
    name: 'Experian',
    description: 'Monitor your credit report, get alerts, and access tools to improve your credit score.',
    category: 'Credit',
    url: 'https://www.experian.com/',
  },
  
  // Investing & Savings
  {
    name: 'Acorns',
    description: 'Invest spare change automatically with round-ups. Build an emergency fund and invest for the future effortlessly.',
    category: 'Investing',
    url: 'https://www.acorns.com/',
    featured: true,
    recoveryFriendly: true
  },
  {
    name: 'Stash',
    description: 'Start investing with as little as $5. Automated round-ups, budgeting tools, and Stock-Back rewards.',
    category: 'Investing',
    url: 'https://www.stash.com/',
    recoveryFriendly: true
  },
  {
    name: 'Fundrise',
    description: 'Start investing in real estate with as little as $10. Build long-term wealth through diversified portfolios.',
    category: 'Investing',
    url: 'https://fundrise.com/',
  },
  
  // Insurance
  {
    name: 'Lemonade',
    description: 'AI-powered insurance that\'s fast, affordable, and gives back to causes you care about.',
    category: 'Insurance',
    url: 'https://www.lemonade.com/',
  },
  
  // Education
  {
    name: 'Investopedia',
    description: 'The world\'s leading source of financial content on the web, from market news to investing strategies.',
    category: 'Education',
    url: 'https://www.investopedia.com/',
    featured: true
  },
  {
    name: 'Money Masters',
    description: 'Financial education platform teaching practical money management and wealth-building strategies.',
    category: 'Education',
    url: 'https://moneymasters.com/',
  },
  
  // Wellness
  {
    name: 'Online Therapy',
    description: 'Connect with licensed therapists from home. Affordable mental health support when you need it.',
    category: 'Wellness',
    url: 'https://www.onlinetherapy.com/',
    recoveryFriendly: true
  },
  {
    name: 'UltiSelf',
    description: 'Gamified self-improvement app that helps you build better habits and track personal growth.',
    category: 'Wellness',
    url: 'https://ultiself.com/',
    recoveryFriendly: true
  },
];

const categories = [
  { id: 'all', label: 'All Apps', icon: Sparkles },
  { id: 'Banking', label: 'Banking', icon: Building2 },
  { id: 'Budgeting', label: 'Budgeting', icon: PiggyBank },
  { id: 'Credit', label: 'Credit', icon: CreditCard },
  { id: 'Investing', label: 'Investing', icon: Building2 },
  { id: 'Insurance', label: 'Insurance', icon: Shield },
  { id: 'Education', label: 'Education', icon: GraduationCap },
  { id: 'Wellness', label: 'Wellness', icon: Heart },
];

const PartnerResourceHub = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredApps = selectedCategory === 'all' 
    ? partnerApps 
    : partnerApps.filter(app => app.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : Sparkles;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">Partner Resource Hub</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Curated tools and apps to support your financial recovery journey. 
          From budgeting to wellness, these resources are hand-picked to help you build lasting financial health.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-muted-foreground">Featured</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Recovery-Friendly</span>
          </div>
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="flex flex-wrap justify-center gap-2 h-auto bg-transparent">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app, index) => {
              const CategoryIcon = getCategoryIcon(app.category);
              return (
                <Card 
                  key={index} 
                  className={`hover:shadow-lg transition-all duration-300 ${
                    app.featured ? 'ring-2 ring-yellow-500/50 bg-yellow-50/5' : ''
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <CategoryIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {app.name}
                            {app.featured && (
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            )}
                          </CardTitle>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {app.category}
                          </Badge>
                        </div>
                      </div>
                      {app.recoveryFriendly && (
                        <Heart className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-sm leading-relaxed">
                      {app.description}
                    </CardDescription>
                    <Button 
                      variant="outline" 
                      className="w-full group"
                      onClick={() => window.open(app.url, '_blank', 'noopener,noreferrer')}
                    >
                      Visit {app.name}
                      <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="bg-muted/50 border-dashed">
        <CardContent className="py-6 text-center">
          <p className="text-sm text-muted-foreground">
            <strong>Disclosure:</strong> Some links may be affiliate links. We only recommend tools we believe 
            genuinely support your recovery and financial wellness journey. Your trust means everything to us.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerResourceHub;
