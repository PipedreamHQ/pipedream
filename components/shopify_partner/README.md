# Shopify Partner API Integration

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
