# Passing credentials at runtime

If you use a secrets store like [HashiCorp Vault](https://www.vaultproject.io/) or [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/), store credentials in a database, or use a service like [Nango](https://www.nango.dev/) to manage auth, you can retrieve these secrets at runtime and pass them to any step.

There are two ways to pass auth at runtime:

1. [Pass it in an HTTP request](#quickstart-pass-credentials-via-http)
2. [Fetch credentials from a DB or secrets store](#quickstart-fetch-credentials-from-a-db-or-secrets-store) within a workflow step

::: tip
Passing credentials at runtime is in **beta**, and we're looking for feedback. Please [let us know](https://pipedream.com/support) how you're using it, what's not working, and what else you'd like to see.
:::

[[toc]]

## Quickstart — Pass credentials via HTTP

## Quickstart — Fetch credentials from a DB or secrets store

2. Choose Runtime auth for the app prop, reference export that contains creds
3. Security — you can pass the pd-nostore flag if you want to send creds via HTTP and don’t want to store any information in the trace, or do data retention controls on the workflow

## Security

**ARTICULATE DEFAULT RETENTION RULES**

### Use `pd-nostore = 1`
