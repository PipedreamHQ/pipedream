# Event History

Monitor all workflow events and their stack traces in one centralized view under the [**Event History**](https://pipedream.com/event-history) section in the dashboard.

Within the **Event History**, you'll be able to filter your events by workflow, execution status, within a specific time range.

[[toc]]

## Filtering Events

The filters at the top of the screen allow you to search all events processed by your workflows.

You can filter by the event's **Status**, **time of initiation** or by the **Workflow name**.

::: tip

The filters are scoped to the current [workspace](/workspaces/).

If you're not seeing the events or workflow you're expecting, try [switching workspaces](/workspaces/#switching-between-workspaces).

:::

### Filtering by status

The **Status** filter controls which events are shown by their status. For example selecting the **Success** status, you'll be shown all events that were successfully executed by workflows.

![Only showing workflow events by current execution status](https://res.cloudinary.com/pipedreamin/image/upload/v1689875830/docs/docs/event%20histories/image_44_g2sabg.png)

#### All failed workflow executions

You can view all failed workflow executions by applying the **Error** status filter.

This will only display the failed workflow executions in the selected time period.

This view in particular is helpful for identifying trends of errors, or workflows with persistent problems.

![Viewing all failed workflow executions by the filter in the Event History](https://res.cloudinary.com/pipedreamin/image/upload/v1689876111/docs/docs/event%20histories/CleanShot_2023-07-20_at_14.01.43_2x_nksdxd.png)

#### All paused workflow executions

Workflows that are paused from `$.flow.delay` or `$.flow.suspend` will be shown when this filter is activated.

![Only showing workflows that are currently paused](https://res.cloudinary.com/pipedreamin/image/upload/v1689875506/docs/docs/event%20histories/CleanShot_2023-07-20_at_13.51.11_2x_kn2dpw.png)

::: warning

If you're using `setTimeout` or `sleep` in Node.js or Python steps, the event will not be considered **Paused**. Using those language native execution holding controls leaves your workflow in a **Executing** state.

:::

### Within a time frame

Filtering by time frame will only include workflow events _started_ within the defined range.

Using this dropdown, you can select between convenient time ranges, or specify a custom range on the right side.

![How to filter events by a timerange](https://res.cloudinary.com/pipedreamin/image/upload/v1683747452/docs/docs/event%20histories/CleanShot_2023-05-10_at_15.37.01_2x_oxb07m.png)

::: tip Long running workflows

The time range filter depends on when the execution event first started. If a long running workflow starts within the specified time range but it's execution continues _past_ the filtered timeframe, it will still be included in the results.

:::

### Filtering by workflow

You can also filter events by a specific workflow. You can search by the workflow's name in the search bar in the top right.

![Search by workflow name in the search bar](https://res.cloudinary.com/pipedreamin/image/upload/v1683747588/docs/docs/event%20histories/CleanShot_2023-05-10_at_15.39.30_2x_yoa1k6.png)

Alternatively, you can filter by workflow from a specific event. First, open the menu on the far right, then select **Filter By Workflow**. Then only events processed by that workflow will appear.

![Filtering events by workflow by selecting the workflow on the right](https://res.cloudinary.com/pipedreamin/image/upload/v1683747695/docs/docs/event%20histories/CleanShot_2023-05-10_at_15.41.20_2x_ulvdns.png)

## Inspecting events

Clicking on an individual event will open a panel that displays the steps executed, their individual configurations, as well as the overall performance and results of the entire workflow.

At this time it is not possible to edit the workflow with the selected event history. Only events shown in the [event inspector](/workflows/events/inspect/#the-inspector) can be choosen for the workflow builder.

The top of the event history details will display details including the overall status of that particular event execution and errors if any.

If there is an error message, the link at the bottom of the error message will link to the corresponding workflow step that threw the error.

![Viewing individual event executions](https://res.cloudinary.com/pipedreamin/image/upload/v1683748495/docs/docs/event%20histories/CleanShot_2023-05-10_at_15.53.44_2x_t30gsb.png)

::: warning The event log is missing a workflow step, or the configuration is not what I expect

Changing a workflow _after_ a particular event's execution will not update it's event history with that new workflow change.

You'll need to replay an event to execute the workflow with the latest changes.

:::

## Limits

The number of events recorded and available for viewing in the Event History depends on your plan. [Please see the pricing page](https://pipedream.com/pricing) for more details.

## Frequently asked questions

### Are event histories available on all plans?

Yes, event history is available for all workspace plans, including free plans. However, the length of searchable or viewable history changes depending on your plan. [Please see the pricing page](https://pipedream.com/pricing) for more details.
