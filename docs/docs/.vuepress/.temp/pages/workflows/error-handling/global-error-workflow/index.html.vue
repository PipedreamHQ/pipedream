<template><h1 id="global-error-workflow" tabindex="-1"><a class="header-anchor" href="#global-error-workflow" aria-hidden="true">#</a> Global Error Workflow</h1>
<p>The global error workflow allows you to run code in response to errors from any workflow. We believe code gives you full control over how you handle errors, and where you send them.</p>
<p>When you sign up for Pipedream, this workflow is automatically created for you. You can access it from your workflow dashboard, by clicking on the <strong>Error Workflow</strong> label:</p>
<div>
<img width="400" alt="global error workflow" src="@source/workflows/error-handling/global-error-workflow/images/global-error-workflow.png">
</div>
<p>By default, any time an unhandled error is raised in a workflow, it gets sent to the global error workflow.</p>
<p>The default error workflow emails you anytime there's an error in a workflow, once a day per error type, per workflow. This ensures you don't get flooded with emails on high-volume workflows.</p>
<p>This email contains information about the error, with a link to the workflow and event where the error happened.</p>
<h2 id="modifying-the-global-error-workflow" tabindex="-1"><a class="header-anchor" href="#modifying-the-global-error-workflow" aria-hidden="true">#</a> Modifying the global error workflow</h2>
<p>The global error workflow is yours, unique to your account. Since it's just another workflow, you can modify it however you'd like.</p>
<p>Here are a few improvements we've seen people make:</p>
<ul>
<li>Send formatted error messages to Slack, instead of email.</li>
<li>Send errors to Pagerduty.</li>
<li>Log errors in a table in the <a href="/destinations/sql/" target="_blank" rel="noopener noreferrer">SQL service<ExternalLinkIcon/></a> so you can run SQL on them, or in Google Sheets for easier analysis.</li>
</ul>
<h2 id="error-format" tabindex="-1"><a class="header-anchor" href="#error-format" aria-hidden="true">#</a> Error format</h2>
<p>Events sent to the global error workflow have the following properties:</p>
<ul>
<li><code>error</code> : contains information about the error, for example the <code>code</code> (its type), the <code>msg</code>, and the <code>stack</code>, which contains its stack trace.</li>
<li><code>original_event</code> : contains the original event (see the <a href="/workflows/events/#event-format" target="_blank" rel="noopener noreferrer">event format<ExternalLinkIcon/></a> docs for an explanation of the event properties).</li>
<li><code>original_context</code> : contains the original workflow <a href="/workflows/events/#steps-trigger-context" target="_blank" rel="noopener noreferrer">context object<ExternalLinkIcon/></a>, which includes the workflow's name, ID, and more.</li>
</ul>
<p>For example, an error event might look something like this:</p>
<div>
<img width="800" alt="error event" src="@source/workflows/error-handling/global-error-workflow/images/error-event.png">
</div>
<h2 id="modifying-how-errors-are-raised-from-workflow" tabindex="-1"><a class="header-anchor" href="#modifying-how-errors-are-raised-from-workflow" aria-hidden="true">#</a> Modifying how errors are raised from workflow</h2>
<p>By default, errors raised in any workflow are sent to the global error workflow.</p>
<p>If you'd prefer not to send errors from a particular workflow, visit the workflow and click on the <strong>Settings</strong> label on the left. Then toggle the <strong>Errors</strong> setting <em>off</em>:</p>
<div>
<img width="500" alt="workflow error settings" src="@source/workflows/error-handling/global-error-workflow/images/workflow-error-settings.png">
</div>
<h2 id="what-happens-if-an-error-is-raised-in-the-error-workflow-itself" tabindex="-1"><a class="header-anchor" href="#what-happens-if-an-error-is-raised-in-the-error-workflow-itself" aria-hidden="true">#</a> What happens if an error is raised in the error workflow itself?</h2>
<p><strong>Unhandled errors raised in the global error workflow are not sent to the global error workflow</strong>, since that could cause an infinite loop that would lock up the workflow.</p>
<p>Errors in the error workflow will still be displayed in the Inspector next to the workflow, so you can troubleshoot issues.</p>
<p>If you modify the workflow, take care to test those changes thoroughly so that you ensure you're still handling errors. <a href="/workflows/events/replay/" target="_blank" rel="noopener noreferrer">Replaying previous events<ExternalLinkIcon/></a> through the workflow can help you test it on real data.</p>
</template>
