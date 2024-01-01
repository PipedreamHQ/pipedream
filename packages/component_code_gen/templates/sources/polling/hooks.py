hooks = """## Source Hooks

Pipedream sources support the following hooks: deploy, activate and deactivate. 

The deploy() hook is automatically invoked by Pipedream when a source is deployed. It is normally used to fetch historical data from the API and emit events for each item. Emit at most 50 events in order of most recent to least recent. Please paginate through all until the last 50 events are reached, unless sorting events by most recent is available. 

The activate() hook is automatically invoked by Pipedream when a source is activated. It is usually used to create a webhook subscription. 

The deactivate() hook is automatically invoked by Pipedream when a source is deactivated. It is usually used to delete a webhook subscription. Always include code for all three hooks."""
