-- Insert the Week 22 course
INSERT INTO public.courses (title, description, week_number, learning_pathway, content_type, order_index)
VALUES (
  'Automated Investing & Robo-Advisors',
  'Learn how automated investing platforms can help you build wealth steadily in recovery. Understand robo-advisors, micro-investing apps, and how to set up hands-off investment strategies that align with your financial recovery goals.',
  22,
  'advanced',
  'premium',
  22
);

-- Insert the lesson for Week 22
INSERT INTO public.lessons (
  course_id,
  lesson_number,
  title,
  description,
  content_type,
  estimated_duration,
  is_published,
  order_index,
  learning_objectives,
  text_content,
  presentation_slides,
  interactive_elements,
  quiz_questions,
  resources
)
SELECT
  c.id,
  1,
  'Automated Investing & Robo-Advisors in Recovery',
  'Discover how robo-advisors and micro-investing apps can help you build wealth on autopilot while staying focused on your recovery journey.',
  'mixed',
  25,
  true,
  1,
  ARRAY[
    'Understand what robo-advisors are and how they work',
    'Compare popular platforms like Acorns, Stash, Betterment, and Wealthfront',
    'Learn how to start investing with as little as $5',
    'Create an automated investing plan aligned with recovery goals',
    'Identify potential triggers and safeguards when managing investments'
  ],
  E'## Why This Matters\n\nIn recovery, building long-term financial stability is essential — but actively managing investments can feel overwhelming, especially when you''re focused on sobriety and rebuilding your life. Robo-advisors and micro-investing apps remove the complexity by automating your investment decisions.\n\nThese platforms use algorithms to build and manage a diversified portfolio based on your goals, risk tolerance, and timeline. For people in recovery, this "set it and forget it" approach is powerful: it builds wealth without requiring constant attention or emotional decision-making around money.\n\n## Core Concept\n\n**What is a Robo-Advisor?**\nA robo-advisor is a digital platform that provides automated, algorithm-driven financial planning with little to no human supervision. You answer questions about your goals and risk tolerance, and the platform builds and manages a diversified portfolio for you.\n\n**How Micro-Investing Works**\nMicro-investing apps like Acorns round up your everyday purchases to the nearest dollar and invest the spare change. If you buy a coffee for $3.50, the app rounds up to $4.00 and invests the $0.50. Over time, these small amounts compound.\n\n**Key Platforms Compared:**\n- **Acorns** — Best for beginners; round-up investing starting at $3/month\n- **Stash** — Great for learning; lets you pick themed investments starting at $3/month\n- **Betterment** — Best full-service robo-advisor; 0.25% annual fee\n- **Wealthfront** — Strong tax-loss harvesting; 0.25% annual fee\n- **Fidelity Go** — No fees on balances under $25,000\n\n## How to Do It\n\n**Step 1: Assess Your Readiness**\nBefore investing, ensure you have: an emergency fund (even $500), no high-interest debt over 20% APR, and stable income covering basic needs.\n\n**Step 2: Choose Your Platform**\nConsider these factors: minimum investment amount, monthly fees, investment options, educational resources, and ease of use.\n\n**Step 3: Set Up Auto-Contributions**\nStart small — even $5-$25 per week. Automate contributions on payday so investing happens before you can spend the money. This removes the emotional decision.\n\n**Step 4: Pick Your Risk Level**\nMost robo-advisors offer risk levels from conservative to aggressive. In early recovery, a moderate approach often works best — it grows your money while avoiding the stress of big market swings.\n\n**Step 5: Review Quarterly, Not Daily**\nChecking investments daily can trigger anxiety. Set a quarterly review schedule and resist the urge to check more often.\n\n## Take Action\n\nYour assignment this week:\n1. Research two robo-advisor platforms from the comparison above\n2. Open one account with a minimum deposit (even $1-$5)\n3. Set up an automatic weekly contribution of at least $5\n4. Write down your investment goal and timeline\n5. Schedule your first quarterly review date\n\n## Quick Check\n\nUse the quiz below to test your understanding of automated investing concepts.',
  '[{"type":"intro","title":"Why This Matters","content":"Building wealth in recovery does not have to be complicated. Robo-advisors automate the process so you can focus on what matters most — your sobriety and rebuilding your life.","interactive":false},{"type":"concept","title":"What is a Robo-Advisor?","content":"A digital platform that uses algorithms to build and manage a diversified investment portfolio based on your goals, risk tolerance, and timeline. No investment expertise required.","interactive":false},{"type":"concept","title":"Micro-Investing: Small Change, Big Impact","content":"Apps like Acorns round up everyday purchases and invest the spare change. A $3.50 coffee becomes a $4.00 purchase with $0.50 automatically invested. Over years, these small amounts compound significantly.","interactive":true},{"type":"comparison","title":"Platform Comparison","content":"Acorns: Best for beginners ($3/mo) | Stash: Great for learning ($3/mo) | Betterment: Full-service robo-advisor (0.25%) | Wealthfront: Tax-loss harvesting (0.25%) | Fidelity Go: Free under $25K","interactive":true},{"type":"action","title":"Your 5-Step Setup Plan","content":"1) Assess readiness (emergency fund, no high-interest debt) 2) Choose your platform 3) Set up auto-contributions ($5-$25/week) 4) Pick your risk level (moderate recommended) 5) Schedule quarterly reviews only","interactive":true},{"type":"recovery","title":"Recovery-Specific Safeguards","content":"Avoid checking investments daily — it can trigger anxiety. Automate everything to remove emotional decision-making. Start small to build confidence. Share your investment goals with your sponsor or accountability partner.","interactive":false}]'::jsonb,
  '[{"type":"checklist","title":"Investment Readiness Checklist","description":"Check off each item to assess if you are ready to start automated investing:","items":[{"key":"emergency_fund","label":"I have at least $500 in emergency savings"},{"key":"no_high_debt","label":"I have no debt with interest rates above 20% APR"},{"key":"stable_income","label":"I have stable income covering my basic needs"},{"key":"budget_surplus","label":"I have at least $5-$25/week available to invest"},{"key":"recovery_stable","label":"I feel stable enough in my recovery to take this step"},{"key":"support_system","label":"I have someone to discuss financial decisions with"}]},{"type":"calculator","title":"Compound Growth Calculator","description":"See how small weekly investments grow over time. If you invest $10/week with an average 7% annual return: After 1 year: ~$540 | After 5 years: ~$3,150 | After 10 years: ~$7,800 | After 20 years: ~$22,800. Even spare change adds up!"},{"type":"reflection","title":"Your Investment Plan","prompts":["What platform interests you most and why?","How much can you realistically invest each week?","What is your primary investment goal (emergency fund growth, retirement, specific purchase)?","What safeguards will you put in place to avoid compulsive checking?"]}]'::jsonb,
  '[{"question":"What is a robo-advisor?","options":["A human financial advisor who works remotely","A digital platform that uses algorithms to manage investments automatically","A robot that trades stocks on the floor of the NYSE","A budgeting app for tracking expenses"],"correct":1,"explanation":"A robo-advisor is a digital platform that uses algorithms to build and manage a diversified portfolio based on your goals and risk tolerance."},{"question":"How does micro-investing with Acorns work?","options":["You must invest at least $100 per month","It rounds up everyday purchases and invests the spare change","It requires you to pick individual stocks","It only works with cryptocurrency"],"correct":1,"explanation":"Acorns rounds up your everyday purchases to the nearest dollar and invests the spare change automatically."},{"question":"Why is automated investing particularly beneficial for people in recovery?","options":["It guarantees high returns","It removes emotional decision-making and reduces financial anxiety","It requires checking your portfolio daily","It eliminates all investment risk"],"correct":1,"explanation":"Automated investing removes the need for constant emotional decision-making around money, which is especially helpful during recovery."},{"question":"How often should you review your automated investments?","options":["Every day to maximize returns","Every hour during market hours","Quarterly — about every 3 months","Only when the market crashes"],"correct":2,"explanation":"Quarterly reviews are recommended. Checking too frequently can trigger anxiety and lead to impulsive decisions."},{"question":"What should you have in place before starting to invest?","options":["A luxury car and designer wardrobe","An emergency fund, no high-interest debt, and stable income","At least $10,000 in savings","A degree in finance"],"correct":1,"explanation":"Before investing, ensure you have an emergency fund (even $500), no high-interest debt over 20% APR, and stable income covering basic needs."}]'::jsonb,
  '{"downloads":[{"title":"Robo-Advisor Comparison Worksheet","description":"Side-by-side comparison of popular platforms to help you choose"},{"title":"Weekly Investment Tracker","description":"Track your automated contributions and portfolio growth"}]}'::jsonb
FROM public.courses c
WHERE c.week_number = 22 AND c.learning_pathway = 'advanced'
LIMIT 1;