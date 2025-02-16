hooks = """<SourceHooks>

Hooks are functions that are automatically invoked by Pipedream when a source is deployed, activated, or deactivated. They're included in the `hooks` property of a source component.

Pipedream sources support the following `hooks`: `deploy`, `activate` and `deactivate`. 

The `deploy` hook is automatically invoked by Pipedream when a source is deployed. 

When writing a source, you must use the `deploy` hook to fetch historical data from the appropriate API endpoint and emit events for each item. Emit at most 50 events in order of most recent to least recent. Please paginate through all until the last 50 events are reached, unless sorting events by most recent is available. 

The `activate` hook is automatically invoked by Pipedream when a source is activated. Normally, you use it to create a webhook subscription.  You should create a webhook subscription here if the API communicates events via webhook that you can create a subscription for programmatically.

The `deactivate` hook is automatically invoked by Pipedream when a source is deactivated. It is usually used to delete a webhook subscription. 

Always include code for all three hooks, even if you don't use them.

</SourceHooks>"""
