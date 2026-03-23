import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "Recovery & Wealth"
const SITE_URL = "https://recoveryandwealth.app"

interface ContactConfirmationProps {
  name?: string
}

const ContactConfirmationEmail = ({ name }: ContactConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Thanks for reaching out to {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={headerSection}>
          <Heading style={h1}>{SITE_NAME}</Heading>
        </Section>
        <Hr style={divider} />
        <Heading style={h2}>
          {name ? `Thank you, ${name}!` : 'Thank you for reaching out!'}
        </Heading>
        <Text style={text}>
          We've received your message and appreciate you taking the time to connect with us.
          A member of our team will review your inquiry and get back to you as soon as possible.
        </Text>
        <Text style={text}>
          In the meantime, feel free to explore our resources on recovery and financial wellness.
        </Text>
        <Section style={buttonSection}>
          <Button style={button} href={SITE_URL}>
            Explore Resources
          </Button>
        </Section>
        <Hr style={divider} />
        <Text style={footer}>
          Best regards,<br />The {SITE_NAME} Team
        </Text>
        <Text style={replyNote}>
          You can reply directly to this email to reach us at ryan@recoveryandwealth.com
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactConfirmationEmail,
  subject: 'Thanks for contacting Recovery & Wealth',
  displayName: 'Contact form confirmation',
  previewData: { name: 'Jane' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Arial', 'Helvetica', sans-serif" }
const container = { padding: '20px 25px', maxWidth: '580px', margin: '0 auto' }
const headerSection = { textAlign: 'center' as const, padding: '20px 0 10px' }
const h1 = { fontSize: '24px', fontWeight: 'bold', color: '#3a8a8c', margin: '0', textAlign: 'center' as const }
const h2 = { fontSize: '20px', fontWeight: 'bold', color: '#2d3748', margin: '20px 0 15px' }
const text = { fontSize: '15px', color: '#55575d', lineHeight: '1.6', margin: '0 0 16px' }
const divider = { borderColor: '#e2e8f0', margin: '20px 0' }
const buttonSection = { textAlign: 'center' as const, margin: '24px 0' }
const button = {
  backgroundColor: '#3a8a8c',
  color: '#ffffff',
  padding: '12px 28px',
  borderRadius: '6px',
  fontSize: '15px',
  fontWeight: 'bold',
  textDecoration: 'none',
}
const footer = { fontSize: '13px', color: '#718096', margin: '20px 0 8px', lineHeight: '1.5' }
const replyNote = { fontSize: '12px', color: '#a0aec0', margin: '0' }
