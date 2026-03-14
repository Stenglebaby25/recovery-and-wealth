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

interface EmailChangeEmailProps {
  siteName: string
  email: string
  newEmail: string
  confirmationUrl: string
}

export const EmailChangeEmail = ({
  siteName,
  email,
  newEmail,
  confirmationUrl,
}: EmailChangeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email change for Recovery &amp; Wealth</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://recovery-and-wealth.lovable.app/recovery-wealth-logo-bold.png"
          alt="Recovery & Wealth"
          width="180"
          height="auto"
          style={{ marginBottom: '24px' }}
        />
        <Heading style={h1}>Confirm your email change</Heading>
        <Text style={text}>
          You requested to change your email from{' '}
          <Link href={`mailto:${email}`} style={link}>{email}</Link>{' '}
          to{' '}
          <Link href={`mailto:${newEmail}`} style={link}>{newEmail}</Link>.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirm Email Change
        </Button>
        <Text style={footer}>
          If you didn't request this, please secure your account immediately.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default EmailChangeEmail

const main = { backgroundColor: '#f5f7f9', fontFamily: "'Segoe UI', Roboto, Arial, sans-serif" }
const container = { padding: '32px 28px', backgroundColor: '#ffffff', borderRadius: '8px', margin: '40px auto', maxWidth: '480px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#29333D', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#676F77', lineHeight: '1.6', margin: '0 0 24px' }
const link = { color: '#3F8EA3', textDecoration: 'underline' }
const button = { backgroundColor: '#3F8EA3', color: '#ffffff', fontSize: '15px', borderRadius: '6px', padding: '14px 28px', textDecoration: 'none', fontWeight: 'bold' as const }
const footer = { fontSize: '12px', color: '#999999', margin: '32px 0 0' }
