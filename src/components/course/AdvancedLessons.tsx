import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, Clock, ArrowLeft, ArrowRight, BookOpen, PenLine, Target, 
  Download, TrendingUp, Shield, Heart, Users, DollarSign, AlertTriangle,
  Lightbulb, FileText, ChevronRight, Lock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface AdvancedLesson {
  id: string;
  weekNumber: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  description: string;
  modules: {
    title: string;
    content: string[];
    keyStats?: string[];
  }[];
  quizQuestions: QuizQuestion[];
  reflectionPrompts: string[];
  downloadables: {
    title: string;
    description: string;
    filename: string;
  }[];
  practicalExercise: {
    title: string;
    steps: string[];
  };
}

interface LessonProgress {
  lessonId: string;
  completedAt: string | null;
  quizResponses: Record<string, number>;
  quizScore: number | null;
  reflectionNotes: string;
  selfAssessmentRating: number;
  exerciseStepsCompleted: boolean[];
}

const advancedLessons: AdvancedLesson[] = [
  {
    id: "insurance-essentials",
    weekNumber: 9,
    title: "Insurance Essentials",
    subtitle: "Protecting Your Recovery with the Right Coverage",
    icon: <Shield className="h-6 w-6 text-blue-500" />,
    description: "Insurance feels boring—until you need it. Learn which types of coverage protect you in recovery and which can wait.",
    modules: [
      {
        title: "Why This Matters",
        content: [
          "You're 8 months sober, working full-time, finally stable. Then you get in a car accident. $12,000 in medical bills. No health insurance. No disability coverage. Back to square one.",
          "Insurance feels boring—until you need it. Today you'll learn which types protect you in recovery and which can wait.",
          "The right insurance protects the stability you've worked so hard to build in recovery.",
          "Without proper coverage, one unexpected event can derail months or years of financial progress."
        ]
      },
      {
        title: "The 3 Types That Matter Most in Early Recovery",
        content: [
          "HEALTH INSURANCE: Covers therapy, doctor visits, prescriptions, emergencies. Where to get it: Employer, ACA marketplace (healthcare.gov), Medicaid. Cost: $0-$300/month depending on income and plan.",
          "Recovery-specific note: Mental health parity laws mean addiction treatment MUST be covered equally with other medical care.",
          "DISABILITY INSURANCE: Replaces income if you're too sick/injured to work. Types: Short-term (3-6 months) vs. long-term (years). Where to get it: Employer benefit (often free or cheap) or private policy.",
          "Why disability matters in recovery: If you relapse and need treatment again, disability insurance keeps income flowing while you heal.",
          "LIFE INSURANCE (If You Have Dependents): Pays out when you die to support kids/family. Types: Term (cheap, temporary) vs. whole life (expensive, permanent).",
          "When you need life insurance: If anyone depends on your income. When you don't: If you're single with no kids, skip it for now."
        ],
        keyStats: [
          "Mental health parity: Addiction treatment must be covered equally with medical care",
          "60% of bankruptcies are linked to medical bills",
          "Short-term disability from employers is often free or costs just $10-20/month"
        ]
      },
      {
        title: "What Can Wait",
        content: [
          "AUTO INSURANCE: Required by law, but shop for lowest rates. Not urgent to upgrade—just meet your state's minimum requirements for now.",
          "RENTERS INSURANCE: Cheap and smart ($15-30/month), protects your belongings. Important but not your first priority.",
          "UMBRELLA POLICIES: Advanced coverage for high-net-worth individuals. Ignore this entirely until you own property and have significant assets.",
          "Focus your energy and budget on the three essential types first. Everything else can come later as your financial stability grows."
        ]
      },
      {
        title: "Step-by-Step: Getting Covered",
        content: [
          "STEP 1 - Get Health Insurance (Priority #1): Check if your employer offers it (sign up during onboarding or open enrollment). If no employer coverage: Go to healthcare.gov, enter income, see if you qualify for subsidies. Low income? Apply for Medicaid at your state's website.",
          "Action: Set a reminder to sign up during open enrollment (November 1 - January 15).",
          "STEP 2 - Check for Disability Insurance: Ask HR: 'Do we have short-term or long-term disability benefits?' If yes, enroll (usually free or $10-20/month). If no, skip buying private policy for now (expensive, not urgent).",
          "STEP 3 - Life Insurance (Only If Needed): If you have kids: Get term life insurance (20-year term, $250K-500K coverage). Shop quotes at Policygenius.com or Term4Sale.com. If no dependents: Skip this entirely."
        ]
      }
    ],
    quizQuestions: [
      {
        id: "ins1",
        question: "Which insurance is MOST important in early recovery?",
        options: [
          "Life insurance",
          "Health insurance",
          "Disability insurance",
          "Auto insurance"
        ],
        correctAnswer: 1,
        explanation: "Health insurance is most critical because it covers therapy, medications, doctor visits, and emergencies—all essential for maintaining your recovery."
      },
      {
        id: "ins2",
        question: "If you're single with no kids, do you need life insurance?",
        options: [
          "Yes, everyone needs it",
          "No, you can skip it",
          "Only if you're over 40",
          "Only if you have a mortgage"
        ],
        correctAnswer: 1,
        explanation: "Life insurance is designed to support dependents after you die. If no one depends on your income, you can skip it and focus resources elsewhere."
      },
      {
        id: "ins3",
        question: "Where can you get free or low-cost health insurance if you're low income?",
        options: [
          "Medicaid",
          "Private insurance broker",
          "You can't, insurance is always expensive",
          "Only through an employer"
        ],
        correctAnswer: 0,
        explanation: "Medicaid provides free or low-cost health coverage for people with limited income. You can apply through your state's website or healthcare.gov."
      },
      {
        id: "ins4",
        question: "Why is disability insurance particularly important for someone in recovery?",
        options: [
          "It's required by law",
          "It pays for your medications",
          "It keeps income flowing if you need treatment again",
          "It provides life insurance benefits"
        ],
        correctAnswer: 2,
        explanation: "Disability insurance replaces your income if you can't work. If you relapse and need treatment, disability coverage ensures you still have money coming in."
      },
      {
        id: "ins5",
        question: "What does 'mental health parity' mean for your health insurance?",
        options: [
          "Mental health care costs extra",
          "Addiction treatment must be covered equally with other medical care",
          "You need separate insurance for mental health",
          "Mental health is optional coverage"
        ],
        correctAnswer: 1,
        explanation: "Mental health parity laws require insurance companies to cover addiction treatment and mental health care at the same level as physical health conditions."
      }
    ],
    reflectionPrompts: [
      "What would happen to your recovery if you faced a major medical expense right now without insurance? How would financial stress impact your sobriety?",
      "Have you ever avoided seeking treatment or therapy because of cost concerns? How might proper coverage change your approach to self-care?",
      "What's one insurance type you've been putting off that you now realize is important for protecting your recovery?"
    ],
    downloadables: [
      {
        title: "Insurance Coverage Checklist",
        description: "A printable checklist to track which insurance types you have and which you still need",
        filename: "insurance-checklist.pdf"
      },
      {
        title: "Health Insurance Enrollment Guide",
        description: "Step-by-step guide for signing up through your employer, healthcare.gov, or Medicaid",
        filename: "health-insurance-enrollment-guide.pdf"
      }
    ],
    practicalExercise: {
      title: "Insurance Coverage Checker",
      steps: [
        "Check: Do you currently have health insurance? If no, set a reminder for open enrollment (Nov 1 - Jan 15) or visit healthcare.gov today",
        "Check: Do you have kids or other dependents who rely on your income? If yes, get a term life insurance quote at Policygenius.com",
        "Check: Does your employer offer disability insurance? Ask HR this week and enroll if available",
        "Create your personalized to-do list based on your answers above",
        "Set a calendar reminder to review your insurance coverage every year during open enrollment",
        "Identify one insurance gap you can close this month and take the first step"
      ]
    }
  },
  {
    id: "tax-basics-recovery",
    weekNumber: 10,
    title: "Tax Basics & Recovery Deductions",
    subtitle: "Claiming What You're Owed from Treatment Expenses",
    icon: <DollarSign className="h-6 w-6 text-green-600" />,
    description: "Treatment, legal fees, therapy—lots of recovery expenses are tax-deductible. Learn what counts and how to claim it so you don't leave money on the table.",
    modules: [
      {
        title: "Why This Matters",
        content: [
          "You spent $25,000 on residential treatment last year. Your therapist told you that's tax-deductible. But you didn't know how to claim it, so you left $3,000 on the table.",
          "Treatment, legal fees, therapy—lots of recovery expenses are deductible. Today you'll learn what counts and how to claim it.",
          "Many people in recovery are unaware they can recoup thousands of dollars from treatment costs.",
          "Understanding these deductions can significantly reduce your tax burden and support your financial recovery."
        ]
      },
      {
        title: "What Recovery Expenses Are Tax-Deductible?",
        content: [
          "MEDICAL EXPENSES (If Over 7.5% of Your Income): Inpatient treatment (residential, detox), outpatient therapy/counseling, medication (including MAT like Suboxone, Vivitrol), transportation to treatment (mileage, gas, parking).",
          "NOT deductible: Sober living rent, non-medical support groups (AA/NA meetings, etc.).",
          "HOW IT WORKS: Add up ALL medical expenses for the year. If they're more than 7.5% of your income, you can deduct the excess.",
          "EXAMPLE: You earned $40,000. 7.5% = $3,000 threshold. Your treatment cost $25,000. You can deduct $22,000 ($25,000 - $3,000)."
        ],
        keyStats: [
          "7.5% threshold: Medical expenses must exceed 7.5% of adjusted gross income",
          "Average residential treatment costs $20,000-$40,000—often fully deductible",
          "Transportation at 67 cents/mile (2024 IRS rate) adds up quickly"
        ]
      },
      {
        title: "Other Recovery-Related Deductions",
        content: [
          "LEGAL FEES: If related to criminal case from addiction, sometimes deductible. Consult a tax professional for your specific situation.",
          "JOB TRAINING/EDUCATION: If you're learning a new career post-treatment, education expenses may be deductible or qualify for credits.",
          "CHILDCARE: If you need childcare while you're in treatment or attending therapy, you might qualify for the childcare tax credit.",
          "Keep records of everything—you never know what might qualify until you or a tax professional reviews it."
        ]
      },
      {
        title: "Step-by-Step: Claiming Your Deductions",
        content: [
          "STEP 1 - Gather Receipts: Treatment center bills, therapy session receipts, prescription receipts, mileage log (if you drove to appointments).",
          "STEP 2 - Add It Up: Use the worksheet (download below). Total all medical expenses for the tax year.",
          "STEP 3 - Compare to 7.5% Threshold: Your income × 0.075 = threshold. If your expenses are higher, you can deduct the difference.",
          "STEP 4 - File Your Taxes: You MUST itemize deductions (can't take the standard deduction if claiming medical expenses). Use tax software (FreeTaxUSA, TurboTax) or hire a CPA. Keep receipts for 7 years in case of audit."
        ]
      }
    ],
    quizQuestions: [
      {
        id: "tax1",
        question: "Can you deduct the cost of residential treatment?",
        options: [
          "Yes",
          "No",
          "Only if it's over $50,000",
          "Only if you have private insurance"
        ],
        correctAnswer: 0,
        explanation: "Yes! Residential treatment is considered a medical expense and is deductible if your total medical expenses exceed 7.5% of your income."
      },
      {
        id: "tax2",
        question: "What percentage of your income must medical expenses exceed to be deductible?",
        options: [
          "5%",
          "7.5%",
          "10%",
          "15%"
        ],
        correctAnswer: 1,
        explanation: "Medical expenses must exceed 7.5% of your adjusted gross income. You can only deduct the amount above that threshold."
      },
      {
        id: "tax3",
        question: "Can you deduct sober living rent?",
        options: [
          "Yes, it's part of treatment",
          "No, it's not considered medical",
          "Only the first 30 days",
          "Only if prescribed by a doctor"
        ],
        correctAnswer: 1,
        explanation: "Sober living rent is not considered a medical expense by the IRS, so it's not deductible. Only actual medical treatment costs qualify."
      },
      {
        id: "tax4",
        question: "If you earned $40,000 and spent $25,000 on treatment, how much can you deduct?",
        options: [
          "$25,000",
          "$22,000",
          "$3,000",
          "$0"
        ],
        correctAnswer: 1,
        explanation: "Your 7.5% threshold is $3,000 ($40,000 × 0.075). You can deduct the amount exceeding that: $25,000 - $3,000 = $22,000."
      },
      {
        id: "tax5",
        question: "Which of these is tax-deductible as a medical expense?",
        options: [
          "AA/NA meeting donations",
          "Sober living rent",
          "Transportation to therapy appointments",
          "Recovery retreat vacation"
        ],
        correctAnswer: 2,
        explanation: "Transportation to medical appointments (including therapy) is deductible at the IRS mileage rate. Keep a mileage log for documentation."
      }
    ],
    reflectionPrompts: [
      "What recovery-related expenses did you have this year that might be deductible? Make a list of everything you can remember.",
      "Have you been keeping receipts and records for your treatment costs? What system could you set up to track these going forward?",
      "How would an extra $1,000-$3,000 in tax savings impact your financial recovery this year?"
    ],
    downloadables: [
      {
        title: "Medical Expense Tracking Worksheet",
        description: "Track all your medical and treatment expenses throughout the year for easy tax filing",
        filename: "medical-expense-worksheet.pdf"
      },
      {
        title: "Recovery Tax Deductions Cheat Sheet",
        description: "Quick reference guide for what's deductible and what's not",
        filename: "recovery-tax-deductions-cheatsheet.pdf"
      }
    ],
    practicalExercise: {
      title: "Medical Deduction Calculator",
      steps: [
        "Calculate your annual income (adjusted gross income from last year's tax return)",
        "Multiply your income by 0.075 to find your threshold",
        "Add up all treatment costs: residential, outpatient, detox",
        "Add therapy and counseling session costs",
        "Add prescription costs (including MAT medications)",
        "Add transportation costs (mileage × $0.67/mile for 2024)",
        "Calculate your total deduction: Total expenses minus your 7.5% threshold",
        "Estimate tax savings: Deduction × your tax bracket (22% for most middle incomes)"
      ]
    }
  },
  {
    id: "investment-fundamentals",
    weekNumber: 11,
    title: "Investment Fundamentals",
    subtitle: "Building Wealth Through Compound Interest",
    icon: <TrendingUp className="h-6 w-6 text-emerald-500" />,
    description: "Starting small NOW—even $25/month—could mean $100,000+ by retirement. Learn the basics of 401(k)s, Roth IRAs, and index funds without the overwhelm.",
    modules: [
      {
        title: "Why This Matters",
        content: [
          "You're 35, one year sober, finally have a steady job with benefits. Your employer offers a 401(k) with 50% matching. But you're scared of 'investing' because you lost everything during addiction.",
          "Here's the truth: Starting small NOW—even $25/month—could mean $100,000+ by retirement.",
          "Today you'll learn the basics of investing in a way that supports your recovery, not threatens it.",
          "The goal isn't to get rich quick—it's to build steady, boring wealth that gives you security and peace of mind."
        ]
      },
      {
        title: "The Big Idea: Compound Interest",
        content: [
          "You invest money → It grows → The growth ALSO grows. This is compound interest, and it's the most powerful wealth-building tool that exists.",
          "EXAMPLE: $100/month for 30 years at 7% return = $122,000. You only put in $36,000! The rest is growth on growth.",
          "The earlier you start, the more time compound interest has to work. Even small amounts matter enormously over decades.",
          "Einstein allegedly called compound interest 'the eighth wonder of the world.' Whether he said it or not, it's true."
        ],
        keyStats: [
          "$100/month for 30 years at 7% = $122,000 (you only contributed $36,000)",
          "Starting 10 years earlier can nearly double your retirement savings",
          "The S&P 500 has historically returned about 10% annually over the long term"
        ]
      },
      {
        title: "Where to Invest (In Order)",
        content: [
          "1. EMPLOYER 401(k) - START HERE: Pre-tax money goes in automatically from your paycheck. Employer match = FREE MONEY (if they match 50%, that's an instant 50% return!). Pick investments (usually target-date funds—set it and forget it). Contribute at LEAST enough to get the full employer match.",
          "2. ROTH IRA - AFTER YOU MAX THE MATCH: You contribute after-tax money, but it grows tax-free forever. Withdraw tax-free in retirement. 2024 limit: $7,000/year. Where to open: Vanguard, Fidelity, Schwab.",
          "3. INDEX FUNDS - THE EASY WAY: Baskets of stocks that track the whole market (like S&P 500). Low fees, automatic diversification, no stock-picking required. Example: VTSAX (Vanguard Total Stock Market), FXAIX (Fidelity 500 Index)."
        ]
      },
      {
        title: "What NOT to Do",
        content: [
          "DON'T pick individual stocks—too risky and requires constant attention that can become obsessive.",
          "DON'T invest in crypto if you're in early recovery—too volatile, too addictive, too much like gambling.",
          "DON'T try to 'time the market'—just invest consistently every month regardless of what the market is doing.",
          "DON'T check your investments daily—it causes anxiety and leads to bad emotional decisions. Quarterly or annually is enough."
        ]
      },
      {
        title: "Step-by-Step: Getting Started",
        content: [
          "STEP 1 - Sign Up for 401(k): Ask HR for enrollment form. Contribute at least enough to get full match (usually 3-6% of salary). Pick a target-date fund (example: 'Target 2050' if you're retiring around then).",
          "STEP 2 - Open a Roth IRA (Optional, After 401k): Go to Vanguard.com or Fidelity.com. Open Roth IRA (15 minutes, free). Set up automatic monthly transfer ($50, $100, whatever you can afford). Buy an index fund (VTSAX, FXAIX, etc.).",
          "STEP 3 - Set It and Forget It: Don't check daily (causes anxiety and bad decisions). Check quarterly or annually. Increase contributions when you get raises."
        ]
      }
    ],
    quizQuestions: [
      {
        id: "invf1",
        question: "What's the #1 rule of 401(k) investing?",
        options: [
          "Pick individual stocks for higher returns",
          "Contribute enough to get the full employer match",
          "Wait until you're completely debt-free",
          "Check your balance daily to stay informed"
        ],
        correctAnswer: 1,
        explanation: "Always contribute at least enough to get your full employer match—it's literally free money. A 50% match is an instant 50% return on your investment."
      },
      {
        id: "invf2",
        question: "What are index funds?",
        options: [
          "Baskets of many stocks that track the market",
          "High-risk individual stock picks",
          "Savings accounts with higher interest",
          "Cryptocurrency investments"
        ],
        correctAnswer: 0,
        explanation: "Index funds are baskets of many stocks that track a market index (like the S&P 500). They offer automatic diversification with low fees."
      },
      {
        id: "invf3",
        question: "Should you check your investments daily?",
        options: [
          "Yes, stay on top of every market movement",
          "No, check quarterly or annually",
          "Only when the market is going up",
          "Yes, but only before making trades"
        ],
        correctAnswer: 1,
        explanation: "Checking daily causes anxiety and leads to emotional decisions. Quarterly or annual reviews are sufficient for long-term investors and better for your recovery."
      },
      {
        id: "invf4",
        question: "If you invest $100/month for 30 years at 7% return, approximately how much will you have?",
        options: [
          "$36,000",
          "$72,000",
          "$122,000",
          "$200,000"
        ],
        correctAnswer: 2,
        explanation: "Thanks to compound interest, $100/month for 30 years at 7% grows to about $122,000—even though you only contributed $36,000. The rest is compound growth!"
      },
      {
        id: "invf5",
        question: "Why should people in early recovery avoid cryptocurrency?",
        options: [
          "It's illegal",
          "It's too volatile and can trigger addictive behaviors",
          "It doesn't earn any returns",
          "Banks don't allow it"
        ],
        correctAnswer: 1,
        explanation: "Cryptocurrency is extremely volatile and the constant price swings can trigger the same dopamine-seeking behaviors as gambling or substance use."
      }
    ],
    reflectionPrompts: [
      "What fears or past experiences have kept you from investing? How might you approach it differently now that you're in recovery?",
      "Does your employer offer a 401(k) with matching? If so, are you contributing enough to get the full match?",
      "What amount—even if small—could you realistically start investing each month without stressing your budget?"
    ],
    downloadables: [
      {
        title: "Investment Getting Started Checklist",
        description: "Step-by-step checklist for setting up your 401(k) and Roth IRA",
        filename: "investment-getting-started-checklist.pdf"
      },
      {
        title: "Compound Interest Calculator Guide",
        description: "How to project your retirement savings based on different contribution amounts",
        filename: "compound-interest-guide.pdf"
      }
    ],
    practicalExercise: {
      title: "Compound Interest Calculator",
      steps: [
        "Determine your monthly contribution amount (start with what you can afford, even $25)",
        "Note your current age and target retirement age",
        "Use a compound interest calculator (investor.gov has a free one)",
        "Calculate your projected balance at retirement with 7% average return",
        "See how much of that total is YOUR contributions vs. compound growth",
        "Try increasing your monthly contribution by $25—see how much more you'd have",
        "If you have a 401(k), calculate the total with employer match included",
        "Set a goal to increase contributions by 1% each year"
      ]
    }
  },
  {
    id: "healthy-money-boundaries",
    weekNumber: 11,
    title: "Healthy Money Boundaries",
    subtitle: "Protecting Your Financial Recovery in Relationships",
    icon: <Shield className="h-6 w-6 text-blue-500" />,
    description: "Learn to establish and maintain healthy financial boundaries with family, friends, and partners while managing codependency patterns that threaten your recovery.",
    modules: [
      {
        title: "Understanding Financial Codependency",
        content: [
          "Financial codependency is the pattern of using money to control, rescue, or maintain unhealthy relationships.",
          "Common signs in recovery include: Lending money you can't afford to lose, paying others' bills to avoid conflict, hiding financial decisions from partners.",
          "You may feel responsible for others' financial problems or use money to 'fix' relationships.",
          "Just as you set boundaries around substances/behaviors, money boundaries protect your sobriety and wellbeing.",
          "Financial codependency often stems from a need for approval, fear of abandonment, or low self-worth."
        ],
        keyStats: [
          "60% of family loans are never repaid",
          "Unpaid loans damage relationships more than saying no upfront",
          "Financial stress is a leading trigger for relapse in recovery"
        ]
      },
      {
        title: "Setting Boundaries with Family",
        content: [
          "The 'loving no' framework: You can love someone AND decline to lend them money. These are not mutually exclusive.",
          "Practice phrases before difficult conversations: 'I love you AND I can't lend you money right now.'",
          "Create a personal rule that becomes your default response: 'I don't lend money, but I can help you find resources.'",
          "Use the 24-hour rule: Wait a day before making any financial decision involving family members.",
          "Set up separate accounts that family members cannot access to protect your financial boundaries.",
          "Remember: Saying no to a request is not the same as rejecting the person."
        ]
      },
      {
        title: "Friend Boundaries & Social Pressure",
        content: [
          "Navigating social situations requires preparation and practice.",
          "How to decline splitting bills unequally without shame: 'I'm paying for just my meal today.'",
          "Managing 'rounds' culture: 'I'm not drinking, so I'll handle my own tab separately.'",
          "Finding free or low-cost ways to connect that don't center around spending.",
          "Script examples: 'I'm on a tight budget this month, can we do [free alternative]?'",
          "Red flags to watch for: Friends who only reach out when they need money, pressure to spend beyond your means, guilt-tripping about financial choices."
        ]
      },
      {
        title: "When (and How) to Help",
        content: [
          "The gift vs. loan decision tree: Can you afford to never see this money again? Will this enable unhealthy behavior?",
          "Ask yourself: Are you giving out of guilt or genuine desire to help?",
          "Healthy alternatives to giving cash: Offer time instead (help with job search, resume), connect them to resources (food banks, assistance programs).",
          "One-time grocery/gas gift card with clear boundaries is often better than cash.",
          "If you do lend: Get it in writing even with family, set up automatic payments, never cosign for anyone.",
          "Remember: Your financial stability is essential to your recovery. You cannot pour from an empty cup."
        ]
      }
    ],
    quizQuestions: [
      {
        id: "bound1",
        question: "What is financial codependency?",
        options: [
          "Having joint bank accounts with a partner",
          "Using money to control, rescue, or maintain unhealthy relationships",
          "Budgeting together as a family",
          "Saving money for retirement"
        ],
        correctAnswer: 1,
        explanation: "Financial codependency involves using money in unhealthy ways to manage relationships, often at the expense of your own financial wellbeing and recovery."
      },
      {
        id: "bound2",
        question: "According to studies, what percentage of family loans are never repaid?",
        options: ["20%", "40%", "60%", "80%"],
        correctAnswer: 2,
        explanation: "Studies show that 60% of family loans are never repaid, and unpaid loans often damage relationships more than saying no upfront would have."
      },
      {
        id: "bound3",
        question: "What is the recommended waiting period before making financial decisions involving family?",
        options: ["1 hour", "12 hours", "24 hours", "1 week"],
        correctAnswer: 2,
        explanation: "The 24-hour rule gives you time to step back from emotional pressure and make a thoughtful decision about financial requests from family."
      },
      {
        id: "bound4",
        question: "Which is a healthy alternative to giving cash when someone asks for help?",
        options: [
          "Cosigning a loan for them",
          "Connecting them to resources like food banks or assistance programs",
          "Taking on their debt yourself",
          "Ignoring their request completely"
        ],
        correctAnswer: 1,
        explanation: "Connecting someone to appropriate resources helps them without risking your financial stability or enabling unhealthy dependency."
      }
    ],
    reflectionPrompts: [
      "Think about a time when you felt pressured to give money you couldn't afford. How did it affect your recovery?",
      "What personal rules could you establish as your default response to financial requests?",
      "Who in your life respects your financial boundaries? Who might need clearer communication about them?"
    ],
    downloadables: [
      {
        title: "Boundary-Setting Scripts",
        description: "Word-for-word scripts for difficult money conversations with family and friends",
        filename: "boundary-scripts.pdf"
      },
      {
        title: "Gift vs. Loan Decision Tree",
        description: "A visual flowchart to help you decide when and how to help financially",
        filename: "gift-loan-decision-tree.pdf"
      }
    ],
    practicalExercise: {
      title: "Financial Boundary Inventory",
      steps: [
        "List all current financial commitments involving family or friends",
        "Identify any loans you've made that haven't been repaid",
        "Rate each relationship's respect for your financial boundaries (1-10)",
        "Write out three personal financial rules that will be your default responses",
        "Practice saying your boundary phrases out loud until they feel natural",
        "Identify one boundary conversation you need to have and schedule it"
      ]
    }
  },
  {
    id: "investment-vs-gambling",
    weekNumber: 12,
    title: "Investment vs. Gambling",
    subtitle: "Protecting Your Recovery in Financial Markets",
    icon: <AlertTriangle className="h-6 w-6 text-orange-500" />,
    description: "Learn to distinguish between disciplined investing and gambling behaviors that can trigger relapse. Understand the warning signs and establish guardrails for recovery-safe wealth building.",
    modules: [
      {
        title: "Key Distinctions: Investing vs. Gambling",
        content: [
          "INVESTING characteristics: Long-term horizon, diversified across many assets, research-based decisions, 'boring' is good.",
          "GAMBLING characteristics: Quick results sought, high risk concentrated in one area, emotional decision-making, thrill-seeking behavior.",
          "The same dopamine hit that fueled addiction can be triggered by day trading, crypto speculation, or high-risk options.",
          "Legitimate investing feels mundane - you set it up and mostly forget about it. If it's exciting, it might be gambling.",
          "The goal of recovery-focused investing is steady, long-term growth - not the adrenaline rush of big wins."
        ]
      },
      {
        title: "Warning Signs You're Gambling, Not Investing",
        content: [
          "Checking your portfolio multiple times daily (or hourly)",
          "Using money you need for bills, rent, or essential expenses",
          "Feeling euphoric with gains or desperate/depressed with losses",
          "Trading on 'hot tips' from social media, friends, or online forums",
          "Hiding your trading activity from family or sponsor",
          "Chasing losses by making bigger, riskier trades",
          "Losing sleep over market movements or positions",
          "Borrowing money or using credit to invest"
        ],
        keyStats: [
          "Day traders lose money 70-90% of the time",
          "The average day trader underperforms a simple index fund",
          "Gambling addiction affects 2-3% of the population, with higher rates in recovery"
        ]
      },
      {
        title: "Recovery-Safe Investment Foundation",
        content: [
          "The 'boring wealth' strategy focuses on: Index funds (own small pieces of 500+ companies), target-date retirement funds (automatically adjust risk as you age), dollar-cost averaging (invest same amount monthly).",
          "Why this works for recovery: Removes emotional decision-making, no daily monitoring needed, historically returns 7-10% annually over long term.",
          "Start small: Even $25/month grows to $15,000+ over 20 years at 8% return.",
          "Use 'boring' brokerages like Vanguard or Fidelity - not gamified apps with confetti animations.",
          "Automate everything: Set up automatic transfers and investments so you're not 'choosing' each month."
        ]
      },
      {
        title: "Red Flags to Avoid Completely",
        content: [
          "Cryptocurrency: Extreme volatility triggers addictive patterns, 24/7 trading feeds compulsive checking.",
          "Options trading: High-risk, fast-paced, can lose more than you invest.",
          "Penny stocks: Manipulated markets, 'get rich quick' mentality, extreme volatility.",
          "Margin trading: Borrowing money to invest amplifies losses and can trigger financial crisis.",
          "Meme stocks: Driven by social media hype, not fundamentals - pure speculation.",
          "Forex trading: Extremely volatile, leveraged, and marketed to gamblers.",
          "Sports betting apps and prediction markets disguised as 'investing'."
        ]
      }
    ],
    quizQuestions: [
      {
        id: "gamb1",
        question: "Which behavior is a warning sign of gambling rather than investing?",
        options: [
          "Investing the same amount monthly regardless of market conditions",
          "Checking your portfolio multiple times per day",
          "Owning a diversified index fund",
          "Setting up automatic investments"
        ],
        correctAnswer: 1,
        explanation: "Compulsively checking your portfolio multiple times daily is a sign of gambling behavior, not disciplined long-term investing."
      },
      {
        id: "gamb2",
        question: "What percentage of day traders lose money over time?",
        options: ["30-40%", "50-60%", "70-90%", "10-20%"],
        correctAnswer: 2,
        explanation: "Studies consistently show that 70-90% of day traders lose money, underperforming simple buy-and-hold strategies."
      },
      {
        id: "gamb3",
        question: "Why is cryptocurrency particularly risky for people in recovery?",
        options: [
          "It always loses value",
          "Extreme volatility and 24/7 trading feed compulsive patterns",
          "It's illegal to own",
          "It requires too much starting capital"
        ],
        correctAnswer: 1,
        explanation: "Cryptocurrency's extreme price swings and round-the-clock availability can trigger the same dopamine-seeking behaviors that fuel addiction."
      },
      {
        id: "gamb4",
        question: "What is the 'boring wealth' strategy?",
        options: [
          "Day trading stocks for excitement",
          "Investing in volatile penny stocks",
          "Using index funds, target-date funds, and dollar-cost averaging",
          "Timing the market based on news"
        ],
        correctAnswer: 2,
        explanation: "The 'boring wealth' strategy uses diversified, automated, long-term investments that remove emotional decision-making - perfect for recovery."
      }
    ],
    reflectionPrompts: [
      "Have you ever felt a 'rush' from financial activities? What was happening?",
      "What specific platforms or investment types might be triggers for you personally?",
      "How can you make your investment approach as 'boring' as possible while still building wealth?"
    ],
    downloadables: [
      {
        title: "Investing vs. Gambling Self-Assessment",
        description: "A questionnaire to evaluate if your investment behaviors are recovery-safe",
        filename: "investing-gambling-assessment.pdf"
      },
      {
        title: "Recovery-Safe Brokerage Comparison",
        description: "Compare 'boring' brokerages that support long-term investing",
        filename: "brokerage-comparison.pdf"
      }
    ],
    practicalExercise: {
      title: "Investment Behavior Audit",
      steps: [
        "List all financial apps on your phone - delete any gamified trading apps",
        "Calculate how often you check financial accounts (be honest)",
        "Identify any 'exciting' investments and evaluate if they're truly investments or gambling",
        "Set up automatic investing with a boring brokerage if you haven't already",
        "Create a rule: No checking investments more than once per month (or quarter)",
        "Share your investment plan with your sponsor or accountability partner"
      ]
    }
  },
  {
    id: "building-wealth-plan",
    weekNumber: 13,
    title: "Building Your Wealth Plan",
    subtitle: "A Recovery-Friendly Roadmap to Financial Security",
    icon: <Target className="h-6 w-6 text-purple-500" />,
    description: "Create a structured wealth-building plan that prioritizes stability and removes emotional decision-making from your financial life.",
    modules: [
      {
        title: "The Recovery-Friendly Wealth Hierarchy",
        content: [
          "Step 1 - EMERGENCY FUND: Build 3-6 months of expenses in high-yield savings. This prevents crisis-mode decisions that can trigger relapse.",
          "Step 2 - EMPLOYER 401(k): Contribute enough to get the full company match. This is free money - don't leave it on the table.",
          "Step 3 - PAY OFF HIGH-INTEREST DEBT: Credit cards and personal loans over 7% interest should be paid off before investing further.",
          "Step 4 - ROTH IRA: Contribute up to $7,000/year. Money grows tax-free and can be withdrawn in retirement without taxes.",
          "Step 5 - ADDITIONAL 401(k): Max out your 401(k) contributions ($23,000/year for under 50).",
          "Step 6 - TAXABLE BROKERAGE: After maxing tax-advantaged accounts, invest in index funds in a regular brokerage account."
        ],
        keyStats: [
          "A $500/month investment from age 25 grows to over $1 million by 65 at 8% return",
          "Company 401(k) match is typically 3-6% - that's an immediate 100% return",
          "Starting 10 years earlier matters more than investing twice as much later"
        ]
      },
      {
        title: "Understanding Time Horizons",
        content: [
          "Money needed in 0-3 years: Keep in high-yield savings account. This is not money to invest - you need it accessible and stable.",
          "Money needed in 3-10 years: Use a conservative balanced fund (60% bonds, 40% stocks) for moderate growth with less volatility.",
          "Money not needed for 10+ years: Invest in stock index funds. You have time to ride out market downturns.",
          "Your emergency fund is NEVER invested - it stays liquid in savings.",
          "As you get closer to needing money (retirement, home purchase), gradually shift to more conservative investments."
        ]
      },
      {
        title: "Automation: Your Recovery Superpower",
        content: [
          "Automate everything possible to remove emotional decision-making from your finances.",
          "Set up automatic transfers to savings on payday - pay yourself first.",
          "Configure automatic 401(k) contributions at your target percentage.",
          "Schedule automatic IRA contributions monthly.",
          "Use automatic bill pay for fixed expenses to avoid late fees and stress.",
          "The goal: Your wealth builds while you focus on recovery, not finances."
        ]
      },
      {
        title: "Creating Your Personal Plan",
        content: [
          "Calculate your monthly 'investing number' - the amount you can reliably invest after essential expenses.",
          "Start with what you can afford, even if it's $25/month. Consistency matters more than amount.",
          "Increase your investing amount by 1% each year or whenever you get a raise.",
          "Review your plan quarterly (not more often) to ensure you're on track.",
          "Celebrate milestones: First $1,000 invested, first $10,000, emergency fund complete, etc.",
          "Share your goals with your accountability partner or sponsor."
        ]
      }
    ],
    quizQuestions: [
      {
        id: "wealth1",
        question: "What should you build FIRST in the recovery-friendly wealth hierarchy?",
        options: [
          "Stock portfolio",
          "Emergency fund of 3-6 months expenses",
          "Cryptocurrency investments",
          "Individual stock picks"
        ],
        correctAnswer: 1,
        explanation: "An emergency fund prevents financial crises that can trigger relapse and gives you stability before investing in the market."
      },
      {
        id: "wealth2",
        question: "How should you handle money you'll need within 3 years?",
        options: [
          "Invest in aggressive growth stocks",
          "Put it in cryptocurrency for quick gains",
          "Keep it in a high-yield savings account",
          "Use it for day trading"
        ],
        correctAnswer: 2,
        explanation: "Money needed in the short term should stay in stable, accessible savings - not invested where it could lose value when you need it."
      },
      {
        id: "wealth3",
        question: "Why is automation important for people in recovery?",
        options: [
          "It makes trading faster",
          "It removes emotional decision-making from finances",
          "It allows more frequent trading",
          "It's required by law"
        ],
        correctAnswer: 1,
        explanation: "Automation removes the temptation to make emotional decisions about money, letting your wealth build consistently while you focus on recovery."
      },
      {
        id: "wealth4",
        question: "What is the '401(k) match' and why is it important?",
        options: [
          "A gambling game offered by employers",
          "Free money from your employer when you contribute to retirement",
          "A tax penalty for early withdrawal",
          "A type of high-risk investment"
        ],
        correctAnswer: 1,
        explanation: "Many employers match your 401(k) contributions up to a certain percentage - this is essentially free money and an immediate 100% return on those dollars."
      }
    ],
    reflectionPrompts: [
      "What is your current emergency fund status? How would having 3-6 months saved change your stress levels?",
      "What automatic transfers could you set up this week to start building wealth?",
      "How does having a clear financial plan support your overall recovery?"
    ],
    downloadables: [
      {
        title: "Wealth Building Priority Worksheet",
        description: "A step-by-step worksheet to map out your personal wealth hierarchy",
        filename: "wealth-priority-worksheet.pdf"
      },
      {
        title: "Automation Setup Guide",
        description: "Instructions for automating your savings, investments, and bill payments",
        filename: "automation-setup-guide.pdf"
      }
    ],
    practicalExercise: {
      title: "Create Your Wealth Blueprint",
      steps: [
        "Calculate your current monthly surplus (income minus essential expenses)",
        "Determine where you are in the wealth hierarchy (emergency fund, 401(k), etc.)",
        "Set a specific goal for the next 90 days (e.g., 'Save $1,000 in emergency fund')",
        "Set up one new automatic transfer this week",
        "Calculate what your investments could grow to in 10, 20, and 30 years",
        "Schedule a quarterly review date on your calendar"
      ]
    }
  },
  {
    id: "protecting-recovery-investing",
    weekNumber: 14,
    title: "Protecting Recovery in Investing",
    subtitle: "Guardrails, Accountability, and Long-Term Success",
    icon: <Heart className="h-6 w-6 text-red-500" />,
    description: "Establish protective guardrails, build accountability systems, and create a sustainable approach to wealth building that supports lifelong recovery.",
    modules: [
      {
        title: "Setting Up Financial Guardrails",
        content: [
          "Guardrail #1: Automate investments so you're not 'choosing' each month - removes the temptation to tinker.",
          "Guardrail #2: Limit yourself to checking your portfolio quarterly, not daily. Set a specific date for reviews.",
          "Guardrail #3: Delete all day-trading apps and gamified investment platforms from your devices.",
          "Guardrail #4: Use 'boring' brokerages (Vanguard, Fidelity, Schwab) that don't gamify investing with confetti and notifications.",
          "Guardrail #5: Never invest money you can't afford to lose or that you'll need within 3 years.",
          "Guardrail #6: If you feel an urge to 'do something' with your investments, that's a red flag - pause and call someone."
        ]
      },
      {
        title: "The 10% Play Money Rule",
        content: [
          "If you genuinely want to 'play' with riskier investments, limit it to 10% of your total portfolio.",
          "This 10% is money you must be 100% prepared to lose completely.",
          "Never use emergency fund money, bill money, or debt repayment money for 'play' investments.",
          "Track this separately and be honest with yourself about your motivations.",
          "If you find yourself wanting to increase this 10%, that's a warning sign to discuss with your sponsor.",
          "Many people in recovery choose to skip 'play money' entirely - and that's a valid, often wise choice."
        ]
      },
      {
        title: "Building Investment Accountability",
        content: [
          "Share your investment plan with your sponsor, counselor, or accountability partner - just like your recovery plan.",
          "Check in regularly about your investing behaviors, not just your investment performance.",
          "If you feel the urge to make impulsive trades, that's when to call someone - before you act.",
          "Consider having a trusted person who can see your investment accounts for accountability.",
          "Treat hiding investment activity like hiding substance use - it's a major red flag.",
          "Your support network should know your investing guardrails and help you maintain them."
        ]
      },
      {
        title: "Long-Term Success Mindset",
        content: [
          "Investing success is measured in decades, not days or weeks. Embrace the long view.",
          "Market downturns are normal and expected - don't panic sell when they happen.",
          "Your recovery is more valuable than any investment return. Never jeopardize it for money.",
          "Celebrate consistency over returns: 12 months of automated investing is a win regardless of market performance.",
          "Review and adjust your plan annually, but resist the urge to constantly optimize.",
          "Financial security supports recovery, but recovery always comes first."
        ]
      }
    ],
    quizQuestions: [
      {
        id: "prot1",
        question: "How often should you check your investment portfolio?",
        options: [
          "Multiple times per day",
          "Daily",
          "Weekly",
          "Quarterly"
        ],
        correctAnswer: 3,
        explanation: "Quarterly reviews prevent the compulsive checking that can trigger addictive behaviors. More frequent checking doesn't improve returns and can harm your recovery."
      },
      {
        id: "prot2",
        question: "What is the maximum percentage of your portfolio for 'play' investments?",
        options: ["50%", "25%", "10%", "None - all investing should be boring"],
        correctAnswer: 2,
        explanation: "If you choose to have 'play money' for riskier investments, limit it to 10% maximum - money you're fully prepared to lose."
      },
      {
        id: "prot3",
        question: "What should you do if you feel an urge to make impulsive trades?",
        options: [
          "Act quickly before you change your mind",
          "Pause and call your sponsor or accountability partner",
          "Double down on the trade",
          "Check social media for investment tips"
        ],
        correctAnswer: 1,
        explanation: "Urges to make impulsive trades are red flags. The healthy response is to pause and reach out to someone in your support network before taking action."
      },
      {
        id: "prot4",
        question: "Why should you use 'boring' brokerages like Vanguard instead of gamified apps?",
        options: [
          "They have better returns",
          "They're required by law for recovery",
          "They don't trigger dopamine-seeking behaviors with notifications and confetti",
          "They're cheaper"
        ],
        correctAnswer: 2,
        explanation: "Gamified apps with confetti, notifications, and social features are designed to trigger the same dopamine responses that can be dangerous in recovery."
      }
    ],
    reflectionPrompts: [
      "What specific guardrails do you need to put in place for your investing approach?",
      "Who in your life could serve as an accountability partner for your financial decisions?",
      "How does the phrase 'recovery always comes first' apply to your relationship with money?"
    ],
    downloadables: [
      {
        title: "Investment Guardrails Worksheet",
        description: "Define your personal rules and boundaries for investing",
        filename: "investment-guardrails.pdf"
      },
      {
        title: "Financial Accountability Agreement",
        description: "A template for discussing investment accountability with your sponsor",
        filename: "financial-accountability-agreement.pdf"
      }
    ],
    practicalExercise: {
      title: "Build Your Protection Plan",
      steps: [
        "Write out your top 5 personal investment guardrails",
        "Identify and delete any gamified financial apps from your devices",
        "Choose a 'boring' brokerage and research how to open an account",
        "Schedule a conversation with your sponsor about your investing plan",
        "Set up calendar reminders for quarterly (not more frequent) portfolio reviews",
        "Write a personal commitment statement about how investing supports your recovery"
      ]
    }
  }
];

