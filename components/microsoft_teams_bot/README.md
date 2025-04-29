# Overview

By connecting a Microsoft Teams Bot to Pipedream, you can build interactive chat experiences and automate messaging workflows using any of the thousands of apps available on Pipedream.

# Getting Started

To connect your Teams Bot to Pipedream, you'll need to create a bot in Azure, set up a webhook in Pipedream, and configure the Teams app manifest. Follow the detailed instructions below to get started.

## Configuring a Teams Bot in Azure Portal

To get started, you'll need the following:
- An Azure account
- A Microsoft Teams account
- Basic familiarity with Azure Portal

## Quickstart

1. Create a bot in the Azure Portal
2. Set up a Pipedream webhook
3. Configure the bot's messaging endpoint
4. Create and upload the Teams app manifest
5. Install the bot in Teams
6. Configure your Pipedream workflow

For detailed instructions, follow the steps below.

## Detailed Setup Instructions

### 1. Create a Bot in Azure

1. Sign in to the [Azure Portal](https://portal.azure.com)
2. Create a new "Azure Bot" resource
3. During creation:
   - Select "Create new" Microsoft App ID
   - Note down the generated App ID (client_id)
4. Navigate to the "Configuration" section
5. Generate a new client secret
6. Note down the secret value immediately (you won't be able to see it again)

### 2. Set Up Pipedream Webhook to receive bot messages

1. Go to Pipedream
2. Create a new workflow starting with an HTTP trigger
3. Copy the generated webhook URL (format: https://xxx.m.pipedream.net)
   - This will be your bot messaging endpoint

### 3. Configure Bot's Messaging Endpoint

1. Return to your Azure Bot resource
2. Under "Configuration"
3. Set Messaging endpoint to your Pipedream webhook URL

### 4. Create Teams App Manifest

1. Create a new file called `manifest.json` with the following template:

```json
{
    "$schema": "https://developer.microsoft.com/en-us/json-schemas/teams/v1.14/MicrosoftTeams.schema.json",
    "manifestVersion": "1.14",
    "version": "1.0.0",
    "id": "<your-bot-app-id>",
    "packageName": "com.yourcompany.bot",
    "developer": {
        "name": "Your Company",
        "websiteUrl": "https://your-website.com",
        "privacyUrl": "https://your-website.com/privacy",
        "termsOfUseUrl": "https://your-website.com/terms"
    },
    "name": {
        "short": "Your Bot Name",
        "full": "Your Bot Full Name"
    },
    "description": {
        "short": "A brief description",
        "full": "A full description of your bot"
    },
    "icons": {
        "outline": "outline.png",
        "color": "color.png"
    },
    "accentColor": "#FFFFFF",
    "bots": [
        {
            "botId": "<your-bot-app-id>",
            "scopes": [
                "personal",
                "team",
                "groupchat"
            ],
            "supportsFiles": false,
            "isNotificationOnly": false
        }
    ],
    "permissions": [
        "messageTeamMembers"
    ]
}
```

2. Create two icon files:
   - `outline.png` (32x32 pixels)
   - `color.png` (192x192 pixels)
3. Zip these three files together

### 5. Install Bot in Teams

1. Open Microsoft Teams
2. Go to Apps > Upload a custom app
3. Upload your zip file
4. Follow installation prompts, and your bot will now be added to Microsoft Teams!

### 6. Configure Pipedream Workflow

1. Add "Microsoft Teams Bot" app in Pipedream
2. Enter your Bot's App ID and client secret
3. Configure your workflow to process and respond to messages

# Troubleshooting

- **Authentication Issues**: Verify your App ID and client secret are correct
- **Messaging Endpoint Errors**: Ensure your Pipedream webhook URL is properly configured in Azure
- **Teams Installation Problems**: Check that your manifest.json and icon files meet all requirements

For more details, please see:
* [Azure Bot Service Documentation](https://docs.microsoft.com/en-us/azure/bot-service/)
* [Teams App Manifest Documentation](https://docs.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema)
