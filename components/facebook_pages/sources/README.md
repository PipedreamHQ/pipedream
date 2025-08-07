# Facebook Pages Webhook Sources

This directory contains webhook sources for Facebook Pages events. These sources allow you to receive real-time notifications when various events occur on your Facebook Page.

## Available Sources

### 1. New Feed Activity (`new-feed-activity`)
Emit new event when there's any new activity in your Facebook Page's feed. This includes new posts, comments, reactions, and shares.

### 2. New Post to Page (`new-post`)
Emit new event when a new post is made to your Facebook Page's feed.

### 3. New Comment on Post (`new-comment`)
Emit new event when a new comment is added to a post on your Facebook Page.

### 4. New Reaction on Post (`new-reaction`)
Emit new event when someone reacts to a post on your Facebook Page (likes, love, wow, etc.).

### 5. New Share of Post (`new-share`)
Emit new event when someone shares a post from your Facebook Page.

### 6. Page Updated (`page-updated`)
Emit new event when your Facebook Page information is updated (such as description, hours, location, etc.).

### 7. New Message Received (`new-message`)
Emit new event when your Facebook Page receives a new message via Messenger.

## Setup Instructions

To use these webhook sources, you need to:

1. **Create a Facebook App**:
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app or use an existing one
   - Note your App ID

2. **Configure Webhooks in Facebook**:
   - In your Facebook App dashboard, go to Webhooks
   - Subscribe to the "Page" object
   - When deploying a source in Pipedream, you'll get a webhook URL and verify token
   - Use these values in your Facebook webhook configuration

3. **Set Required Permissions**:
   - For feed webhooks: `pages_manage_metadata` and `pages_show_list`
   - For message webhooks: `pages_messaging`

4. **Subscribe Your Page**:
   - The webhook source will automatically subscribe your selected page to receive events
   - Make sure your page has not disabled the App platform in its settings

## Common Properties

All webhook sources share these properties:

- **Facebook Pages App**: Your Facebook Pages connection
- **Page**: The Facebook Page to monitor for events
- **Verify Token**: A custom string for webhook verification (auto-generated but can be customized)

## Event Data

Each webhook event includes relevant data such as:
- Event type and timestamp
- User information (when available)
- Content (messages, post text, etc.)
- Related IDs (post_id, comment_id, etc.)

## Troubleshooting

1. **Webhook not receiving events**: 
   - Ensure your Facebook App has the correct permissions
   - Verify the webhook is properly configured in Facebook
   - Check that your page has the app installed

2. **Verification failing**:
   - Make sure the verify token matches exactly between Pipedream and Facebook
   - The webhook URL must be publicly accessible (HTTPS)

3. **Missing events**:
   - Some events require specific permissions
   - Check Facebook's webhook documentation for limitations