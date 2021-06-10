# Intercom

Pipedream allows you to connect to the [Intercom REST API](https://developers.intercom.com/intercom-api-reference/reference) from any workflow.

## Connecting to Intercom from Pipedream

1. First, sign up for Pipedream at [https://pipedream.com](https://pipedream.com). 
2. [Create a new workflow](https://pipedream.com/new).
3. Select a [trigger](/workflows/steps/triggers/) for your workflow (for example, HTTP or Cron).
4. [Add a new step](/workflows/steps/) and search for "Intercom". This will display [actions](/workflows/steps/actions/) associated with the Intercom app. You can choose to either "Run Node.js code with Intercom" or select one of the prebuilt actions for performing common API operations.
5. Once you've added a step, press the **Connect Account** button near the top. If this is your first time authorizing Pipedream's access to your Intercom account, you'll be prompted to accept that access, and Pipedream will store the authorization grant to enable the workflow to access the Intercom API. If you've already linked an Intercom account via Pipedream, pressing **Connect Account** will list any existing accounts you've linked.

## Removing Pipedream's access to your Intercom account

You can revoke Pipedream's access to your Intercom account by uninstalling the app from your list of Intercom apps in your account.

As soon as you do, any Pipedream workflows that connect to Intercom will immediately fail to work.

You can delete any Intercom connected accounts in [your list of Pipedream Accounts](https://pipedream.com/accounts), as well.

<Footer />
