# Passing credentials at runtime

If you use a secrets store like [HashiCorp Vault](https://www.vaultproject.io/) or [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/), store credentials in a database, or use a service like [Nango](https://www.nango.dev/) to manage auth, you can retrieve these secrets at runtime and pass them to any step.

There are two ways to pass auth at runtime:

1. [Pass it in an HTTP request](#pass-credentials-via-http)
2. [Fetch credentials from a DB or secrets store](#fetch-credentials-from-a-db-or-secrets-store) within a workflow step

::: tip Runtime auth is in beta
Passing credentials at runtime is in **beta**, and we're looking for feedback. Please [let us know](https://pipedream.com/support) how you're using it, what's not working, and what else you'd like to see.
:::

## Pass credentials via HTTP

1. If not already configured, [add an HTTP trigger](/workflows/steps/triggers/#http) to your workflow.
2. From your app, retrieve credentials and send them in an HTTP request to the endpoint with the rest of the payload.
3. In the step of your workflow where you'd like to pass these credentials, select the **Use runtime authentication** option at the bottom-right of the account selector:

<div>
<img src="https://res.cloudinary.com/pipedreamin/image/upload/v1707630109/docs/Screenshot_2024-02-10_at_9.39.59_PM_vp4wz1.png" />
</div>

4. You'll be prompted for all required credentials for the app, often just an `oauth_access_token` or `api_key`. [Find the variable that contains your credentials](workflows/events/#copying-references-to-event-data) and pass them to each field:

<div style="margin-bottom: 2rem">
<img src="https://res.cloudinary.com/pipedreamin/image/upload/v1707630112/docs/Screenshot_2024-02-10_at_9.40.54_PM_hynkvq.png" />
</div>

::: warning Default logging

When you return credentials from workflow steps, Pipedream stores it with the rest of the workflow execution data. Workflow events are retained according to the default retention policy for your plan and any [data retention controls](/workflows/settings/#data-retention-controls) you've configured.

You can set [the `pd-nostore` flag](/workflows/steps/triggers/#x-pd-nostore) to `1` on requests with credentials to disable logging for those requests only.

:::

## Fetch credentials from a DB or secrets store

1. Add a step to your workflow to fetch credentials from your DB or secrets store.
2. In the step of your workflow where you'd like to pass these credentials, select the **Use runtime authentication** option at the bottom-right of the account selector:

<div>
<img src="https://res.cloudinary.com/pipedreamin/image/upload/v1707630109/docs/Screenshot_2024-02-10_at_9.39.59_PM_vp4wz1.png" />
</div>

3. You'll be prompted for all required credentials for the app, often just an `oauth_access_token` or `api_key`. [Find the variable that contains your credentials](workflows/events/#copying-references-to-event-data) and pass them to each field:

<div style="margin-bottom: 2rem">
<img src="https://res.cloudinary.com/pipedreamin/image/upload/v1707630112/docs/Screenshot_2024-02-10_at_9.40.54_PM_hynkvq.png" />
</div>

::: warning Default logging

When you return credentials from workflow steps, Pipedream stores it with the rest of the workflow execution data. Workflow events are retained according to the default retention policy for your plan and any [data retention controls](/workflows/settings/#data-retention-controls) you've configured.

You can set [the `pd-nostore` flag](/workflows/steps/triggers/#x-pd-nostore) to `1` on requests with credentials to disable logging for those requests only.

:::
