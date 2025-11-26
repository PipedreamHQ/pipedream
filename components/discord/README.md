# Overview

The Discord API interacts seamlessly with Pipedream, empowering you to craft customized automations and workflows for your Discord server. With this powerful integration, you can automate tasks like message posting, user management, and notifications, based on a myriad of triggers and actions from different apps. These automations can enhance the Discord experience for community moderators and members, by synchronizing with external tools, organizing community engagement, and streamlining notifications.

# Getting Started

You can install the Pipedream Discord app in the [Accounts](https://pipedream.com/accounts) section of your account, or directly in a workflow.

<iframe width="560" height="315" src="https://www.youtube.com/embed/IaKs8oA1-5g" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Not sure if you need to use the Discord or the Discord Bot integration for your workflow? Here's are the general similarities and differences:

Discord and Discord Bot actions and triggers _can_ both:

* Listen to events on Discord channels, servers, etc.
* Perform actions like sending messages, managing channels, and members

However the Discord integration will perform actions with the official Pipedream Discord bot.

Using the Discord Bot integration will use a custom bot instead, with it's own name and photo.

### Accounts

1. Visit [https://pipedream.com/accounts](https://pipedream.com/accounts).
2. Click on the **Click Here To Connect An App** button in the top-right.
3. Search for "Discord" among the list of apps, and select it.
4. This will open a new window asking you to allow Pipedream access to your Slack workspace. Choose the right workspace where you'd like to install the app, then click **Allow**.
5. That's it! You can now use this Discord account in any [actions](#workflow-actions), or [link it to any code step](/connected-accounts/#connecting-accounts).

### Within a workflow

1. [Create a new workflow](https://pipedream.com/new).
2. Select your trigger (HTTP, Cron, etc.).
3. Click on the **+** button below the trigger step, and search for "Discord".
4. Select the **Send Message** action.
5. Click the **Connect Account** button near the top of the step. This will prompt you to select any existing Discord accounts you've previously authenticated with Pipedream, or you can select a **New** account. Clicking **New** opens a new window asking you to allow Pipedream access to your Discord account. Choose the server where you'd like to install the app, then click **Allow**.
6. That's it! You can now connect to the Discord API using any of the Discord actions within a Pipedream workflow.

# Example Use Cases

- **Automate Welcome Messages**: Trigger a workflow on Pipedream when a new user joins your Discord server to send them a personalized welcome message. Enhance this by adding a step to tag the user in a welcome channel or send them a DM with server rules and helpful resources.

- **Sync Discord Roles with External Databases**: Manage Discord roles by syncing with user data from an external database or Google Sheets. When a user's status changes in the sheet—like upgrading to a paid tier of your service—use Pipedream to automatically update their role in Discord to reflect their new privileges.

- **Content Alerts from Social Media**: Monitor social media platforms like Twitter or YouTube using their respective APIs on Pipedream. When a new tweet or video is posted, trigger a workflow that shares this content in a dedicated Discord channel, keeping your community engaged and informed about the latest updates.


# Troubleshooting

If you have issues with this integration, please join our public Slack and ask for help.
