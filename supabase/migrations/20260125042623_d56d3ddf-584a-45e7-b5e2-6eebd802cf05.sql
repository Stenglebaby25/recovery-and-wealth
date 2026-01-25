-- Update existing advanced lessons and add new ones to match the 13-module structure (Weeks 9-21)
-- First, delete existing advanced pathway courses to avoid duplicates
DELETE FROM courses WHERE learning_pathway = 'advanced';

-- Insert the 13 Advanced Modules (Weeks 9-21)
INSERT INTO courses (title, description, content_type, learning_pathway, week_number, order_index, subject) VALUES
(
  'Insurance Essentials',
  'Protecting Your Recovery with the Right Coverage. Learn which types of insurance protect you in recovery and which can wait.',
  'premium',
  'advanced',
  9,
  9,
  'insurance'
),
(
  'Tax Basics for Recovery',
  'Simple Steps to Stay Compliant. Master the tax essentials that every person in recovery needs to know to avoid penalties and maximize refunds.',
  'premium',
  'advanced',
  10,
  10,
  'taxes'
),
(
  'Investing 101',
  'Growing Your Wealth Safely. Learn the fundamentals of investing with a recovery-focused approach that protects your financial sobriety.',
  'premium',
  'advanced',
  11,
  11,
  'investing'
),
(
  'Healthcare Navigation',
  'Understanding Your Options. Navigate the healthcare system effectively, from insurance to treatment coverage and preventive care.',
  'premium',
  'advanced',
  12,
  12,
  'healthcare'
),
(
  'Legal & Financial Rights',
  'Know Your Protections. Understand your legal rights regarding debt, credit, and financial recovery after addiction.',
  'premium',
  'advanced',
  13,
  13,
  'legal'
),
(
  'Healthy Financial Boundaries',
  'Protecting Your Recovery Through Boundaries. Learn to set and maintain financial boundaries that support your sobriety.',
  'premium',
  'advanced',
  14,
  14,
  'boundaries'
),
(
  'Housing & Stability',
  'Building Your Foundation. Navigate housing options and create a stable living situation that supports long-term recovery.',
  'premium',
  'advanced',
  15,
  15,
  'housing'
),
(
  'Banking & Financial Services',
  'Building a Healthy Banking Relationship. Learn to work with financial institutions and build a positive banking history.',
  'premium',
  'advanced',
  16,
  16,
  'banking'
),
(
  'Identity Protection',
  'Safeguarding Your Financial Identity. Protect yourself from identity theft and fraud, especially important during recovery.',
  'premium',
  'advanced',
  17,
  17,
  'identity'
),
(
  'Negotiation Skills',
  'Advocating for Your Financial Interests. Learn to negotiate bills, debts, and contracts effectively and confidently.',
  'premium',
  'advanced',
  18,
  18,
  'negotiation'
),
(
  'Side Income Strategies',
  'Building Additional Income Streams. Explore recovery-friendly ways to increase your income without jeopardizing sobriety.',
  'premium',
  'advanced',
  19,
  19,
  'income'
),
(
  'Financial Amends',
  'Making Things Right. Navigate the process of making financial amends as part of your recovery journey.',
  'premium',
  'advanced',
  20,
  20,
  'amends'
),
(
  'Entrepreneurship in Recovery',
  'Building a Business While Staying Sober. Explore entrepreneurship with recovery-focused guardrails and sustainable practices.',
  'premium',
  'advanced',
  21,
  21,
  'entrepreneurship'
);