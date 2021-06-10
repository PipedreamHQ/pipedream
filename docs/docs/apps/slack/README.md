# Slack

The Pipedream Slack app enables you to build event-driven workflows that interact with the Slack API. When you authorize the Pipedream app's access to your workspace, you can use [Pipedream workflows](/workflows/) to perform common Slack [actions](#workflow-actions), or [write your own code](/workflows/steps/code/) against the Slack API.

The Pipedream Slack app is not a typical app. You don't interact with it directly as a bot, and it doesn't add custom functionality to your workspace out of the box. It just makes it easier to automate anything you'd typically use the Slack API for, using Pipedream workflows. 

[[toc]]

## Installing the Pipedream app

You can install the Pipedream Slack app in the [Accounts](https://pipedream.com/accounts) section of your account, or directly in a workflow

### Accounts

1. Visit [https://pipedream.com/accounts](https://pipedream.com/accounts).
2. Click on the **Click Here To Connect An App** button in the top-right.
3. Search for "Slack" among the list of apps, and select it.
4. This will open a new window asking you to allow Pipedream access to your Slack workspace. Choose the right workspace where you'd like to install the app, then click **Allow**.
5. That's it! You can now use this Slack account in any [actions](#workflow-actions), or [link it to any code step](/connected-accounts/#connecting-accounts).

### Within a workflow

1. [Create a new workflow](https://pipedream.com/new).
2. Select your trigger (HTTP, Cron, etc.).
3. Click on the **+** button below the trigger step, and search for "Slack".
4. Select the **Send a Message** action.
5. Click the **Connect Account** button near the top of the step. This will prompt you to select any existing Slack accounts you've previously authenticated with Pipedream, or you can select a **New** account. Clicking **New** opens a new window asking you to allow Pipedream access to your Slack workspace. Choose the right workspace where you'd like to install the app, then click **Allow**.
6. That's it! You can now connect to the Slack API using any of the Slack actions within a Pipedream workflow.

## Workflow Actions

[Actions](/workflows/steps/actions/) are reusable code steps that wrap common operations for an API. Pipedream provides Slack actions for sending a message, setting a channel topic, adding reminders, and more.

## Privacy Policy

Please see the [Pipedream Privacy Policy](https://pipedream.com/privacy) for a detailed description of how we manage your data.

## Support

Please [reach out](/support/) to the Pipedream team with any technical issues or questions about the Slack integration. We're happy to help!
