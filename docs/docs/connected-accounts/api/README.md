# Accessing credentials via API

::: tip
Accessing credentials via API is in **beta**, and we're looking for feedback. Please [let us know](https://pipedream.com/support) how you're using it, what's not working, and what else you'd like to see.

During the beta:

- All API calls to `/v1/accounts/*` are free.
- The API is subject to change.

:::

## Quickstart

1. Connect an account
2. Copy account ID
3. `GET /v1/accounts/:id/credentials`. Cache based on expires at

## Example: Accessing OAuth tokens from AWS Lambda

1. Create function that hits the Google Sheets API
2. Call Pipedream to get credentials
3. Scaling this: cache credentials in DynamoDB, Dynamo always gets a fresh access token

## Security

### How Pipedream secures credentials

### Controls you should enforce to secure credentials

#### Make accounts private
