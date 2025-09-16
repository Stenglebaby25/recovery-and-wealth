-- Create enhanced financial recovery course content
INSERT INTO public.courses (
  title,
  description,
  content_type,
  learning_pathway,
  order_index,
  subject,
  content,
  week_number
) VALUES (
  'Introduction to Financial Recovery and Addiction',
  'A comprehensive course exploring the critical connection between addiction and financial instability, providing tools and strategies for building financial health in recovery.',
  'free',
  'foundation',
  1,
  'Financial Recovery Foundations',
  'This foundational course addresses the complex relationship between addiction and financial challenges, offering practical strategies for recovery and stability.',
  1
) ON CONFLICT DO NOTHING;

-- Insert course modules for the financial recovery course
INSERT INTO public.course_modules (
  course_id,
  title,
  description,
  module_number,
  order_index,
  estimated_duration,
  learning_objectives
) 
SELECT 
  c.id,
  'Understanding the Link between Addiction and Financial Instability',
  'Explore how addiction impacts financial decision-making and develop awareness of financial recovery principles.',
  1,
  1,
  45,
  ARRAY[
    'Identify the psychological and behavioral connections between addiction and financial problems',
    'Understand the cycle of financial damage in active addiction',
    'Recognize early warning signs of financial relapse',
    'Develop awareness of money as a recovery tool'
  ]
FROM public.courses c 
WHERE c.title = 'Introduction to Financial Recovery and Addiction';

-- Insert detailed lessons for the module
INSERT INTO public.lessons (
  course_id,
  module_id,
  title,
  description,
  lesson_number,
  order_index,
  content_type,
  estimated_duration,
  text_content,
  learning_objectives,
  presentation_slides,
  interactive_elements,
  quiz_questions
)
SELECT 
  c.id,
  m.id,
  'The Psychology of Money in Addiction',
  'Understanding how addiction changes your relationship with money and financial decision-making.',
  1,
  1,
  'interactive',
  15,
  'Addiction fundamentally alters how we perceive and interact with money. During active addiction, money often becomes solely a means to obtain substances, leading to short-term thinking and impulsive financial decisions. Recovery requires rebuilding a healthy relationship with money as a tool for stability, growth, and freedom.',
  ARRAY[
    'Understand how addiction affects financial decision-making',
    'Identify personal money triggers and patterns',
    'Recognize the difference between needs and wants in recovery'
  ],
  jsonb_build_array(
    jsonb_build_object(
      'title', 'Welcome to Financial Recovery',
      'content', 'Your journey to financial health starts here. This lesson will help you understand the deep connection between addiction and money.',
      'type', 'intro',
      'image', '/learning-resources/Financial_Foundations_-_A_Roadmap_to_Stability_in_Recovery.pdf'
    ),
    jsonb_build_object(
      'title', 'The Addiction-Money Cycle',
      'content', 'Addiction creates a destructive cycle where money becomes solely focused on obtaining substances, leading to financial chaos.',
      'type', 'concept',
      'interactive', true
    ),
    jsonb_build_object(
      'title', 'Breaking the Cycle',
      'content', 'Recovery means learning to see money as a tool for freedom, security, and growth rather than just immediate gratification.',
      'type', 'solution'
    )
  ),
  jsonb_build_object(
    'dragDrop', jsonb_build_object(
      'title', 'Money Mindset Sorting',
      'instruction', 'Drag each statement to the correct category: Addiction Mindset or Recovery Mindset',
      'items', jsonb_build_array(
        'Money is only for getting what I need right now',
        'I can save money for future goals',
        'Financial planning is for other people',
        'Building an emergency fund gives me security',
        'I spend money to avoid feelings',
        'I use money as a tool for my values'
      ),
      'categories', jsonb_build_array('Addiction Mindset', 'Recovery Mindset')
    ),
    'reflection', jsonb_build_object(
      'questions', jsonb_build_array(
        'What was your relationship with money during active addiction?',
        'How do you want money to serve your recovery goals?',
        'What financial habits do you want to build in recovery?'
      )
    )
  ),
  jsonb_build_array(
    jsonb_build_object(
      'question', 'What is the primary way addiction affects financial decision-making?',
      'options', jsonb_build_array(
        'It makes people spend more on luxury items',
        'It creates short-term thinking focused on immediate needs',
        'It makes people better at budgeting',
        'It has no real impact on finances'
      ),
      'correct', 1,
      'explanation', 'Addiction creates a pattern of short-term thinking where immediate needs (obtaining substances) override long-term financial planning and stability.'
    ),
    jsonb_build_object(
      'question', 'In recovery, money should be viewed as:',
      'options', jsonb_build_array(
        'Something to be avoided',
        'Only for basic necessities',
        'A tool for freedom and security',
        'Less important than before'
      ),
      'correct', 2,
      'explanation', 'Healthy financial recovery involves seeing money as a tool that can provide security, freedom, and the ability to build the life you want in recovery.'
    )
  )
