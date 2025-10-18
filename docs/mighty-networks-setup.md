# Mighty Networks + Zapier Integration Setup

This guide explains how to connect your Recovery & Wealth app with Mighty Networks using Zapier webhooks.

## Overview

When users sign up for your app, a webhook is automatically sent to Zapier, which then creates or updates their account in Mighty Networks. This allows seamless cross-platform access.

## Setup Steps

### 1. Get Your Webhook URL

Your webhook endpoint is:
```
https://qnrgymppanngkpwsgqrx.supabase.co/functions/v1/mighty-networks-webhook
```

### 2. Create a Zapier Account

1. Go to [Zapier.com](https://zapier.com) and create an account
2. Click "Create Zap"

### 3. Configure the Trigger (Webhooks by Zapier)

1. **Choose App**: Search for "Webhooks by Zapier"
2. **Trigger Event**: Select "Catch Hook"
3. **Pick off a Child Key**: Leave blank
4. **Copy Webhook URL**: Zapier will provide a webhook URL - save this for later
5. **Test**: Skip for now, we'll test after connecting

### 4. Configure the App to Send Data to Zapier

Add this code to your signup flow (already implemented in the app):

```typescript
// After successful user signup
const webhookUrl = 'YOUR_ZAPIER_WEBHOOK_URL_HERE';
await fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: user.email,
    full_name: user.user_metadata?.full_name,
    event_type: 'user_signup',
    timestamp: new Date().toISOString(),
  }),
});
```

### 5. Configure the Action (Mighty Networks)

1. **Choose App**: Search for "Mighty Networks"
2. **Action Event**: Select "Create Member" or "Update Member"
3. **Connect Account**: Log in to your Mighty Networks account
4. **Customize Member**:
   - Email: Use the email from Step 1 (webhook data)
   - Name: Use the full_name from Step 1
   - Other fields as needed

### 6. Configure Secondary Webhook to Recovery & Wealth

After creating the member in Mighty Networks, add another action:

1. **Choose App**: "Webhooks by Zapier"
2. **Action Event**: "POST"
3. **URL**: `https://qnrgymppanngkpwsgqrx.supabase.co/functions/v1/mighty-networks-webhook`
4. **Payload Type**: JSON
5. **Data**:
```json
{
  "email": "{{email from trigger}}",
  "full_name": "{{name from trigger}}",
  "event_type": "user_created",
  "mighty_networks_id": "{{member_id from Mighty Networks}}"
}
```

### 7. Test the Integration

1. Sign up a test user in your Recovery & Wealth app
2. Check that:
   - The Zapier trigger fires
   - Member is created in Mighty Networks
   - Webhook confirmation is sent back to your app
3. Verify the user can access both platforms

## Treatment Center Flow

For treatment center clients:

1. Admin adds client in the app (Facilities > Clients tab)
2. Client gets premium access automatically
3. When sponsorship ends, they get a 14-day trial
4. During trial, they can subscribe via Stripe or convert through Mighty Networks

## Webhook Events

The webhook supports these event types:

- `user_signup` - New user registration
- `user_created` - User created in Mighty Networks
- `subscription_changed` - User subscription status updated

## Troubleshooting

### Webhook Not Firing
- Check the webhook URL is correct
- Verify Zapier is turned ON
- Check Zapier Task History for errors

### Member Not Created
- Verify Mighty Networks credentials
- Check required fields are mapped
- Review Mighty Networks API limits

### Data Not Syncing
- Check webhook payload structure
- Verify email addresses match
- Review edge function logs in Supabase

## Support

For issues with:
- **Zapier**: Check [Zapier Help](https://help.zapier.com)
- **Mighty Networks**: Contact [Mighty Networks Support](https://support.mightynetworks.com)
- **Your App**: Check Supabase edge function logs