const AdvancedLessons = () => {
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  
  // Progress tracking
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgress>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [reflectionNotes, setReflectionNotes] = useState("");
  const [selfRating, setSelfRating] = useState([5]);
  const [exerciseSteps, setExerciseSteps] = useState<boolean[]>([]);

  const currentLesson = advancedLessons[currentLessonIndex];

  useEffect(() => {
    if (user) {
      loadProgress();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Reset state when lesson changes
    const savedProgress = lessonProgress[currentLesson.id];
    if (savedProgress) {
      setQuizAnswers(savedProgress.quizResponses || {});
      setReflectionNotes(savedProgress.reflectionNotes || "");
      setSelfRating([savedProgress.selfAssessmentRating || 5]);
      setExerciseSteps(savedProgress.exerciseStepsCompleted || new Array(currentLesson.practicalExercise.steps.length).fill(false));
    } else {
      setQuizAnswers({});
      setReflectionNotes("");
      setSelfRating([5]);
      setExerciseSteps(new Array(currentLesson.practicalExercise.steps.length).fill(false));
    }
    setActiveTab("overview");
  }, [currentLessonIndex, lessonProgress]);

  const loadProgress = async () => {
    if (!user) return;
    
    try {
      // For now, use localStorage as fallback since we don't have a dedicated table
      const saved = localStorage.getItem(`advanced_lessons_progress_${user.id}`);
      if (saved) {
        setLessonProgress(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProgress = async (lessonId: string, updates: Partial<LessonProgress>) => {
    if (!user) return;
    
    const updatedProgress = {
      ...lessonProgress,
      [lessonId]: {
        ...lessonProgress[lessonId],
        lessonId,
        ...updates
      }
    };
    
    setLessonProgress(updatedProgress);
    localStorage.setItem(`advanced_lessons_progress_${user.id}`, JSON.stringify(updatedProgress));
  };

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    const newAnswers = { ...quizAnswers, [questionId]: answerIndex };
    setQuizAnswers(newAnswers);
    saveProgress(currentLesson.id, { quizResponses: newAnswers });
  };

  const handleReflectionSave = () => {
    saveProgress(currentLesson.id, { reflectionNotes });
    toast({
      title: "Reflections saved",
      description: "Your journal entry has been saved."
    });
  };

  const handleRatingSave = () => {
    saveProgress(currentLesson.id, { selfAssessmentRating: selfRating[0] });
    toast({
      title: "Self-assessment saved",
      description: "Your rating has been recorded."
    });
  };

  const handleExerciseToggle = (index: number) => {
    const newSteps = [...exerciseSteps];
    newSteps[index] = !newSteps[index];
    setExerciseSteps(newSteps);
    saveProgress(currentLesson.id, { exerciseStepsCompleted: newSteps });
  };

  const calculateQuizScore = () => {
    const questions = currentLesson.quizQuestions;
    let correct = 0;
    questions.forEach(q => {
      if (quizAnswers[q.id] === q.correctAnswer) correct++;
    });
    return Math.round((correct / questions.length) * 100);
  };

  const markLessonComplete = () => {
    const quizScore = calculateQuizScore();
    saveProgress(currentLesson.id, { 
      completedAt: new Date().toISOString(),
      quizScore 
    });
    toast({
      title: "Lesson completed!",
      description: `You scored ${quizScore}% on the quiz. Great work on Week ${currentLesson.weekNumber}!`
    });
  };

  const isLessonComplete = (lessonId: string) => {
    return lessonProgress[lessonId]?.completedAt !== null && lessonProgress[lessonId]?.completedAt !== undefined;
  };

  const getCompletedCount = () => {
    return advancedLessons.filter(l => isLessonComplete(l.id)).length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 pt-24 text-center">
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 pt-24">
          <Card className="max-w-2xl mx-auto text-center p-8">
            <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to access the Advanced Recovery Lessons and track your progress.
            </p>
            <Button asChild>
              <Link to="/auth">Sign In to Continue</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 pt-24">
          <Card className="max-w-2xl mx-auto text-center p-8">
            <Lock className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Premium Content</h2>
            <p className="text-muted-foreground mb-6">
              Advanced Recovery Lessons (Weeks 10-14) are available to premium members. 
              Upgrade to access investment basics, wealth building strategies, and recovery-focused financial guardrails.
            </p>
            <Button asChild>
              <Link to="/pricing">Upgrade to Premium</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-12 pt-24">
        {/* Header */}
        <div className="mb-8">
          <Link to="/tools" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Learning Hub
          </Link>
          <h1 className="text-4xl font-bold text-center mb-4">
            Advanced Recovery Lessons
          </h1>
          <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto mb-6">
            Weeks 10-14: Investment basics, healthy boundaries, and wealth-building strategies that protect your recovery.
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{getCompletedCount()} of {advancedLessons.length} lessons</span>
            </div>
            <Progress value={(getCompletedCount() / advancedLessons.length) * 100} className="h-3" />
          </div>
        </div>

        {/* Lesson Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {advancedLessons.map((lesson, index) => (
            <Button
              key={lesson.id}
              variant={currentLessonIndex === index ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentLessonIndex(index)}
              className="relative"
            >
              Week {lesson.weekNumber}
              {isLessonComplete(lesson.id) && (
                <CheckCircle className="w-3 h-3 ml-1 text-success" />
              )}
            </Button>
          ))}
        </div>

        {/* Current Lesson Card */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center border-b">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                {currentLesson.icon}
              </div>
            </div>
            <Badge variant="secondary" className="mb-2">Week {currentLesson.weekNumber}</Badge>
            <CardTitle className="text-2xl">{currentLesson.title}</CardTitle>
            <CardDescription className="text-lg">{currentLesson.subtitle}</CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 w-full mb-6">
                <TabsTrigger value="overview" className="text-xs sm:text-sm">
                  <BookOpen className="w-4 h-4 mr-1 hidden sm:inline" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="content" className="text-xs sm:text-sm">
                  <FileText className="w-4 h-4 mr-1 hidden sm:inline" />
                  Modules
                </TabsTrigger>
                <TabsTrigger value="quiz" className="text-xs sm:text-sm">
                  <Target className="w-4 h-4 mr-1 hidden sm:inline" />
                  Quiz
                </TabsTrigger>
                <TabsTrigger value="reflect" className="text-xs sm:text-sm">
                  <PenLine className="w-4 h-4 mr-1 hidden sm:inline" />
                  Reflect
                </TabsTrigger>
                <TabsTrigger value="exercise" className="text-xs sm:text-sm">
                  <Lightbulb className="w-4 h-4 mr-1 hidden sm:inline" />
                  Exercise
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="p-6 bg-muted/50 rounded-lg">
                  <p className="text-lg leading-relaxed">{currentLesson.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        What You'll Learn
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {currentLesson.modules.map((module, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 mt-1 text-primary shrink-0" />
                            <span className="text-sm">{module.title}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Download className="w-5 h-5 text-primary" />
                        Downloadable Resources
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {currentLesson.downloadables.map((dl, i) => (
                          <li key={i}>
                            <Button variant="outline" size="sm" className="w-full justify-start h-auto py-2">
                              <FileText className="w-4 h-4 mr-2 shrink-0" />
                              <div className="text-left">
                                <div className="font-medium text-sm">{dl.title}</div>
                                <div className="text-xs text-muted-foreground">{dl.description}</div>
                              </div>
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-center">
                  <Button onClick={() => setActiveTab("content")} size="lg">
                    Start Learning
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>

              {/* Content/Modules Tab */}
              <TabsContent value="content" className="space-y-6">
                {currentLesson.modules.map((module, moduleIndex) => (
                  <Card key={moduleIndex}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                          {moduleIndex + 1}
                        </span>
                        {module.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-3">
                        {module.content.map((point, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-success mt-0.5 shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                      
                      {module.keyStats && (
                        <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            Key Statistics
                          </h4>
                          <ul className="space-y-1">
                            {module.keyStats.map((stat, i) => (
                              <li key={i} className="text-sm flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                {stat}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("overview")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Overview
                  </Button>
                  <Button onClick={() => setActiveTab("quiz")}>
                    Take the Quiz
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>

              {/* Quiz Tab */}
              <TabsContent value="quiz" className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Knowledge Check</h3>
                  <p className="text-muted-foreground">
                    Test your understanding of Week {currentLesson.weekNumber}: {currentLesson.title}
                  </p>
                </div>

                {currentLesson.quizQuestions.map((question, qIndex) => {
                  const isAnswered = quizAnswers[question.id] !== undefined;
                  const isCorrect = quizAnswers[question.id] === question.correctAnswer;
                  
                  return (
                    <Card key={question.id} className={isAnswered ? (isCorrect ? "border-success" : "border-destructive") : ""}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-start gap-2">
                          <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm shrink-0">
                            {qIndex + 1}
                          </span>
                          {question.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <RadioGroup
                          value={quizAnswers[question.id]?.toString()}
                          onValueChange={(value) => handleQuizAnswer(question.id, parseInt(value))}
                        >
                          {question.options.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center space-x-2 py-2">
                              <RadioGroupItem
                                value={oIndex.toString()}
                                id={`${question.id}-${oIndex}`}
                                disabled={isAnswered}
                              />
                              <Label
                                htmlFor={`${question.id}-${oIndex}`}
                                className={`cursor-pointer ${
                                  isAnswered && oIndex === question.correctAnswer ? "text-success font-medium" : ""
                                } ${
                                  isAnswered && quizAnswers[question.id] === oIndex && !isCorrect ? "text-destructive" : ""
                                }`}
                              >
                                {option}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                        
                        {isAnswered && (
                          <div className={`mt-4 p-3 rounded-lg ${isCorrect ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                            <p className="text-sm font-medium mb-1">
                              {isCorrect ? "✓ Correct!" : "✗ Not quite right"}
                            </p>
                            <p className="text-sm opacity-90">{question.explanation}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}

                {Object.keys(quizAnswers).length === currentLesson.quizQuestions.length && (
                  <div className="text-center p-6 bg-muted/50 rounded-lg">
                    <h4 className="text-lg font-semibold mb-2">Quiz Complete!</h4>
                    <p className="text-2xl font-bold text-primary mb-4">
                      Score: {calculateQuizScore()}%
                    </p>
                    <Button onClick={() => setActiveTab("reflect")}>
                      Continue to Reflection
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Reflect Tab */}
              <TabsContent value="reflect" className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Personal Reflection</h3>
                  <p className="text-muted-foreground">
                    Take time to reflect on how this lesson applies to your recovery journey.
                  </p>
                </div>

                {/* Self-Assessment Slider */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Self-Assessment</CardTitle>
                    <CardDescription>
                      How confident do you feel about applying these concepts to your financial recovery?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Slider
                        value={selfRating}
                        onValueChange={setSelfRating}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>1 - Not confident</span>
                        <span className="font-medium text-foreground">{selfRating[0]}/10</span>
                        <span>10 - Very confident</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleRatingSave}>
                        Save Rating
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Reflection Journal */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <PenLine className="w-5 h-5" />
                      Reflection Journal
                    </CardTitle>
                    <CardDescription>
                      Consider these prompts as you reflect:
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 mb-4">
                      {currentLesson.reflectionPrompts.map((prompt, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          {prompt}
                        </li>
                      ))}
                    </ul>
                    
                    <Textarea
                      placeholder="Write your reflections here..."
                      value={reflectionNotes}
                      onChange={(e) => setReflectionNotes(e.target.value)}
                      rows={6}
                      className="resize-none"
                    />
                    <Button onClick={handleReflectionSave}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Save Reflections
                    </Button>
                  </CardContent>
                </Card>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab("quiz")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Quiz
                  </Button>
                  <Button onClick={() => setActiveTab("exercise")}>
                    Practical Exercise
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>

              {/* Exercise Tab */}
              <TabsContent value="exercise" className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">{currentLesson.practicalExercise.title}</h3>
                  <p className="text-muted-foreground">
                    Apply what you've learned with these practical action steps.
                  </p>
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {currentLesson.practicalExercise.steps.map((step, index) => (
                        <div
                          key={index}
                          className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                            exerciseSteps[index] ? "bg-success/10 border-success" : "bg-muted/30"
                          }`}
                        >
                          <button
                            onClick={() => handleExerciseToggle(index)}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                              exerciseSteps[index]
                                ? "bg-success border-success text-success-foreground"
                                : "border-muted-foreground"
                            }`}
                          >
                            {exerciseSteps[index] ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <span className="text-sm font-medium">{index + 1}</span>
                            )}
                          </button>
                          <div className="flex-1">
                            <p className={exerciseSteps[index] ? "line-through text-muted-foreground" : ""}>
                              {step}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Completed {exerciseSteps.filter(Boolean).length} of {exerciseSteps.length} steps
                      </p>
                      <Progress 
                        value={(exerciseSteps.filter(Boolean).length / exerciseSteps.length) * 100} 
                        className="h-2 max-w-xs mx-auto"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Completion Section */}
                <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                  <CardContent className="pt-6 text-center">
                    <h4 className="text-lg font-semibold mb-2">Ready to Complete This Lesson?</h4>
                    <p className="text-muted-foreground mb-4">
                      Mark this lesson complete to track your progress through the advanced curriculum.
                    </p>
                    <div className="flex justify-center gap-4">
                      {currentLessonIndex > 0 && (
                        <Button variant="outline" onClick={() => setCurrentLessonIndex(prev => prev - 1)}>
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Previous Week
                        </Button>
                      )}
                      <Button onClick={markLessonComplete} disabled={isLessonComplete(currentLesson.id)}>
                        {isLessonComplete(currentLesson.id) ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Completed
                          </>
                        ) : (
                          <>
                            Mark Complete
                            <CheckCircle className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                      {currentLessonIndex < advancedLessons.length - 1 && (
                        <Button variant="outline" onClick={() => setCurrentLessonIndex(prev => prev + 1)}>
                          Next Week
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedLessons;
