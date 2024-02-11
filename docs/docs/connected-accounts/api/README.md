# Accessing credentials via API

When you [connect an account](/connected-accounts/#connecting-accounts), you can use it in workflows, authorizing requests to any app. Pipedream manages the OAuth process for [OAuth apps](/connected-accounts/#oauth), ensuring you always have a fresh access token for requests.

You can also access account credentials from the Pipedream API, using them in any other tool or app where you need auth. This guide will show you how to run an AWS Lambda script that fetches credentials from Pipedream, how to scale it, and how to secure access to sensitive credentials.

::: tip
Accessing credentials via API is in **beta**, and we're looking for feedback. Please [let us know](https://pipedream.com/support) how you're using it, what's not working, and what else you'd like to see.

During the beta:

- All API calls to `/v1/accounts/*` are free.
- The API is subject to change.

:::

[[toc]]

## Quickstart

1. Connect an account
2. Copy account ID
3. `GET /v1/accounts/:id/credentials`. Cache based on `expires_at`

## Example: Accessing OAuth tokens from AWS Lambda

1. Create function that hits the Google Sheets API
2. Call Pipedream to get credentials
3. Scaling this: cache credentials in DynamoDB (or whatever cache you want), Dynamo always gets a fresh access token.

## Security

### How Pipedream secures credentials

[See our security docs](/privacy-and-security/#third-party-oauth-grants-api-keys-and-environment-variables) for details on how Pipedream secures your credentials.

### Security controls you should enforce

#### Set account permissions
