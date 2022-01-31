<template><h1 id="example-delay-a-workflow-before-the-next-step-runs" tabindex="-1"><a class="header-anchor" href="#example-delay-a-workflow-before-the-next-step-runs" aria-hidden="true">#</a> Example: Delay a workflow before the next step runs</h1>
<p>At a certain point in a workflow, you may want to delay a step from running for some period of time. For example, if you've built a workflow to process new user sign ups on your site, you may want to wait one day to send the user an email asking them for feedback.</p>
<p>Pipedream doesn't yet provide a built-in step to pause / delay a specific workflow step, but <a href="https://github.com/PipedreamHQ/pipedream/issues/187" target="_blank" rel="noopener noreferrer">we're tracking that here<ExternalLinkIcon/></a>. <strong>This guide shows you a workaround for implementing this delay behavior</strong>.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#step-1-create-a-task-scheduler-event-source">Step 1 - Create a Task Scheduler event source</RouterLink></li><li><RouterLink to="#step-2-review-your-workflow-delay-logic">Step 2 - Review your workflow / delay logic</RouterLink></li><li><RouterLink to="#step-3-add-the-delay-step-to-workflow-1">Step 3 - Add the delay step to Workflow #1</RouterLink></li><li><RouterLink to="#step-4-move-the-steps-you-d-like-to-delay-to-workflow-2">Step 4 - Move the steps you&#39;d like to delay to Workflow #2</RouterLink></li></ul></nav>
<h2 id="step-1-create-a-task-scheduler-event-source" tabindex="-1"><a class="header-anchor" href="#step-1-create-a-task-scheduler-event-source" aria-hidden="true">#</a> Step 1 - Create a Task Scheduler event source</h2>
<p><a href="https://pipedream.com/sources/new?key=pipedream-new-scheduled-tasks" target="_blank" rel="noopener noreferrer">Click here to create a Pipedream Task Scheduler source<ExternalLinkIcon/></a>. This <a href="/event-sources" target="_blank" rel="noopener noreferrer">event source<ExternalLinkIcon/></a> allows you to schedule a message to trigger a workflow at a specific time (for example, &quot;run this workflow one day in the future, with this event data&quot;). <em>This is how we'll delay our step</em>.</p>
<p>You'll need to connect your Pipedream API key to run this source. You'll find this in <a href="https://pipedream.com/settings/account" target="_blank" rel="noopener noreferrer">your settings<ExternalLinkIcon/></a>. Next, enter a secret value in the <strong>Secret</strong> field - this ensures only users with this secret can schedule tasks. We'll use this in <strong>Step 3</strong> below.</p>
<div>
<img alt="Create Task Scheduler" width="500px" src="@source/examples/waiting-to-execute-next-step-of-workflow/images/create-task-scheduler.gif">
</div>
<p><strong>Keep this event source open in a tab / window - you'll reference it later</strong>.</p>
<h2 id="step-2-review-your-workflow-delay-logic" tabindex="-1"><a class="header-anchor" href="#step-2-review-your-workflow-delay-logic" aria-hidden="true">#</a> Step 2 - Review your workflow / delay logic</h2>
<p>In our example new user signup workflow, we'll implement the following logic:</p>
<ol>
<li>Workflow is triggered on an HTTP request when a new user signs up</li>
<li>Wait one day</li>
<li>Send the user a welcome email</li>
</ol>
<p>To delay the email by one day, we'll need to separate our logic into <em>two</em> workflows:</p>
<ol>
<li><a href="https://pipedream.com/@dylburger/delay-example-workflow-1-receive-http-request-with-user-email-schedule-task-one-day-in-future-p_vQCgj35/edit" target="_blank" rel="noopener noreferrer">Workflow #1<ExternalLinkIcon/></a> receives the HTTP request when the new user signs up. Then, <strong>it schedules a new task in our Task Scheduler event source one day in the future</strong>.</li>
<li><a href="https://pipedream.com/@dylburger/delay-example-workflow-2-send-email-after-delay-p_RRCzdLR/edit" target="_blank" rel="noopener noreferrer">Workflow #2<ExternalLinkIcon/></a> will be triggered on scheduled tasks emitted by our Task Scheduler. In this example, our Task Scheduler receives the scheduled task from workflow #1, <strong>waits one day</strong>, and triggers workflow #2, which sends the user a welcome email.</li>
</ol>
<p>Let's see how to implement this.</p>
<h2 id="step-3-add-the-delay-step-to-workflow-1" tabindex="-1"><a class="header-anchor" href="#step-3-add-the-delay-step-to-workflow-1" aria-hidden="true">#</a> Step 3 - Add the delay step to Workflow #1</h2>
<p>Identify the step(s) in your workflow you'd like to delay. In our example, we want to delay the welcome email. <strong>Above that step, click the <code>+</code> button to add a step to your workflow, select the <code>Search All Actions</code> label, and find the <code>Pipedream Task Scheduler - Schedule Task</code> step</strong>:</p>
<div>
<img alt="Find Task Scheduler step" width="500px" src="@source/examples/waiting-to-execute-next-step-of-workflow/images/find-task-scheduler-step.gif">
</div>
<p>Visit the Task Scheduler source you created in <strong>Step 1</strong> and copy its <strong>Endpoint</strong>:</p>
<div>
<img alt="Task Scheduler endpoint" width="500px" src="@source/examples/waiting-to-execute-next-step-of-workflow/images/endpoint.png">
</div>
<p>Then, fill in the params of the task scheduler step:</p>
<ul>
<li>To schedule a message one day in the future, enter <code>86400</code> in the <strong>Num Seconds</strong> field. To schedule two minutes in the future, enter <code>120</code>, etc.</li>
<li>Add the <strong>Endpoint</strong> from your task scheduler as the <strong>Task Scheduler URL</strong> of your action.</li>
<li>The <strong>Message</strong> is the data you'd like to send to Workflow #2. In this example, we add <code v-pre>{{event.body}}</code> - the HTTP payload that triggered our original workflow - so we have access to the same data in Workflow #2.</li>
<li>If you configured a <strong>Secret</strong> when creating your Task Scheduler, click on the optional <code>secret</code> label at the bottom of the step and add it.</li>
</ul>
<div>
<img alt="Configured task scheduler step" src="@source/examples/waiting-to-execute-next-step-of-workflow/images/configured-task-scheduler-step.png">
</div>
<p><a href="https://pipedream.com/@dylburger/delay-example-workflow-1-receive-http-request-with-user-email-schedule-task-one-day-in-future-p_vQCgj35/edit" target="_blank" rel="noopener noreferrer">See this workflow for an example<ExternalLinkIcon/></a>.</p>
<h2 id="step-4-move-the-steps-you-d-like-to-delay-to-workflow-2" tabindex="-1"><a class="header-anchor" href="#step-4-move-the-steps-you-d-like-to-delay-to-workflow-2" aria-hidden="true">#</a> Step 4 - Move the steps you'd like to delay to Workflow #2</h2>
<p>Now that you've implemented the delay step in Workflow #1, <strong>you'll need to remove any steps below that delay step from your Workflow #1. Then, you'll move these steps to a new workflow triggered by your Task Scheduler event source</strong>.</p>
<p>First, <a href="https://pipedream.com/new" target="_blank" rel="noopener noreferrer">create a new workflow<ExternalLinkIcon/></a>. In the trigger step, click the label to <strong>Use one of your existing sources</strong>, and select your Task Scheduler source:</p>
<div>
<img alt="Select Task Scheduler source" src="@source/examples/waiting-to-execute-next-step-of-workflow/images/select-task-scheduler-as-trigger.gif">
</div>
<p>Then, add the step(s) you wanted to delay from your original workflow. In our example, we wanted to send the user a welcome email after one day, so we moved the email step from Workflow #1 to Workflow #2.</p>
<p>When Workflow #1 is triggered, it sends the <strong>Message</strong> you included to the Task Scheduler. <strong>Num Seconds</strong> in the future (in our example, one day), the Task Scheduler triggers Workflow #2, and includes the <strong>Message</strong> in its event data, accessible in the variable <code>event.message</code>:</p>
<div>
<img alt="Task Scheduler event data" src="@source/examples/waiting-to-execute-next-step-of-workflow/images/task-scheduler-event.png">
</div>
<p>For example, if your original HTTP payload contained an <code>email</code> property and you passed <code v-pre>{{event.body}}</code> to the Task Scheduler, you can reference that in Workflow #2 using <code v-pre>{{event.message.email}}</code>:</p>
<div>
<img alt="event.message.email reference" src="@source/examples/waiting-to-execute-next-step-of-workflow/images/task-scheduler-event.png">
</div>
<p>Finally, toggle your trigger step <strong>On</strong>:</p>
<div>
<img alt="Toggle trigger step on" src="@source/examples/waiting-to-execute-next-step-of-workflow/images/toggle-trigger-step-on.gif">
</div>
<p><a href="https://pipedream.com/@dylburger/delay-example-workflow-2-send-email-after-delay-p_RRCzdLR/edit" target="_blank" rel="noopener noreferrer">See this workflow for an example<ExternalLinkIcon/></a>.</p>
<Footer />
</template>
