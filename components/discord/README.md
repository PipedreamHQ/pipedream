# Overview
 
The Pipedream Discord app enables you to build event-driven workflows that interact with the Discord API. When you authorize the Pipedream app's access to your guilds, you can use [Pipedream workflows](/workflows/) to perform common Discord [actions](#workflow-actions), or [write your own code](/code/) against the Discord API.
 
# Getting Started
 
You can install the Pipedream Discord app in the [Accounts](https://pipedream.com/accounts) section of your account, or directly in a workflow.

<iframe width="560" height="315" src="https://www.youtube.com/embed/IaKs8oA1-5g" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Not sure if you need to use the Discord or the Discord Bot integration for your workflow? Here's are the general similarities and differences:

Discord and Discord Bot actions and triggers _can_ both:

* Listen to events on Discord channels, guilds, etc.
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
3. Click on the **+** button below the trigger step, and search for "Slack".
4. Select the **Send a Message** action.
5. Click the **Connect Account** button near the top of the step. This will prompt you to select any existing Discord accounts you've previously authenticated with Pipedream, or you can select a **New** account. Clicking **New** opens a new window asking you to allow Pipedream access to your Discord account. Choose the right guilde where you'd like to install the app, then click **Allow**.
6. That's it! You can now connect to the Discord API using any of the Discord actions within a Pipedream workflow.
 
# Troubleshooting
 
If you have issues with this integration, please join our public Slack and ask for help.