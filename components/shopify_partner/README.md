# Overview

The Shopify Partner API lets you tap into a comprehensive suite of features to manage and analyze multiple Shopify stores. You can automate tasks like creating development stores, adding collaborators, tracking payouts, and more. This API serves as a powerful tool for developers, agencies, and freelancers who manage multiple Shopify shops for their clients. Through Pipedream, you can effortlessly integrate Shopify Partner API with other services to create tailored, efficient workflows that save time and enhance productivity.

# Getting Started

## Configure API Key

In order to authorize Pipedream to access your Shopify Partner Account, you will need to generate a new API key for Pipedream to use on your behalf.

First, [create an API client in your Shopify Partner account](https://shopify.dev/api/partner/getting-started#create-an-api-client).

Make sure to include these scopes:

- `View financials`
- `Manage apps`

You will use this API key to authenticate your Pipedream workflows with Shopify Partners.

### New App Installs

This action will poll the Shopify Partner API for new app installs, requires an `app_id` in the Shopify GraphQL API GID format.

### New App Uninstalls

This action will poll the Shopify Partner API for new app installs, requires an `app_id` in the Shopify GraphQL GID format.

### New Transactions

This action will poll the Shopify Partner API for new app charges, including reoccurring, one time and usage charges.

# Example Use Cases

- **Automated Development Store Setup**: Streamline the process of setting up new development stores for clients by creating a Pipedream workflow. This can automatically configure store preferences, install essential apps, and set up staff accounts when a new project is initiated in your project management tool (like Trello or Asana).

- **Collaborator Access Management**: Craft a workflow on Pipedream that manages collaborator requests and access levels. For instance, when a new team member is added to your GitHub repository, the workflow can send a collaborator invitation for the corresponding Shopify store, ensuring seamless team onboarding.

- **Payout Tracking and Notifications**: Build a notification system with Pipedream that monitors and reports on your Shopify Partner payouts. Configure a workflow to send a summary of payouts via Slack or email on a regular basis, or trigger alerts when payouts fall below a certain threshold, helping you maintain financial oversight.