FROM public.courses c
JOIN public.course_modules m ON m.course_id = c.id
WHERE c.title = 'Introduction to Financial Recovery and Addiction'
  AND m.title = 'Understanding the Link between Addiction and Financial Instability';

-- Add second lesson
INSERT INTO public.lessons (
  course_id,
  module_id,
  title,
  description,
  lesson_number,
  order_index,
  content_type,
  estimated_duration,
  text_content,
  learning_objectives,
  presentation_slides,
  interactive_elements,
  quiz_questions
)
SELECT 
  c.id,
  m.id,
  'Financial Damage Assessment',
  'Learn to honestly assess financial damage from addiction and create a baseline for recovery.',
  2,
  2,
  'interactive',
  20,
  'Recovery begins with honest self-assessment. Understanding the full scope of financial damage from addiction helps create realistic recovery plans and prevents overwhelming feelings that can trigger relapse.',
  ARRAY[
    'Conduct a comprehensive financial damage assessment',
    'Understand the difference between urgent and important financial issues',
    'Create a priority system for financial recovery'
  ],
  jsonb_build_array(
    jsonb_build_object(
      'title', 'Honest Assessment Time',
      'content', 'Recovery requires facing financial reality with compassion and hope. This assessment will help you understand where you are and plan where you are going.',
      'type', 'intro'
    ),
    jsonb_build_object(
      'title', 'Financial Damage Categories',
      'content', 'We will look at debt, credit damage, lost income opportunities, and relationship impacts.',
      'type', 'framework'
    ),
    jsonb_build_object(
      'title', 'Building Your Recovery Plan',
      'content', 'From this honest assessment, we create a step-by-step plan that supports both financial and emotional recovery.',
      'type', 'action'
    )
  ),
  jsonb_build_object(
    'assessment', jsonb_build_object(
      'title', 'Financial Recovery Checklist',
      'categories', jsonb_build_array(
        jsonb_build_object(
          'name', 'Debt Assessment',
          'items', jsonb_build_array(
            'List all current debts',
            'Identify minimum payments',
            'Note any defaulted accounts',
            'Check credit report'
          )
        ),
        jsonb_build_object(
          'name', 'Income Stability',
          'items', jsonb_build_array(
            'Current employment status',
            'Lost job opportunities',
            'Skill gaps to address',
            'Income potential in recovery'
          )
        ),
        jsonb_build_object(
          'name', 'Emergency Planning',
          'items', jsonb_build_array(
            'Current emergency fund',
            'Support system for crises',
            'Recovery-safe financial plan',
            'Relapse prevention strategies'
          )
        )
      )
    ),
    'priorityMatrix', jsonb_build_object(
      'title', 'Financial Priority Matrix',
      'description', 'Categorize your financial issues by urgency and importance to create an effective action plan.',
      'quadrants', jsonb_build_array(
        'Urgent & Important (Do First)',
        'Important, Not Urgent (Plan)',
        'Urgent, Not Important (Delegate/Minimize)',
        'Neither Urgent nor Important (Eliminate)'
      )
    )
  ),
  jsonb_build_array(
    jsonb_build_object(
      'question', 'What is the most important first step in financial recovery assessment?',
      'options', jsonb_build_array(
        'Immediately paying off all debt',
        'Honest evaluation of current financial situation',
        'Finding a higher-paying job',
        'Avoiding all financial discussions'
      ),
      'correct', 1,
      'explanation', 'Honest assessment provides the foundation for realistic planning and prevents the overwhelming feelings that can trigger relapse.'
    )
  )
