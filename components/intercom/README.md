# Overview

The Intercom API offers rich capabilities for enhancing customer communication and support workflows. By leveraging this API on Pipedream, you can automate tasks, sync customer data across platforms, and create personalized interactions. Whether you are managing user segments, sending targeted messages, or updating customer profiles, the Intercom API's robust set of endpoints allows for intricate and useful automations within your business processes.

# Getting Started

1. First, sign up for Pipedream at [https://pipedream.com](https://pipedream.com). 
2. [Create a new workflow](https://pipedream.com/new).
3. Select a [trigger](/workflows/steps/triggers/) for your workflow (for example, HTTP or Cron).
4. [Add a new step](/workflows/steps/) and search for "Intercom". This will display [actions](/components#actions) associated with the Intercom app. You can choose to either "Run Node.js code with Intercom" or select one of the prebuilt actions for performing common API operations.
5. Once you've added a step, press the **Connect Account** button near the top. If this is your first time authorizing Pipedream's access to your Intercom account, you'll be prompted to accept that access, and Pipedream will store the authorization grant to enable the workflow to access the Intercom API. If you've already linked an Intercom account via Pipedream, pressing **Connect Account** will list any existing accounts you've linked.

## Removing Pipedream's access to your Intercom account

You can revoke Pipedream's access to your Intercom account by uninstalling the app from your list of Intercom apps in your account.

As soon as you do, any Pipedream workflows that connect to Intercom will immediately fail to work.

You can delete any Intercom connected accounts in [your list of Pipedream Accounts](https://pipedream.com/accounts), as well.

# Example Use Cases

- **Sync Intercom Users to a Google Sheet for Reporting**: Automatically export new and updated Intercom users to a Google Sheet. This workflow can be used to maintain an up-to-date record of your users for reporting, data analysis, or to provide other teams with user information without giving direct access to Intercom.

- **Automated Customer Support Ticket Creation**: Set up a workflow that listens for specific keywords or tags in Intercom conversations and creates tickets in an external system like Jira or Zendesk. This allows for a seamless support experience where tickets are cataloged and prioritized outside of Intercom based on custom criteria.

- **Trigger Email Campaigns from User Events**: Connect Intercom with an email marketing platform like MailChimp or SendGrid. When a user completes a significant action in your app (e.g., signing up, making a purchase), trigger a personalized email campaign that enhances their customer journey and encourages engagement.