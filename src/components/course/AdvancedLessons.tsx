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
    id: "investment-basics",
    weekNumber: 10,
    title: "Investment Basics",
    subtitle: "Building a Foundation for Recovery-Focused Wealth",
    icon: <TrendingUp className="h-6 w-6 text-emerald-500" />,
    description: "Learn the fundamentals of stocks, bonds, and long-term investing strategies that support your recovery journey without triggering addictive behaviors.",
    modules: [
      {
        title: "Understanding Stocks",
        content: [
          "A stock represents partial ownership (equity) in a company. When you buy stock, you become a shareholder with a stake in that company's success.",
          "Companies issue stock to raise capital for growth, research, expansion, or paying off debt. Investors buy stocks hoping the company's value will increase.",
          "Stock prices fluctuate based on supply and demand, company performance, economic conditions, and market sentiment.",
          "There are two main types of stocks: Common Stock (voting rights, variable dividends) and Preferred Stock (fixed dividends, priority in bankruptcy, limited voting rights).",
          "Stocks are traded on exchanges like NYSE, NASDAQ, and international markets. Trading occurs during market hours with prices updating in real-time."
        ],
        keyStats: [
          "The S&P 500 has historically returned about 10% annually over the long term",
          "Individual stocks are higher risk - diversification reduces volatility",
          "Time in the market beats timing the market for most investors"
        ]
      },
      {
        title: "Understanding Bonds",
        content: [
          "A bond is a loan you make to a government or corporation. In return, they pay you interest (the 'coupon') and return your principal at maturity.",
          "Bonds are generally considered lower risk than stocks because they provide predictable income and return of principal.",
          "Bond prices move inversely to interest rates - when rates rise, existing bond prices fall, and vice versa.",
          "Types of bonds include: Government bonds (Treasury, municipal), Corporate bonds (investment-grade, high-yield), and Savings bonds (I-bonds, EE bonds).",
          "Bond ratings (AAA to D) indicate creditworthiness. Higher-rated bonds are safer but offer lower yields."
        ],
        keyStats: [
          "Government bonds are backed by the full faith of the issuing government",
          "Corporate bonds offer higher yields but carry more default risk",
          "Bonds typically provide stability during stock market downturns"
        ]
      },
      {
        title: "Risk vs. Reward in Recovery",
        content: [
          "Understanding your risk tolerance is crucial - especially in recovery where financial stress can trigger relapse.",
          "The risk-reward tradeoff: Higher potential returns typically come with higher volatility and potential for loss.",
          "Time horizon matters: Longer investment periods allow you to weather short-term volatility.",
          "Diversification reduces risk by spreading investments across different asset classes, sectors, and geographies.",
          "In recovery, prioritize 'boring' investments that don't trigger dopamine-seeking behaviors."
        ]
      },
      {
        title: "Recovery-Safe Investment Approach",
        content: [
          "Build your emergency fund FIRST - 3-6 months of expenses in high-yield savings before investing.",
          "Start with index funds that track broad markets (S&P 500, Total Stock Market) for automatic diversification.",
          "Use dollar-cost averaging: Invest the same amount regularly regardless of market conditions.",
          "Automate your investments to remove emotional decision-making from the process.",
          "Avoid checking your portfolio frequently - quarterly reviews are sufficient for long-term investors."
        ]
      }
    ],
    quizQuestions: [
      {
        id: "inv1",
        question: "What does owning a stock represent?",
        options: [
          "A loan to a company",
          "Partial ownership in a company",
          "A guaranteed return on investment",
          "A fixed income stream"
        ],
        correctAnswer: 1,
        explanation: "A stock represents partial ownership (equity) in a company. As a shareholder, you own a piece of that company's assets and earnings."
      },
      {
        id: "inv2",
        question: "What happens to bond prices when interest rates rise?",
        options: [
          "Bond prices increase",
          "Bond prices decrease",
          "Bond prices stay the same",
          "Bonds become worthless"
        ],
        correctAnswer: 1,
        explanation: "Bond prices move inversely to interest rates. When rates rise, existing bonds with lower rates become less attractive, causing their prices to fall."
      },
      {
        id: "inv3",
        question: "Why is diversification important for investors in recovery?",
        options: [
          "It guarantees higher returns",
          "It eliminates all investment risk",
          "It reduces volatility and emotional stress from losses",
          "It allows you to check your portfolio more often"
        ],
        correctAnswer: 2,
        explanation: "Diversification reduces volatility by spreading risk across different investments. This helps prevent the emotional stress that can trigger relapse."
      },
      {
        id: "inv4",
        question: "What should you build BEFORE starting to invest?",
        options: [
          "A stock portfolio",
          "An emergency fund of 3-6 months expenses",
          "A cryptocurrency collection",
          "A brokerage account with margin trading"
        ],
        correctAnswer: 1,
        explanation: "An emergency fund prevents you from selling investments at a loss during financial emergencies and provides stability for your recovery."
      },
      {
        id: "inv5",
        question: "What is dollar-cost averaging?",
        options: [
          "Buying only when prices are low",
          "Investing the same amount regularly regardless of market conditions",
          "Selling investments when they reach a target price",
          "Converting investments to different currencies"
        ],
        correctAnswer: 1,
        explanation: "Dollar-cost averaging means investing a fixed amount regularly. This removes emotional timing decisions and smooths out market volatility over time."
      }
    ],
    reflectionPrompts: [
      "What is your current relationship with investing? Does checking markets or portfolios trigger any compulsive behaviors?",
      "How does understanding the difference between investing and gambling help protect your recovery?",
      "What specific guardrails could you put in place to keep investing 'boring' and recovery-safe?"
    ],
    downloadables: [
      {
        title: "Investment Basics Glossary",
        description: "Key terms and definitions for stocks, bonds, and investing",
        filename: "investment-glossary.pdf"
      },
      {
        title: "Recovery-Safe Investment Checklist",
        description: "A checklist to evaluate if an investment approach supports your recovery",
        filename: "recovery-investment-checklist.pdf"
      }
    ],
    practicalExercise: {
      title: "Investment Readiness Assessment",
      steps: [
        "Calculate your current emergency fund status (goal: 3-6 months expenses)",
        "List any current investments and categorize them by risk level",
        "Identify any investment behaviors that might trigger addictive patterns",
        "Research one low-cost index fund and write down its expense ratio",
        "Create a simple monthly investment amount you could automate",
        "Set up a quarterly calendar reminder to review your investments (no more frequent)"
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