FROM public.courses c
JOIN public.course_modules m ON m.course_id = c.id
WHERE c.title = 'Introduction to Financial Recovery and Addiction'
  AND m.title = 'Understanding the Link between Addiction and Financial Instability';

-- Add third lesson
INSERT INTO public.lessons (
  course_id,
  module_id,
  title,
  description,
  lesson_number,
  order_index,
  content_type,
  estimated_duration,
  text_content,
  learning_objectives,
  presentation_slides,
  interactive_elements
)
SELECT 
  c.id,
  m.id,
  'Building Recovery-Safe Financial Habits',
  'Develop daily financial practices that support long-term recovery and prevent financial relapse.',
  3,
  3,
  'interactive',
  25,
  'Financial recovery requires building new daily habits that support both emotional and financial health. These practices become the foundation for long-term stability and growth.',
  ARRAY[
    'Develop recovery-safe spending practices',
    'Create accountability systems for financial decisions',
    'Build emergency response plans for financial stress',
    'Establish daily money management routines'
  ],
  jsonb_build_array(
    jsonb_build_object(
      'title', 'Recovery-Safe Financial Practices',
      'content', 'Every financial decision in recovery should support your overall health and sobriety. Learn to create habits that protect both your money and your recovery.',
      'type', 'intro'
    ),
    jsonb_build_object(
      'title', 'The 24-Hour Rule',
      'content', 'For any non-essential purchase over $50, wait 24 hours and discuss with your sponsor or support person before buying.',
      'type', 'strategy'
    ),
    jsonb_build_object(
      'title', 'Daily Financial Check-ins',
      'content', 'Spend 5 minutes each day reviewing your spending, checking balances, and connecting money choices to recovery values.',
      'type', 'practice'
    )
  ),
  jsonb_build_object(
    'habitBuilder', jsonb_build_object(
      'title', 'Recovery Financial Habits',
      'habits', jsonb_build_array(
        jsonb_build_object(
          'name', 'Morning Money Check-in',
          'description', '5-minute review of accounts and spending plan',
          'frequency', 'daily',
          'category', 'awareness'
        ),
        jsonb_build_object(
          'name', '24-Hour Purchase Rule',
          'description', 'Wait 24 hours before non-essential purchases over $50',
          'frequency', 'as needed',
          'category', 'impulse control'
        ),
        jsonb_build_object(
          'name', 'Weekly Financial Meeting',
          'description', 'Review budget and progress with sponsor or support person',
          'frequency', 'weekly',
          'category', 'accountability'
        )
      )
    ),
    'scenarioPlanning', jsonb_build_object(
      'title', 'Financial Crisis Response Plan',
      'scenarios', jsonb_build_array(
        'Unexpected large expense',
        'Job loss or income reduction',
        'Strong urge to spend impulsively',
        'Financial stress triggering cravings'
      ),
      'responseSteps', jsonb_build_array(
        'Pause and breathe',
        'Contact support person',
        'Review recovery priorities',
        'Create action plan',
        'Take one small step'
      )
    )
  )
FROM public.courses c
JOIN public.course_modules m ON m.course_id = c.id
WHERE c.title = 'Introduction to Financial Recovery and Addiction'
  AND m.title = 'Understanding the Link between Addiction and Financial Instability';