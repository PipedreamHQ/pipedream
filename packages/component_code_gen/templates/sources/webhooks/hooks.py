hooks = """## Source Hooks

Pipedream sources support the following hooks: `deploy`, `activate` and `deactivate`.

The `deploy()` hook is used to fetch and emit historical data events from the app. The max number of historical events is 50, the most recent ones. If sorting events by most recent is available, make only one API call to fetch the 50 most recent events and emit them. If the sorting parameter is not available, be sure to paginate through all until the last 50 events are reached, and then emit them in from oldest to most recent.

The `activate()` hook should contain code to create a webhook subscription. You should save the webhook ID in order to delete it in the `deactivate()` hook.

The `deactivate()` hook should contain code to delete the webhook subscription.

Be sure to always include all three hooks."""
