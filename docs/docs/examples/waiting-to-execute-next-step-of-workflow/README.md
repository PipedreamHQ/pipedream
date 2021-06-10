# Example: Delay a workflow before the next step runs

At a certain point in a workflow, you may want to delay a step from running for some period of time. For example, if you've built a workflow to process new user sign ups on your site, you may want to wait one day to send the user an email asking them for feedback.

Pipedream doesn't yet provide a built-in step to pause / delay a specific workflow step, but [we're tracking that here](https://github.com/PipedreamHQ/pipedream/issues/187). **This guide shows you a workaround for implementing this delay behavior**. 

[[toc]]

## Step 1 - Create a Task Scheduler event source

[Click here to create a Pipedream Task Scheduler source](https://pipedream.com/sources/new?key=pipedream-new-scheduled-tasks). This [event source](/event-sources) allows you to schedule a message to trigger a workflow at a specific time (for example, "run this workflow one day in the future, with this event data"). _This is how we'll delay our step_.

You'll need to connect your Pipedream API key to run this source. You'll find this in [your settings](https://pipedream.com/settings/account). Next, enter a secret value in the **Secret** field - this ensures only users with this secret can schedule tasks. We'll use this in **Step 3** below.

<div>
<img alt="Create Task Scheduler" width="500px" src="./images/create-task-scheduler.gif">
</div>

**Keep this event source open in a tab / window - you'll reference it later**.

## Step 2 - Review your workflow / delay logic

In our example new user signup workflow, we'll implement the following logic:

1. Workflow is triggered on an HTTP request when a new user signs up
2. Wait one day
3. Send the user a welcome email

To delay the email by one day, we'll need to separate our logic into _two_ workflows:

1. [Workflow #1](https://pipedream.com/@dylburger/delay-example-workflow-1-receive-http-request-with-user-email-schedule-task-one-day-in-future-p_vQCgj35/edit) receives the HTTP request when the new user signs up. Then, **it schedules a new task in our Task Scheduler event source one day in the future**.
2. [Workflow #2](https://pipedream.com/@dylburger/delay-example-workflow-2-send-email-after-delay-p_RRCzdLR/edit) will be triggered on scheduled tasks emitted by our Task Scheduler. In this example, our Task Scheduler receives the scheduled task from workflow #1, **waits one day**, and triggers workflow #2, which sends the user a welcome email.

Let's see how to implement this.

## Step 3 - Add the delay step to Workflow #1

Identify the step(s) in your workflow you'd like to delay. In our example, we want to delay the welcome email. **Above that step, click the `+` button to add a step to your workflow, select the `Search All Actions` label, and find the `Pipedream Task Scheduler - Schedule Task` step**:

<div>
<img alt="Find Task Scheduler step" width="500px" src="./images/find-task-scheduler-step.gif">
</div>

Visit the Task Scheduler source you created in **Step 1** and copy its **Endpoint**:

<div>
<img alt="Task Scheduler endpoint" width="500px" src="./images/endpoint.png">
</div>

Then, fill in the params of the task scheduler step:

- To schedule a message one day in the future, enter `86400` in the **Num Seconds** field. To schedule two minutes in the future, enter `120`, etc.
- Add the **Endpoint** from your task scheduler as the **Task Scheduler URL** of your action.
- The **Message** is the data you'd like to send to Workflow #2. In this example, we add <code v-pre>{{event.body}}</code> - the HTTP payload that triggered our original workflow - so we have access to the same data in Workflow #2.
- If you configured a **Secret** when creating your Task Scheduler, click on the optional `secret` label at the bottom of the step and add it.

<div>
<img alt="Configured task scheduler step" src="./images/configured-task-scheduler-step.png">
</div>

[See this workflow for an example](https://pipedream.com/@dylburger/delay-example-workflow-1-receive-http-request-with-user-email-schedule-task-one-day-in-future-p_vQCgj35/edit).

## Step 4 - Move the steps you'd like to delay to Workflow #2

Now that you've implemented the delay step in Workflow #1, **you'll need to remove any steps below that delay step from your Workflow #1. Then, you'll move these steps to a new workflow triggered by your Task Scheduler event source**.

First, [create a new workflow](https://pipedream.com/new). In the trigger step, click the label to **Use one of your existing sources**, and select your Task Scheduler source:

<div>
<img alt="Select Task Scheduler source" src="./images/select-task-scheduler-as-trigger.gif">
</div>

Then, add the step(s) you wanted to delay from your original workflow. In our example, we wanted to send the user a welcome email after one day, so we moved the email step from Workflow #1 to Workflow #2.

When Workflow #1 is triggered, it sends the **Message** you included to the Task Scheduler. **Num Seconds** in the future (in our example, one day), the Task Scheduler triggers Workflow #2, and includes the **Message** in its event data, accessible in the variable `event.message`:

<div>
<img alt="Task Scheduler event data" src="./images/task-scheduler-event.png">
</div>

For example, if your original HTTP payload contained an `email` property and you passed <code v-pre>{{event.body}}</code> to the Task Scheduler, you can reference that in Workflow #2 using <code v-pre>{{event.message.email}}</code>:

<div>
<img alt="event.message.email reference" src="./images/task-scheduler-event.png">
</div>

Finally, toggle your trigger step **On**:

<div>
<img alt="Toggle trigger step on" src="./images/toggle-trigger-step-on.gif">
</div>

[See this workflow for an example](https://pipedream.com/@dylburger/delay-example-workflow-2-send-email-after-delay-p_RRCzdLR/edit).

<Footer />
