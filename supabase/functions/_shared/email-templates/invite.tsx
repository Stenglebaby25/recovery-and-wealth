/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You've been invited to Recovery &amp; Wealth</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://recovery-and-wealth.lovable.app/recovery-wealth-logo-bold.png"
          alt="Recovery & Wealth"
          width="180"
          height="auto"
          style={{ marginBottom: '24px' }}
        />
        <Heading style={h1}>You've been invited! 🎉</Heading>
        <Text style={text}>
          You've been invited to join{' '}
          <Link href={siteUrl} style={link}>
            <strong>Recovery &amp; Wealth</strong>
          </Link>
          . Accept below to start building financial stability in recovery.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Accept Invitation
        </Button>
        <Text style={footer}>
          If you weren't expecting this, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

const main = { backgroundColor: '#f5f7f9', fontFamily: "'Segoe UI', Roboto, Arial, sans-serif" }
const container = { padding: '32px 28px', backgroundColor: '#ffffff', borderRadius: '8px', margin: '40px auto', maxWidth: '480px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#29333D', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#676F77', lineHeight: '1.6', margin: '0 0 24px' }
const link = { color: '#3F8EA3', textDecoration: 'underline' }
const button = { backgroundColor: '#3F8EA3', color: '#ffffff', fontSize: '15px', borderRadius: '6px', padding: '14px 28px', textDecoration: 'none', fontWeight: 'bold' as const }
const footer = { fontSize: '12px', color: '#999999', margin: '32px 0 0' }
