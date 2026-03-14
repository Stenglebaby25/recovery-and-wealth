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
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({
  siteName,
  confirmationUrl,
}: RecoveryEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Reset your Recovery &amp; Wealth password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://recovery-and-wealth.lovable.app/recovery-wealth-logo-bold.png"
          alt="Recovery & Wealth"
          width="180"
          height="auto"
          style={{ marginBottom: '24px' }}
        />
        <Heading style={h1}>Reset your password</Heading>
        <Text style={text}>
          We received a request to reset your password. Click below to choose a new one.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Reset Password
        </Button>
        <Text style={footer}>
          If you didn't request this, you can safely ignore this email. Your password won't change.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = { backgroundColor: '#f5f7f9', fontFamily: "'Segoe UI', Roboto, Arial, sans-serif" }
const container = { padding: '32px 28px', backgroundColor: '#ffffff', borderRadius: '8px', margin: '40px auto', maxWidth: '480px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#29333D', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#676F77', lineHeight: '1.6', margin: '0 0 24px' }
const button = { backgroundColor: '#3F8EA3', color: '#ffffff', fontSize: '15px', borderRadius: '6px', padding: '14px 28px', textDecoration: 'none', fontWeight: 'bold' as const }
const footer = { fontSize: '12px', color: '#999999', margin: '32px 0 0' }
