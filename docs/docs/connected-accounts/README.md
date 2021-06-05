# Connected Accounts

Pipedream allows you to connect accounts for various apps and services within our UI. Once you connect an account, you can link that account to any step of a workflow, and use the OAuth access tokens, API key, or other auth info to make API requests to the desired service.

For example, you can connect to Slack from Pipedream (via their OAuth integration), and use the access token Pipedream generates to authorize requests:

<div>
<img alt="Slack code step using access token" width="500" src="./images/slack-token.png">
</div>

Let's review how all of this works below.

[[toc]]

## Supported Apps

Pipedream supports many apps today and will be adding hundreds more over the coming months. To see if we support a specific app, try [connecting your account](#connecting-accounts).

If we don't support a service you need, please [open a request on Github](/new-feature-or-bug) or [reach out](/support/) and let us know.

## Connecting accounts

### From an action

Prebuilt actions that connect to a specific service will require you connect your account for that service below the action:

<div>
<img alt="Connect Slack account" width="350" src="./images/slack-connect-account.png">
</div>

Clicking **Connect Account** will either initiate the OAuth flow for the target service, prompting you to authorize Pipedream to access your account, or present a modal for API key integrations that asks for the necessary keys.

If you've already connected an account for this app, you can also connect that without going through a new auth flow:

<div>
<img alt="Connect existing account" width="500" src="./images/connect-existing-account.png">
</div>

### From a code step

You can connect accounts to code steps, too. First, click the **+** button to the left of any step:

<div>
<img alt="Add new account to code step" width="350" src="./images/add-new-app.png">
</div>

and search for your app in the list that appears:

<div>
<img alt="Search for app" width="350" src="./images/search-for-slack.png">
</div>

If you can't find the app you're looking for, we can [add it for you](#requesting-a-new-app-or-service).

Selecting an app will present the same **Connect Account** button you'll see for actions. Clicking **Connect Account** will either initiate the OAuth flow for the target service, prompting you to authorize Pipedream to access your account, or present a modal for API key integrations that asks for the necessary keys.

If you've already connected an account for this app, you can also connect that without going through a new auth flow:

<div>
<img alt="Connect existing account" width="500" src="./images/connect-existing-account.png">
</div>

## Managing Connected Account from Apps

Visit [https://pipedream.com/accounts](https://pipedream.com/accounts) to see the list of accounts you've previously connected.

You can add or remove accounts from here, and see data associated with those connections: the scopes you've granted Pipedream access to, the number of workflows where you're using the account, and more.

<div>
<img alt="Manage connected account" src="./images/manage-connected-account.png">
</div>

You can also add nicknames to accounts here, making it easier to select the right account when linking these accounts to code steps.

## Types of Integrations

### OAuth

For services that support OAuth, Pipedream operates an OAuth application that mediates access to the service so you don't have to maintain your own app, store refresh and access tokens, and more.

When you connect an account, you'll see a new window open where you authorize the Pipedream application to access data in your account. Pipedream stores the OAuth refresh token tied to your authorization grant, automatically generating access tokens you can use to authorized requests to the service's API. You can access these tokens [in code steps](/workflows/steps/code/auth/).

### Key-based

We also support services that use API keys or other long-lived tokens to authorize requests.

For those services, you'll have to create your keys in the service itself, then add them to your connected accounts in Pipedream.

For example, if you add a new connected account for **Sendgrid**, you'll be asked to add your Sendgrid API key:

<div>
<img alt="Sendgrid API key form" width="500" src="./images/api-key.png">
</div>

When you connect this Sendgrid account to a step, your API key will be available for use in the variable `auths.sendgrid.api_key_id`. See the docs on [auth in code steps](/workflows/steps/code/auth/) for more information.

## Requesting a new app or service

If we don't support a service you need to connect to, please [open a request on Github](/new-feature-or-bug) or [reach out](/support/) and let us know.

<Footer />
