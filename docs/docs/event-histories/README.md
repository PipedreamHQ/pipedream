# Event History

Monitor all workflow events and their stace traces in one centralized view under the [**Event History**](https://pipedream.com/event-history) section in the dashboard.

Within the **Event History**, you'll be able to filter your events by workflow, execution status, within a specific time range.

This includes events in progress for time time visibility into the health of your workflows.

[[toc]]

## Filtering Events

The filters at the top of the screen allow you to search all events processed by your workflows:

![Filtering all events in a workspace by it's status, when it was executed or by workflow ID](https://res.cloudinary.com/pipedreamin/image/upload/v1682696567/docs/docs/event%20histories/CleanShot_2023-04-28_at_11.42.19_d8bfer.png)

You can filter by the event's **Status**, **time of initiation** or by the **Workflow ID**.

::: tip 

The filters are scoped to the current [workspace](/workspaces/).

If you're not seeing the events or workflow you're expecting, try [switching workspaces](workspaces/#switching-between-workspaces).

:::

### All failed workflow executions

You can view all failed workflow executions by applying the **Error** status filter.

This will only display the failed workflow executions in the selected time period.

This view in particular is helpful for identifying trends of errors, or workflows with persistent problems.

### Within a time range

Filtering by time range will only include workflow events _started_ within the define range.

::: tip Long running workflows

The time range filter depends on when the execution event first started. If a long running workflow starts within the specified time range but it's execution continues _past_ the filtered timeframe, it will still be included in the results.

:::

### Filtering by workflow

You can also filter events by a specific workflow. You can search by the workflow's ID, which has the format `p_******`.

Alternatively, you can filter by workflow from a specific event. First open the menu on the far right, then select **Filter By Workflow**. Then only events processed by that workflow will appear.

::: tip How to find your workflow's ID

To find a workflow's ID, open the workflow and look at the URL. The URL will contain the workflow ID after the workflow's title.

For example, in the URL `https://pipedream.com/@pierce/untitled-workflow-p_abc123/build` the Workflow ID is `p_abc123`.

:::

## Inspecting events

Clicking on an individual event will open a panel that displays the steps executed, their individual configurations, as well as the overall performance and results of the entire workflow.

### Overall status

The top of the event history details will display details including the overall status of that particular event execution and errors if any.

If there is an error message, the link at the bottom of the error message will link to the corresponding workflow step that threw the error.



::: warning The event log is missing a workflow step, or the configuration is not what I expect

Changing a workflow _after_ a particular event's execution will not update it's event history with that new workflow change.

You'll need to replay an event to execute the workflow with the latest changes.

:::


## Limits

The amount of events recorded and available for viewing in the Event History depends on your plan. [Please see the pricing page](https://pipedream.com/pricing) for more details.

::: warning Event evictions

Upgrading your plan will allow future events to be included in your Event History. However events evicted from the history before the upgrade will not be recoverable.

:::
