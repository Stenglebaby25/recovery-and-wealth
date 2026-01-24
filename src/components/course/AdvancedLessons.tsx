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
    id: "healthcare-navigation",
    weekNumber: 12,
    title: "Healthcare Navigation",
    subtitle: "Understanding Insurance, Bills & HSAs",
    icon: <Heart className="h-6 w-6 text-red-500" />,
    description: "Understanding your health insurance can save you thousands. Learn how to decode your plan, maximize benefits, and negotiate medical bills.",
    modules: [
      {
        title: "Why This Matters",
        content: [
          "You finished treatment and got a $15,000 hospital bill. Your insurance should have covered it, but they denied the claim. You don't know what 'deductible' or 'out-of-pocket max' means. The bills keep piling up.",
          "Understanding your health insurance can save you thousands of dollars and countless hours of stress.",
          "Today you'll learn how to navigate the healthcare system—a critical skill for protecting your recovery and your finances."
        ]
      },
      {
        title: "Key Insurance Terms You Need to Know",
        content: [
          "PREMIUM: What you pay monthly for insurance, whether you use it or not. This is like a subscription fee for your coverage.",
          "DEDUCTIBLE: What you pay out-of-pocket BEFORE insurance kicks in. If your deductible is $3,000, you pay the first $3,000 of care yourself.",
          "COPAY: Fixed amount you pay per visit. Typically $20-30 for a doctor visit, $40-60 for a specialist.",
          "OUT-OF-POCKET MAX: The MOST you'll pay in a year. After you hit this amount, insurance covers 100% of everything.",
          "IN-NETWORK vs. OUT-OF-NETWORK: In-network providers have contracts with your insurance and cost less. Out-of-network providers can cost 2-3x more."
        ],
        keyStats: [
          "The average deductible for individual plans is $1,735 (2024)",
          "60% of Americans don't understand basic health insurance terms",
          "Billing errors appear on 30-40% of hospital bills"
        ]
      },
      {
        title: "Example Breakdown: How It Works",
        content: [
          "Let's say your plan has: Premium $150/month, Deductible $3,000, Out-of-pocket max $6,000.",
          "WHAT THIS MEANS: You pay $150/month just to have insurance. Then you pay the first $3,000 of medical care yourself. After that, you pay copays and coinsurance until you've paid $6,000 total. After $6,000, insurance pays 100% of everything for the rest of the year.",
          "If you have a $15,000 treatment stay: You'd pay $6,000 (your out-of-pocket max), and insurance pays the remaining $9,000."
        ]
      },
      {
        title: "HSAs and FSAs: Tax-Free Medical Savings",
        content: [
          "HSA (Health Savings Account): Tax-free savings for medical expenses. Only available with high-deductible plans. TRIPLE tax benefit: Money goes in tax-free, grows tax-free, comes out tax-free for medical expenses. Use it for therapy, prescriptions, treatment follow-up. 2024 limit: $4,150 for individuals.",
          "FSA (Flexible Spending Account): Similar to HSA but 'use it or lose it' each year. Good for predictable expenses like monthly therapy sessions. Available with any employer health plan.",
          "Both can be used for: Therapy copays, prescriptions (including MAT), medical equipment, some wellness expenses."
        ]
      },
      {
        title: "Step-by-Step: Navigating Your Healthcare",
        content: [
          "STEP 1 - Understand Your Plan: Find your insurance card (front and back). Look up your plan details online or call the number on the card. Ask: What's my deductible? What's my out-of-pocket max? Is my therapist/doctor in-network? Does this plan cover mental health/addiction services? (It legally must, but confirm.)",
          "STEP 2 - Maximize Your Benefits: If you have an HSA, contribute what you can (max $4,150/year for individuals). Keep receipts for all medical expenses. Always use in-network providers whenever possible.",
          "STEP 3 - Handle Medical Bills: Always ask for itemized bills (catches billing errors). Call the billing department: 'I'm self-pay/struggling, what discounts are available?' Set up payment plans ($50-100/month is usually acceptable). Apply for financial assistance—most hospitals have charity care programs."
        ]
      }
    ],
    quizQuestions: [
      {
        id: "hc1",
        question: "What's a deductible?",
        options: [
          "Monthly payment for insurance",
          "Amount you pay before insurance kicks in",
          "Maximum you'll pay all year",
          "A copay for doctor visits"
        ],
        correctAnswer: 1,
        explanation: "A deductible is the amount you pay out-of-pocket before your insurance starts covering costs. If your deductible is $3,000, you pay the first $3,000 yourself."
      },
      {
        id: "hc2",
        question: "Can you use an HSA for therapy sessions?",
        options: [
          "Yes",
          "No",
          "Only if prescribed by a doctor",
          "Only for group therapy"
        ],
        correctAnswer: 0,
        explanation: "Yes! HSA funds can be used for therapy, counseling, and other mental health services—including addiction treatment and MAT prescriptions."
      },
      {
        id: "hc3",
        question: "Should you always ask for an itemized bill?",
        options: [
          "Yes, it catches errors",
          "No, just pay what they say",
          "Only for bills over $1,000",
          "Only if you have insurance"
        ],
        correctAnswer: 0,
        explanation: "Always request an itemized bill. Studies show billing errors appear on 30-40% of hospital bills. An itemized bill helps you spot duplicate charges or services you didn't receive."
      },
      {
        id: "hc4",
        question: "What happens after you hit your out-of-pocket maximum?",
        options: [
          "You have to switch insurance plans",
          "Insurance covers 100% of remaining costs for the year",
          "Your deductible resets",
          "You lose coverage for the rest of the year"
        ],
        correctAnswer: 1,
        explanation: "Once you've paid your out-of-pocket maximum, your insurance covers 100% of all covered services for the rest of the plan year."
      },
      {
        id: "hc5",
        question: "What's the main difference between an HSA and FSA?",
        options: [
          "HSAs have no contribution limit",
          "FSAs are 'use it or lose it' each year",
          "HSAs can only be used for prescriptions",
          "FSAs offer better tax benefits"
        ],
        correctAnswer: 1,
        explanation: "FSA funds typically must be used by year-end or you lose them (with some exceptions). HSA funds roll over indefinitely and can even be invested for growth."
      }
    ],
    reflectionPrompts: [
      "Do you know your current insurance plan's deductible and out-of-pocket maximum? If not, what's stopping you from finding out?",
      "Have you ever avoided seeking care because you didn't understand what it would cost? How might understanding your plan change that?",
      "Are there any unpaid medical bills you've been avoiding? What's one step you could take this week to address them?"
    ],
    downloadables: [
      {
        title: "Insurance Card Decoder Guide",
        description: "How to read your insurance card and understand your plan benefits",
        filename: "insurance-card-decoder.pdf"
      },
      {
        title: "Medical Bill Negotiation Script",
        description: "Word-for-word scripts for negotiating lower bills and payment plans",
        filename: "medical-bill-negotiation-script.pdf"
      }
    ],
    practicalExercise: {
      title: "Insurance Plan Decoder",
      steps: [
        "Find your insurance card (front and back) and your plan documents",
        "Write down your plan name and type (HMO, PPO, HDHP)",
        "Locate your deductible amount and write it down",
        "Find your out-of-pocket maximum amount",
        "Note your monthly premium (check your paystub if employer-provided)",
        "Check if your current providers (therapist, doctor) are in-network",
        "Calculate: If you had a $10,000 treatment bill, what would you actually pay?",
        "If you have an HSA, check your current balance and contribution amount"
      ]
    }
  },
  {
    id: "legal-financial-recovery",
    weekNumber: 13,
    title: "Legal Financial Recovery",
    subtitle: "Managing Court Debt Without Going Under",
    icon: <AlertTriangle className="h-6 w-6 text-amber-500" />,
    description: "Restitution, fines, probation fees—court debt is serious, but courts WANT you to succeed. Learn how to manage it without jeopardizing your recovery.",
    modules: [
      {
        title: "Why This Matters",
        content: [
          "You owe $5,000 in restitution, $1,200 in fines, and $50/month in probation fees. You just started a job making $2,000/month. One missed payment could mean a warrant.",
          "Court debt is serious, but courts WANT you to succeed. Today you'll learn how to manage it without going under.",
          "Many people in recovery feel overwhelmed by legal financial obligations, but there are legitimate ways to make these debts manageable.",
          "Understanding your options can mean the difference between staying compliant and facing serious consequences."
        ]
      },
      {
        title: "Types of Court-Ordered Payments",
        content: [
          "RESTITUTION: Money paid to victims to compensate for harm. Priority: HIGHEST—courts care most about this. Cannot be discharged in bankruptcy. This should always be your top payment priority.",
          "FINES: Punishment paid to the court/government. Can sometimes be reduced for financial hardship. Courts have discretion here.",
          "COURT FEES: Administrative costs (filing, processing). Often can be waived if you're low-income. Always ask about fee waiver options.",
          "SUPERVISION FEES: Monthly probation/parole officer fees ($50-100/month). Drug testing costs ($15-25 per test). These add up but are often negotiable."
        ],
        keyStats: [
          "Restitution CANNOT be discharged in bankruptcy—it must be paid",
          "Most courts offer payment plans based on ability to pay",
          "Community service can sometimes replace monetary payments"
        ]
      },
      {
        title: "What Happens If You Don't Pay",
        content: [
          "WARRANTS ISSUED: Missing payments without communication can result in a warrant for your arrest.",
          "PROBATION VIOLATION: Non-payment is often treated as a violation of your probation terms.",
          "JAIL TIME: Rare, but possible in some jurisdictions for willful non-payment.",
          "EXTENDED PROBATION: Your supervision period may be extended until debts are paid.",
          "GOOD NEWS: Courts have payment plan options, hardship reductions are common, and community service can sometimes replace payments. Communication is key."
        ]
      },
      {
        title: "Step-by-Step: Managing Court Debt",
        content: [
          "STEP 1 - Get Your Total Debt in Writing: Call court clerk: 'I need a payment summary for case #_____.' Ask for email or printed copy. Verify all amounts are correct—errors happen.",
          "STEP 2 - Calculate What You Can Afford: Use your budget from the Foundations module. Be realistic—$50/month consistently is better than promising $200 and failing.",
          "STEP 3 - Set Up Payment Plan: Call court clerk or probation officer. Script: 'I owe $_____ and want to stay compliant. I can afford $___/month. Can we set up a plan?' Get agreement in writing (email confirmation).",
          "STEP 4 - Request Hardship Reduction (If Needed): File motion with court showing financial hardship. Provide: Pay stubs, rent receipt, proof of treatment completion. Courts often reduce fees or allow community service instead.",
          "STEP 5 - Never Miss Without Communicating: If you can't make a payment, call IMMEDIATELY. Courts are forgiving if you communicate—not if you ghost them."
        ]
      }
    ],
    quizQuestions: [
      {
        id: "legal1",
        question: "What's the highest priority court payment?",
        options: [
          "Fines",
          "Restitution",
          "Supervision fees",
          "Court fees"
        ],
        correctAnswer: 1,
        explanation: "Restitution—money paid to victims—is always the highest priority. Courts care most about making victims whole, and restitution cannot be discharged in bankruptcy."
      },
      {
        id: "legal2",
        question: "What should you do if you can't make a payment?",
        options: [
          "Ignore it and hope they forget",
          "Call immediately and explain",
          "Wait until they contact you",
          "Just pay double next month"
        ],
        correctAnswer: 1,
        explanation: "Always call immediately if you can't make a payment. Courts are much more forgiving when you communicate proactively rather than going silent."
      },
      {
        id: "legal3",
        question: "Can court fees sometimes be waived for low income?",
        options: [
          "Yes",
          "No",
          "Only for first-time offenders",
          "Only if you hire a lawyer"
        ],
        correctAnswer: 0,
        explanation: "Yes! Court fees (administrative costs) can often be waived or reduced for people with low income. Always ask about fee waiver options."
      },
      {
        id: "legal4",
        question: "Can restitution be discharged in bankruptcy?",
        options: [
          "Yes, all debts can be discharged",
          "No, restitution must be paid regardless",
          "Only in Chapter 7 bankruptcy",
          "Only if the victim agrees"
        ],
        correctAnswer: 1,
        explanation: "Restitution cannot be discharged in bankruptcy. Unlike other debts, you are legally obligated to pay restitution regardless of your bankruptcy status."
      },
      {
        id: "legal5",
        question: "What's better: promising to pay $200/month or consistently paying $50/month?",
        options: [
          "Promising $200/month shows good faith",
          "Consistently paying $50/month you can afford",
          "Neither—just pay when you can",
          "Pay nothing until you can afford the full amount"
        ],
        correctAnswer: 1,
        explanation: "Consistent smaller payments are always better than larger promises you can't keep. Courts value reliability and compliance over big promises that lead to missed payments."
      }
    ],
    reflectionPrompts: [
      "What court-ordered payments do you currently owe? Do you have a complete list with accurate amounts?",
      "Have you been avoiding communication with the court about your financial situation? What's one step you could take this week to get back on track?",
      "How does the stress of court debt affect your recovery? What would it feel like to have a manageable payment plan in place?"
    ],
    downloadables: [
      {
        title: "Court Payment Plan Request Letter Template",
        description: "A fill-in-the-blank letter template for requesting a payment plan from the court",
        filename: "court-payment-plan-request.pdf"
      },
      {
        title: "Hardship Reduction Motion Guide",
        description: "Step-by-step guide for filing a financial hardship motion with required documentation checklist",
        filename: "hardship-reduction-guide.pdf"
      }
    ],
    practicalExercise: {
      title: "Court Payment Budget Planner",
      steps: [
        "List all court-ordered payments: restitution amount, fines, fees, monthly supervision costs",
        "Calculate your total monthly income after taxes",
        "List your essential monthly expenses (rent, utilities, food, transportation)",
        "Calculate remaining income: Monthly income minus essential expenses",
        "Determine a realistic monthly court payment (should leave buffer for emergencies)",
        "If your calculated payment is less than required, prepare hardship documentation",
        "Call court clerk or probation officer to discuss payment plan options",
        "Get any agreement in writing and set up calendar reminders for payments"
      ]
    }
  },
  {
    id: "healthy-money-boundaries",
    weekNumber: 14,
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
  },
  {
    id: "housing-rental-strategies",
    weekNumber: 15,
    title: "Housing & Rental Strategies",
    subtitle: "Rebuilding Your Rental History and Path to Homeownership",
    icon: <Users className="h-6 w-6 text-teal-500" />,
    description: "Bad rental history doesn't mean you're stuck forever. Learn how to rebuild, work with second-chance landlords, and eventually own a home.",
    modules: [
      {
        title: "Why This Matters",
        content: [
          "You're ready to move out of sober living. But you have an eviction on your record from 3 years ago when you were using. Every landlord rejects your application.",
          "Bad rental history doesn't mean you're stuck forever. Today you'll learn how to rebuild and eventually own a home.",
          "Housing stability is crucial for recovery—having a safe, stable place to live supports every other aspect of your journey.",
          "Understanding the system and knowing your options gives you power to move forward despite past challenges."
        ]
      },
      {
        title: "Common Barriers and How to Overcome Them",
        content: [
          "COMMON BARRIERS: Evictions on record (stay for 7 years), no recent rental history (lived in sober living, treatment, with family), low credit score, criminal background.",
          "STRATEGY 1 - Work with Second-Chance Landlords: Smaller, independent landlords (not big corporate complexes). Explain your situation honestly: 'I completed treatment, I'm ___ months sober, I have steady income.' Offer references: Treatment center staff, employer, sober living manager.",
          "STRATEGY 2 - Offer More Money Upfront: Double security deposit, first + last month's rent, 3-6 months prepaid rent (if you have savings or family help).",
          "STRATEGY 3 - Get a Co-Signer: Parent, family member, or sober friend with good credit who guarantees rent if you can't pay.",
          "STRATEGY 4 - Build Rental References: Get letter from sober living: 'Paid rent on time for 6 months.' Start with month-to-month rentals to prove yourself."
        ],
        keyStats: [
          "Evictions stay on your record for 7 years",
          "Independent landlords are 3x more likely to work with applicants who have past issues",
          "60% of landlords will consider applicants with past evictions if they can show current stability"
        ]
      },
      {
        title: "Path to Homeownership",
        content: [
          "WHEN YOU'RE READY (Usually 2-3 Years Sober): Credit score 620+ (FHA loans accept 580+), down payment 3-5% (FHA) or 10-20% (conventional), steady employment for 2 years preferred, debt-to-income ratio under 43%.",
          "FIRST-TIME HOMEBUYER PROGRAMS: FHA loans (low down payment, easier approval), state/local down payment assistance grants, USDA loans (rural areas, 0% down).",
          "Don't rush homeownership—focus on building credit, saving, and maintaining stability first.",
          "Homeownership comes with responsibilities (maintenance, insurance, taxes) so make sure you're truly ready before committing."
        ]
      },
      {
        title: "Step-by-Step: Finding Housing",
        content: [
          "STEP 1 - Clean Up Your Rental History: Pull your rental history report (like a credit report for renters). Dispute any errors. If you have evictions, write a brief explanation letter.",
          "STEP 2 - Find Second-Chance Housing: Search Craigslist, Facebook Marketplace (smaller landlords). Use services like Rhino or The Guarantors (rent guarantors). Avoid big corporate apartments (they auto-reject low credit).",
          "STEP 3 - Prepare Your Application Packet: Recent pay stubs (2-3 months), letter from employer, letter from treatment center or sober living, personal statement: 'I had challenges in the past, but I've turned my life around. Here's proof.'",
          "STEP 4 - For Homeownership (Later): Build credit to 620+ (use credit builder from Foundations). Save 3-5% down payment ($10K for $200K house). Get pre-approved by lender (shows sellers you're serious)."
        ]
      }
    ],
    quizQuestions: [
      {
        id: "housing1",
        question: "How long do evictions stay on your record?",
        options: [
          "3 years",
          "7 years",
          "Forever",
          "10 years"
        ],
        correctAnswer: 1,
        explanation: "Evictions typically stay on your rental history report for 7 years. However, you can still find housing by working with independent landlords and demonstrating current stability."
      },
      {
        id: "housing2",
        question: "What's a good strategy if you have bad rental history?",
        options: [
          "Offer a larger security deposit",
          "Lie on the application",
          "Only apply to big apartment complexes",
          "Wait 10 years for it to clear"
        ],
        correctAnswer: 0,
        explanation: "Offering a larger security deposit (double or more) shows landlords you're serious and reduces their risk. Never lie on applications—it can lead to immediate eviction."
      },
      {
        id: "housing3",
        question: "What credit score do you need for an FHA home loan?",
        options: [
          "720+",
          "620+ (580+ with larger down payment)",
          "800+",
          "500+"
        ],
        correctAnswer: 1,
        explanation: "FHA loans accept credit scores as low as 580 (with 3.5% down) or 500 (with 10% down), making homeownership more accessible for people rebuilding credit."
      },
      {
        id: "housing4",
        question: "Which type of landlord is more likely to work with you if you have past rental issues?",
        options: [
          "Large corporate apartment complexes",
          "Small, independent landlords",
          "Government housing authorities",
          "Real estate investment companies"
        ],
        correctAnswer: 1,
        explanation: "Small, independent landlords have more flexibility and can make case-by-case decisions. Corporate complexes often have strict automated screening that rejects applicants with past issues."
      },
      {
        id: "housing5",
        question: "What should you include in a rental application packet?",
        options: [
          "Just the application form",
          "Pay stubs, employer letter, personal statement, and references",
          "Only your credit report",
          "Photos of your belongings"
        ],
        correctAnswer: 1,
        explanation: "A complete packet with pay stubs, employer letter, personal statement about your recovery, and references shows landlords you're prepared and serious about being a good tenant."
      }
    ],
    reflectionPrompts: [
      "What housing barriers have you faced in your recovery? How have they affected your stability and sobriety?",
      "Who could serve as a reference or co-signer for you? What relationships might you need to rebuild first?",
      "What does stable housing mean for your recovery? How would it change your daily life?"
    ],
    downloadables: [
      {
        title: "Rental Application Packet Checklist",
        description: "Complete checklist of documents to prepare for rental applications, including templates",
        filename: "rental-application-checklist.pdf"
      },
      {
        title: "Eviction Explanation Letter Template",
        description: "Fill-in-the-blank letter template to explain past evictions to potential landlords",
        filename: "eviction-explanation-letter.pdf"
      }
    ],
    practicalExercise: {
      title: "Rent vs. Buy Calculator",
      steps: [
        "Calculate your current monthly rent or housing costs",
        "Determine how long you plan to stay in your next home (1-5+ years)",
        "Calculate what you've saved (or could save) for a down payment",
        "Compare: Renting costs over your planned stay vs. buying costs (down payment + mortgage)",
        "Assess your readiness: Do you have 620+ credit, steady 2-year employment, and emergency fund?",
        "Create your housing timeline: When could you realistically buy if you start preparing now?",
        "Prepare one element of your rental application packet this week",
        "Research second-chance landlords or housing programs in your area"
      ]
    }
  },
  {
    id: "banking-relationships",
    weekNumber: 16,
    title: "Banking Relationships",
    subtitle: "Rebuilding Access to Traditional Banking",
    icon: <DollarSign className="h-6 w-6 text-blue-600" />,
    description: "Second-chance banking exists. Learn how to check your ChexSystems report, dispute errors, and rebuild your banking relationships after addiction.",
    modules: [
      {
        title: "Why This Matters",
        content: [
          "You try to open a checking account. The bank says you're in ChexSystems for unpaid overdraft fees from 4 years ago. No account for you.",
          "You can't get direct deposit, can't pay bills online, stuck cashing checks at payday loan places (3% fee).",
          "Second-chance banking exists. Today you'll learn how to rebuild.",
          "Having a bank account is essential for financial stability—it affects your ability to get paid, save money, and build credit."
        ]
      },
      {
        title: "What is ChexSystems?",
        content: [
          "LIKE A CREDIT REPORT, BUT FOR BANKING: ChexSystems tracks bounced checks, overdrafts, and fraud. Banks check it before approving accounts. Negative marks stay for 5 years.",
          "WHY PEOPLE IN RECOVERY GET BLOCKED: Overdrafts during active addiction, closed accounts with negative balances, check fraud (writing bad checks).",
          "THE GOOD NEWS: Unlike credit reports that last 7-10 years, ChexSystems marks clear after 5 years. And many banks don't check it at all.",
          "You can get a free ChexSystems report once per year at ChexSystems.com—just like your credit report."
        ],
        keyStats: [
          "ChexSystems negative marks stay for 5 years",
          "Over 80% of traditional banks check ChexSystems",
          "Payday check-cashing fees average 3-5%—that's $150/year on a $3,000 monthly income"
        ]
      },
      {
        title: "Second-Chance Banking Options",
        content: [
          "OPTION 1 - Online Banks (No ChexSystems Check): Chime, Varo, Current, Go2Bank. These banks don't check ChexSystems and have no monthly fees.",
          "OPTION 2 - Credit Unions: Often more forgiving than big banks. Many offer 'Fresh Start' programs specifically for people rebuilding. Local and community-focused.",
          "OPTION 3 - Secured Checking Accounts: You deposit $100-500 as collateral. Bank gives you a checking account. After 6-12 months of good use, upgrade to regular account.",
          "REBUILDING STRATEGY: Get second-chance account → Use it responsibly for 6-12 months → Apply for traditional bank with your new clean record."
        ]
      },
      {
        title: "Step-by-Step: Rebuilding Banking Access",
        content: [
          "STEP 1 - Check Your ChexSystems Report: Go to ChexSystems.com and request your free annual report. Look for errors or old accounts you may have forgotten about.",
          "STEP 2 - Dispute Errors: If anything is wrong, file a dispute online. Provide proof (bank statements, payment records). Errors are more common than you'd think.",
          "STEP 3 - Pay Off Old Negative Balances: If you owe $200 to an old bank, pay it. Ask the bank to remove the negative mark from ChexSystems (they sometimes will as a courtesy).",
          "STEP 4 - Open Second-Chance Account: Apply at Chime.com or a local credit union. No minimum balance, no monthly fees (usually). Get direct deposit set up immediately.",
          "STEP 5 - Use It Responsibly: Never overdraft (opt OUT of overdraft protection). Keep $50-100 buffer in account at all times. Set up account alerts (text when balance is low).",
          "STEP 6 - Rebuild to Traditional Banking: After 6-12 months of responsible use, apply at Wells Fargo, Chase, or Bank of America. You'll likely get approved now."
        ]
      }
    ],
    quizQuestions: [
      {
        id: "banking1",
        question: "How long do negative marks stay in ChexSystems?",
        options: [
          "2 years",
          "5 years",
          "Forever",
          "7 years"
        ],
        correctAnswer: 1,
        explanation: "ChexSystems negative marks stay on your report for 5 years—shorter than credit report marks. After that, they're automatically removed."
      },
      {
        id: "banking2",
        question: "Which bank doesn't check ChexSystems?",
        options: [
          "Chase",
          "Chime",
          "Wells Fargo",
          "Bank of America"
        ],
        correctAnswer: 1,
        explanation: "Chime is an online bank that doesn't check ChexSystems, making it accessible for people with past banking issues. Other online banks like Varo and Current also skip ChexSystems."
      },
      {
        id: "banking3",
        question: "Should you opt IN or OUT of overdraft protection?",
        options: [
          "Opt IN so you can spend more than you have",
          "Opt OUT so you can't overdraft",
          "It doesn't matter either way",
          "Only opt in if you have savings"
        ],
        correctAnswer: 1,
        explanation: "Opt OUT of overdraft protection. This prevents you from spending more than you have and getting hit with expensive overdraft fees. Your card will simply be declined if you don't have funds."
      },
      {
        id: "banking4",
        question: "What's the first step to rebuilding your banking access?",
        options: [
          "Apply at a major bank immediately",
          "Check your ChexSystems report for errors",
          "Wait 10 years for marks to clear",
          "Use cash only forever"
        ],
        correctAnswer: 1,
        explanation: "Start by checking your ChexSystems report. You may find errors to dispute, or discover that old debts are smaller than you thought. Knowledge is power in rebuilding."
      },
      {
        id: "banking5",
        question: "What should you keep as a buffer in your checking account?",
        options: [
          "$0 - spend everything",
          "$50-100 minimum buffer",
          "$1,000 minimum",
          "$10,000 minimum"
        ],
        correctAnswer: 1,
        explanation: "Keep at least $50-100 as a buffer in your checking account to avoid accidental overdrafts. This small cushion protects you from fees and helps maintain your good banking record."
      }
    ],
    reflectionPrompts: [
      "Have you been denied a bank account in the past? How did it affect your daily life and financial management?",
      "What banking habits from your past might you need to change to maintain a healthy account?",
      "How would having a traditional bank account with direct deposit change your financial situation?"
    ],
    downloadables: [
      {
        title: "Second-Chance Bank Comparison Chart",
        description: "Side-by-side comparison of Chime, Varo, Current, and credit union Fresh Start programs",
        filename: "second-chance-bank-comparison.pdf"
      },
      {
        title: "ChexSystems Dispute Letter Template",
        description: "Fill-in-the-blank letter for disputing errors on your ChexSystems report",
        filename: "chexsystems-dispute-letter.pdf"
      }
    ],
    practicalExercise: {
      title: "Banking Options Finder",
      steps: [
        "Check if you're in ChexSystems: Request your free report at ChexSystems.com",
        "Review your report for errors or accounts you forgot about",
        "If you find errors, file a dispute with documentation",
        "If you owe money to an old bank, call to negotiate payment and removal",
        "Research second-chance options: Chime, Varo, or local credit union Fresh Start programs",
        "Open a second-chance account this week (takes 10-15 minutes online)",
        "Set up direct deposit with your employer immediately",
        "Opt OUT of overdraft protection and set up low-balance text alerts"
      ]
    }
  },
  {
    id: "identity-protection",
    weekNumber: 17,
    title: "Identity Protection",
    subtitle: "Fixing and Preventing Identity Theft",
    icon: <Shield className="h-6 w-6 text-indigo-500" />,
    description: "Identity theft is common in addiction. Learn how to check for fraudulent accounts, fix the damage, and protect yourself going forward.",
    modules: [
      {
        title: "Why This Matters",
        content: [
          "During active addiction, you gave your ID and Social Security number to someone for drugs. Now you're getting collection calls for accounts you never opened. Your credit is destroyed.",
          "Identity theft is common in addiction. Today you'll learn how to fix it and protect yourself going forward.",
          "Many people in recovery discover fraudulent accounts they didn't know existed—addressing them is essential for financial recovery.",
          "The good news: There are free tools and legal protections to help you recover from identity theft."
        ]
      },
      {
        title: "How Identity Theft Happens in Addiction",
        content: [
          "COMMON SCENARIOS: Trading ID for drugs, 'friends' opening accounts in your name, losing wallet/documents while using, giving info to scammers when desperate.",
          "SIGNS YOU'RE A VICTIM: Accounts on credit report you don't recognize, collection calls for debts you never had, IRS says you filed taxes when you didn't, denied credit unexpectedly.",
          "You may not discover the theft until months or years later when you're in recovery and trying to rebuild.",
          "Don't feel shame—this is incredibly common, and there are clear steps to fix it."
        ],
        keyStats: [
          "Fraud alerts are free and last 1 year (renewable)",
          "Credit freezes are free and stay until you remove them",
          "Credit bureaus must investigate disputes within 30 days"
        ]
      },
      {
        title: "Steps to Fix Identity Theft",
        content: [
          "STEP 1 - Place Fraud Alert: Call one credit bureau (Experian, Equifax, or TransUnion)—they notify the other two. Free, lasts 1 year (renewable). Makes it harder for thieves to open new accounts.",
          "STEP 2 - Freeze Your Credit: Blocks anyone from checking your credit (including thieves). You unfreeze temporarily when YOU apply for credit. Free, stays until you remove it.",
          "STEP 3 - File Reports: FTC report at IdentityTheft.gov, police report (get case number). Send copies to creditors.",
          "STEP 4 - Dispute Fraudulent Accounts: Write to credit bureaus: 'This account is fraudulent.' Include police report, FTC report. Bureaus must investigate within 30 days."
        ]
      },
      {
        title: "Step-by-Step Recovery Process",
        content: [
          "STEP 1 - Pull Your Credit Reports: Go to AnnualCreditReport.com (free, official). Check all three bureaus. Circle accounts you don't recognize.",
          "STEP 2 - File FTC Report: Go to IdentityTheft.gov. Answer questions, get recovery plan. Print affidavit (you'll need it for disputes).",
          "STEP 3 - File Police Report: Go to local police station. Bring FTC affidavit, ID, proof of address. Get case number.",
          "STEP 4 - Dispute Fraudulent Accounts: Write to Experian, Equifax, TransUnion. Template: 'The following accounts are fraudulent [list accounts]. I am a victim of identity theft. Please remove them from my report.' Include: FTC affidavit, police report, copy of ID.",
          "STEP 5 - Freeze Your Credit: Do it online at Experian.com/freeze, Equifax.com/freeze, TransUnion.com/freeze.",
          "STEP 6 - Monitor Going Forward: Use free credit monitoring (Credit Karma, Credit Sesame). Check reports every 4 months (rotate bureaus)."
        ]
      }
    ],
    quizQuestions: [
      {
        id: "identity1",
        question: "How long does a fraud alert last?",
        options: [
          "6 months",
          "1 year",
          "Forever",
          "7 years"
        ],
        correctAnswer: 1,
        explanation: "A fraud alert lasts 1 year and is renewable. It's free and makes it harder for identity thieves to open new accounts in your name."
      },
      {
        id: "identity2",
        question: "Does freezing your credit cost money?",
        options: [
          "Yes, $10 per bureau",
          "No, it's free",
          "Only if you have bad credit",
          "Only the first time"
        ],
        correctAnswer: 1,
        explanation: "Credit freezes are completely free at all three bureaus. This is a federal law that took effect in 2018."
      },
      {
        id: "identity3",
        question: "Where do you file an identity theft report?",
        options: [
          "IdentityTheft.gov",
          "IRS.gov",
          "ChexSystems.com",
          "Your bank's website"
        ],
        correctAnswer: 0,
        explanation: "IdentityTheft.gov is the official FTC website for reporting identity theft. You'll get a recovery plan and an affidavit you can use for disputes."
      },
      {
        id: "identity4",
        question: "How long do credit bureaus have to investigate your dispute?",
        options: [
          "7 days",
          "30 days",
          "90 days",
          "1 year"
        ],
        correctAnswer: 1,
        explanation: "By law, credit bureaus must investigate disputes within 30 days and notify you of the results. This is your right under the Fair Credit Reporting Act."
      },
      {
        id: "identity5",
        question: "What should you bring to file a police report for identity theft?",
        options: [
          "Just your ID",
          "FTC affidavit, ID, and proof of address",
          "Only your credit reports",
          "Nothing—they have all the information"
        ],
        correctAnswer: 1,
        explanation: "Bring your FTC affidavit from IdentityTheft.gov, your ID, and proof of address. The police will give you a case number you'll need for disputes."
      }
    ],
    reflectionPrompts: [
      "Have you checked your credit reports recently? Were there any accounts you didn't recognize?",
      "During active addiction, were there any situations where your personal information may have been compromised?",
      "How would clearing fraudulent accounts from your credit report change your financial recovery journey?"
    ],
    downloadables: [
      {
        title: "Dispute Letter Templates",
        description: "Ready-to-use templates for disputing fraudulent accounts with all three credit bureaus",
        filename: "dispute-letter-templates.pdf"
      },
      {
        title: "Fraud Documentation Organizer",
        description: "Checklist and organizer for tracking all your identity theft recovery documents",
        filename: "fraud-documentation-organizer.pdf"
      }
    ],
    practicalExercise: {
      title: "Identity Theft Recovery Checklist",
      steps: [
        "Pull all 3 credit reports from AnnualCreditReport.com",
        "Review each report and identify any accounts you don't recognize",
        "If you find fraudulent accounts, file an FTC report at IdentityTheft.gov",
        "File a police report and get the case number",
        "Send dispute letters to all three credit bureaus with documentation",
        "Freeze your credit at Experian.com/freeze, Equifax.com/freeze, and TransUnion.com/freeze",
        "Sign up for free credit monitoring at Credit Karma or Credit Sesame",
        "Set calendar reminders to check your credit reports every 4 months"
      ]
    }
  },
  {
    id: "negotiation-skills",
    weekNumber: 18,
    title: "Negotiation Skills",
    subtitle: "Scripts That Save You Money",
    icon: <Users className="h-6 w-6 text-emerald-600" />,
    description: "Negotiation is a skill—and it saves money. Learn the exact words to use when negotiating medical bills, debt settlements, salary, and more.",
    modules: [
      {
        title: "Why This Matters",
        content: [
          "You owe $8,000 in medical bills from treatment. You call the hospital and say 'I can't pay.' They say 'Too bad, pay or we'll send to collections.'",
          "But if you'd said the RIGHT words, they might have cut the bill in half. Negotiation is a skill—and it saves money.",
          "Most people don't know that almost everything is negotiable: medical bills, credit card debt, rent, even salary.",
          "Learning these scripts can save you thousands of dollars over your lifetime."
        ]
      },
      {
        title: "What You Can Negotiate",
        content: [
          "MEDICAL BILLS: Hospitals, doctors, dentists—most have financial assistance programs and are willing to reduce bills or set up payment plans.",
          "CREDIT CARD DEBT: Settlement for less than owed is common, especially if the debt is old or you're clearly struggling.",
          "RENT: Sometimes negotiable, especially if you're a good tenant with on-time payment history.",
          "SALARY: Job offers and raises are often negotiable—most employers expect you to negotiate.",
          "COURT FINES: Hardship reductions are common when you can document financial difficulty."
        ],
        keyStats: [
          "Hospitals routinely reduce bills by 20-50% for patients who ask",
          "Credit card companies often settle for 40-60 cents on the dollar",
          "70% of people who negotiate salary get more money"
        ]
      },
      {
        title: "The Golden Rules of Negotiation",
        content: [
          "RULE 1 - Be Polite, Not Aggressive: 'I need help' works better than 'This is unfair!' Remember: The person you're talking to didn't create the bill.",
          "RULE 2 - Have a Number in Mind: Don't say 'I can't pay anything.' Say 'I can pay $50/month' or 'I can pay $2,000 to settle this $5,000 debt.'",
          "RULE 3 - Get It in Writing: Verbal agreements don't count. Get email confirmation or a signed letter before you pay.",
          "RULE 4 - Know When to Escalate: If first person says no, ask for supervisor. If supervisor says no, try again in a month (different person might say yes)."
        ]
      },
      {
        title: "Real Scripts for Common Situations",
        content: [
          "MEDICAL BILL SCRIPT: 'Hello, I received a bill for $____. I recently completed treatment for substance use disorder and I'm rebuilding my finances. I want to pay this, but I can't afford the full amount. Can you help me? Options I'm hoping for: Payment plan of $__/month, reduced balance (uninsured/cash discount), or financial assistance/charity care application. What's possible?'",
          "CREDIT CARD DEBT SETTLEMENT: 'I owe $____ on this account. I've been in treatment and I'm working to get back on my feet. I can't pay the full amount, but I can pay $____ as a lump sum to settle this debt. If you accept, I need this in writing: The account will be marked \"paid as agreed\" or \"settled\" and you won't pursue further collection.'",
          "SALARY NEGOTIATION: 'Thank you for the offer. I'm excited about this role. Based on my research and the value I'll bring, I was hoping for $____ [10-15% higher]. Is there flexibility in the salary?'",
          "RENT NEGOTIATION: 'I've been a great tenant for [X months]—paid on time, no complaints. I see rent is increasing to $____. I'd like to stay, but that's a stretch for my budget. Can we keep it at $____ for another year? I'm happy to sign a longer lease.'"
        ]
      }
    ],
    quizQuestions: [
      {
        id: "negotiate1",
        question: "What's the first rule of negotiation?",
        options: [
          "Be aggressive and demand what you want",
          "Be polite and explain your situation",
          "Threaten to never pay",
          "Refuse to speak to anyone but the CEO"
        ],
        correctAnswer: 1,
        explanation: "Being polite and explaining your situation works far better than aggression. Remember, the person you're speaking with didn't create the bill and is more likely to help if you're respectful."
      },
      {
        id: "negotiate2",
        question: "Should you get negotiated agreements in writing?",
        options: [
          "Yes, always",
          "No, verbal is fine",
          "Only for amounts over $1,000",
          "Only if you don't trust them"
        ],
        correctAnswer: 0,
        explanation: "Always get agreements in writing before you pay. Verbal agreements aren't enforceable, and you need proof of what was agreed to protect yourself."
      },
      {
        id: "negotiate3",
        question: "If the first person says no, should you give up?",
        options: [
          "Yes, they have final authority",
          "No, ask for a supervisor or try again later",
          "Yes, it's rude to escalate",
          "No, threaten legal action"
        ],
        correctAnswer: 1,
        explanation: "Don't give up after one 'no.' Ask to speak with a supervisor, or call back another day when you might get a different representative with more authority or willingness to help."
      },
      {
        id: "negotiate4",
        question: "When negotiating, should you say 'I can't pay anything'?",
        options: [
          "Yes, it shows you're desperate",
          "No, always have a specific number in mind",
          "Yes, they'll feel sorry for you",
          "It doesn't matter what you say"
        ],
        correctAnswer: 1,
        explanation: "Always have a specific number in mind. 'I can pay $50/month' or 'I can settle for $2,000' gives them something to work with. 'I can't pay anything' ends the conversation."
      },
      {
        id: "negotiate5",
        question: "What percentage do hospitals often reduce bills for patients who ask?",
        options: [
          "5-10%",
          "20-50%",
          "They never reduce bills",
          "100%"
        ],
        correctAnswer: 1,
        explanation: "Hospitals routinely reduce bills by 20-50% for patients who ask, especially if you're uninsured, low-income, or can pay in a lump sum. Financial assistance programs can reduce even more."
      }
    ],
    reflectionPrompts: [
      "What bills or debts do you currently have that might be negotiable? What's stopping you from making those calls?",
      "Have you ever accepted a salary offer without negotiating? How might you approach it differently next time?",
      "What fears or beliefs do you have about negotiation? How might those be holding you back financially?"
    ],
    downloadables: [
      {
        title: "Negotiation Scripts Collection",
        description: "Word-for-word scripts for medical bills, credit card debt, salary, rent, and court fines",
        filename: "negotiation-scripts.pdf"
      },
      {
        title: "Negotiation Tracking Worksheet",
        description: "Track your negotiation attempts, outcomes, and follow-up actions",
        filename: "negotiation-tracking-worksheet.pdf"
      }
    ],
    practicalExercise: {
      title: "Negotiation Script Builder",
      steps: [
        "Identify one bill or debt you want to negotiate this week",
        "Write down the total amount owed",
        "Calculate what you can realistically pay (monthly payment or lump sum)",
        "Write out your situation briefly: 'I'm in recovery, rebuilding finances, working at [job]'",
        "Practice your script out loud until it feels natural",
        "Make the call—ask for financial assistance, payment plan, or settlement",
        "If they say no, ask for supervisor or note to call back later",
        "Get any agreement in writing before making payment"
      ]
    }
  },
  {
    id: "side-income-gig-economy",
    weekNumber: 19,
    title: "Side Income & Gig Economy",
    subtitle: "Recovery-Safe Ways to Earn Extra Money",
    icon: <TrendingUp className="h-6 w-6 text-green-600" />,
    description: "Gig work can help—but some gigs are relapse traps. Learn which side hustles are safe for recovery and how to manage the taxes.",
    modules: [
      {
        title: "Why This Matters",
        content: [
          "You make $2,000/month at your job. Rent is $800, bills are $600. You're surviving, but not saving. You need extra income.",
          "Gig work can help—but some gigs are relapse traps (bartending, late-night delivery). Today you'll learn safe options.",
          "The right side income can accelerate your financial recovery without putting your sobriety at risk.",
          "But you need to choose carefully and understand the tax implications."
        ]
      },
      {
        title: "Recovery-Safe Gig Work",
        content: [
          "✅ LOW-RISK OPTIONS: DoorDash/Uber Eats (daytime only, avoid bar/dispensary deliveries), Rover/Wag (dog walking, pet sitting), TaskRabbit (handyman tasks, moving help, assembly), freelance writing/VA work (Upwork, Fiverr), tutoring (Wyzant, Tutor.com), lawn care/handyman (Nextdoor, Craigslist).",
          "❌ HIGH-RISK OPTIONS TO AVOID: Bartending (triggers, late nights, around alcohol), nightclub security, late-night rideshare (drunk passengers), delivery to bars/liquor stores, casino work, anything involving old contacts from addiction.",
          "Ask yourself: Will this put me in triggering environments? Will this disrupt my sleep, meetings, or therapy? Am I doing this for healthy reasons?",
          "The goal is financial progress that SUPPORTS recovery, not money that threatens it."
        ],
        keyStats: [
          "DoorDash drivers earn $15-25/hour on average",
          "Rover pet sitters earn $25-35 per day per dog",
          "TaskRabbit Taskers average $20-40/hour depending on task type"
        ]
      },
      {
        title: "Tax Implications of Gig Work",
        content: [
          "YOU'RE SELF-EMPLOYED: Even if it's part-time, gig income is self-employment income. You're responsible for your own taxes.",
          "MUST PAY QUARTERLY ESTIMATED TAXES: 15.3% self-employment tax PLUS your income tax rate. Save 25-30% of every gig dollar for taxes.",
          "TRACK ALL EXPENSES: Mileage (67 cents/mile in 2024), supplies, phone bill, equipment. These reduce your taxable income. Use apps: Stride (free), QuickBooks Self-Employed.",
          "PAY QUARTERLY OR SAVE: Use IRS Form 1040-ES to pay quarterly, or save 30% in a separate account and pay annually."
        ]
      },
      {
        title: "Time Management & Boundaries",
        content: [
          "DON'T SACRIFICE RECOVERY FOR MONEY: Meetings, therapy, sleep > extra $50. Your sobriety is worth more than any side hustle.",
          "SET BOUNDARIES: No gigs after 8pm, no Sundays (or whatever works for your schedule). Block time that doesn't conflict with recovery commitments.",
          "START SMALL: One platform, a few hours per week. Don't overwhelm yourself—financial stress can be a trigger too.",
          "SCHEDULE GIG TIME LIKE APPOINTMENTS: Put it on your calendar so it doesn't creep into recovery time."
        ]
      },
      {
        title: "Step-by-Step: Starting Your Side Hustle",
        content: [
          "STEP 1 - Pick Your Gig: Match your skills/interests to safe options. Start with ONE platform (don't overwhelm yourself).",
          "STEP 2 - Sign Up: DoorDash requires background check, 18+, car/bike. Rover needs a profile and reviews. Upwork requires a portfolio and skills test.",
          "STEP 3 - Set Your Schedule: Example: DoorDash Saturdays 10am-2pm = $80-120. Block time that doesn't conflict with recovery commitments.",
          "STEP 4 - Track Everything: Download Stride app (free). Log mileage every time you drive. Save receipts for all expenses.",
          "STEP 5 - Pay Quarterly Taxes: Use IRS Form 1040-ES. Estimate your gig income, pay 25-30% each quarter. Or save 30% in separate account, pay annually."
        ]
      }
    ],
    quizQuestions: [
      {
        id: "gig1",
        question: "Which gig is safest for someone in recovery?",
        options: [
          "Bartending",
          "Dog walking",
          "Late-night Uber",
          "Nightclub security"
        ],
        correctAnswer: 1,
        explanation: "Dog walking (through Rover or Wag) is a recovery-safe gig. It's daytime, low-stress, doesn't involve alcohol or triggers, and gets you outside and active."
      },
      {
        id: "gig2",
        question: "Do you have to pay taxes on gig income?",
        options: [
          "Yes",
          "No, it's under the table",
          "Only if you earn over $10,000",
          "Only if you work more than 20 hours"
        ],
        correctAnswer: 0,
        explanation: "Yes! All gig income is taxable, regardless of amount. You're considered self-employed and must report all earnings on your tax return."
      },
      {
        id: "gig3",
        question: "How much should you save for taxes on gig income?",
        options: [
          "10%",
          "25-30%",
          "50%",
          "You don't need to save anything"
        ],
        correctAnswer: 1,
        explanation: "Save 25-30% of gig income for taxes. This covers your self-employment tax (15.3%) plus income tax. It's better to save too much than get hit with a surprise bill."
      },
      {
        id: "gig4",
        question: "What should come BEFORE extra gig hours in your priorities?",
        options: [
          "Buying new things",
          "Meetings, therapy, and sleep",
          "Maxing out your earnings",
          "Building social media presence"
        ],
        correctAnswer: 1,
        explanation: "Your recovery always comes first. Meetings, therapy, and adequate sleep are more important than extra income. Don't sacrifice your sobriety for money."
      },
      {
        id: "gig5",
        question: "What app can you use to track mileage for gig work?",
        options: [
          "Instagram",
          "Stride",
          "TikTok",
          "You don't need to track mileage"
        ],
        correctAnswer: 1,
        explanation: "Stride is a free app that tracks your mileage automatically. You can deduct 67 cents per mile (2024 rate) from your gig income, reducing your taxes."
      }
    ],
    reflectionPrompts: [
      "What skills do you have that could translate into safe side income? What do people often ask you for help with?",
      "Are there any gig opportunities you've considered that might put your recovery at risk? What makes them risky?",
      "How many hours per week could you realistically work on a side hustle without sacrificing recovery activities?"
    ],
    downloadables: [
      {
        title: "Gig Work Tax Tracker",
        description: "Spreadsheet to track income, expenses, mileage, and estimated tax payments",
        filename: "gig-work-tax-tracker.pdf"
      },
      {
        title: "Safe Gig Platform Comparison",
        description: "Side-by-side comparison of recovery-safe gig platforms with earnings, requirements, and risk levels",
        filename: "safe-gig-platform-comparison.pdf"
      }
    ],
    practicalExercise: {
      title: "Gig Income Calculator",
      steps: [
        "List 2-3 recovery-safe gig options that match your skills and schedule",
        "Research sign-up requirements for each platform",
        "Calculate how many hours per week you can work WITHOUT impacting recovery",
        "Estimate earnings: Hours × typical hourly rate for that gig",
        "Calculate take-home: Subtract 30% for taxes",
        "Choose ONE platform to start with this week",
        "Download Stride app and set up mileage tracking",
        "Open a separate savings account for gig taxes"
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
