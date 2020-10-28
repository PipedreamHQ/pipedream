# Workflow Settings

You can control workflow-specific settings in the **Settings** header, just above your workflow's code.

<div>
<img alt="Workflow settings" src="./images/workflow-settings.png">
</div>

## Errors

By default, any errors raised in a workflow are sent to the **Global Error Workflow**. This workflow sends you an email with the details of this error, once per error, per workflow, per 24-hour period.

But the Global Error Workflow is just another workflow, and lives in your account. So you can modify it however you'd like. For example, you can send errors to Slack, or send critical issues to Pagerduty, or log all errors to a table in the [SQL service](/destinations/sql/) for later analysis.

## Execution Timeout Limit

Workflows have a default [execution limit](/limits/#time-per-execution), which defines the time workflows can run for a single invocation until they're timed out.

If your workflow times out, and needs to run for longer than the [default limit](/limits/#time-per-execution), you can change that limit here.

## Concurrency and Throttling

[Manage the concurrency and rate](/workflows/events/concurrency-and-throttling/) at which events from a source trigger your workflow code.

## Current checkpoint values

If you're using [`$checkpoint`](/workflows/steps/code/#workflow-level-state-checkpoint) or [`this.$checkpoint`](/workflows/steps/code/#step-level-state-this-checkpoint) to manage state in your workflow, you can view their values here. You can also modify the values or clear the whole contents of a given checkpoint.
