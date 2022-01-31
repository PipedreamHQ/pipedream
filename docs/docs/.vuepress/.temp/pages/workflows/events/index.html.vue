<template><h1 id="events" tabindex="-1"><a class="header-anchor" href="#events" aria-hidden="true">#</a> Events</h1>
<p>Events trigger workflow executions. The event that triggers your workflow depends on the trigger you select for your workflow:</p>
<ul>
<li><a href="/workflows/steps/triggers/#http" target="_blank" rel="noopener noreferrer">HTTP triggers<ExternalLinkIcon/></a> invoke your workflow on HTTP requests.</li>
<li><a href="/workflows/steps/triggers/#schedule" target="_blank" rel="noopener noreferrer">Cron triggers<ExternalLinkIcon/></a> invoke your workflow on a time schedule (e.g., on an interval).</li>
<li><a href="/workflows/steps/triggers/#email" target="_blank" rel="noopener noreferrer">Email triggers<ExternalLinkIcon/></a> invoke your workflow on inbound emails.</li>
<li><a href="/workflows/steps/triggers/#app-based-triggers" target="_blank" rel="noopener noreferrer">Event sources<ExternalLinkIcon/></a> invoke your workflow on events from apps like Twitter, Google Calendar, and more.</li>
</ul>
<hr>
<nav class="table-of-contents"><ul><li><RouterLink to="#selecting-a-test-event">Selecting a test event</RouterLink></li><li><RouterLink to="#examining-event-data">Examining event data</RouterLink></li><li><RouterLink to="#copying-references-to-event-data">Copying references to event data</RouterLink></li><li><RouterLink to="#copying-the-values-of-event-data">Copying the values of event data</RouterLink></li><li><RouterLink to="#event-format">Event format</RouterLink><ul><li><RouterLink to="#http">HTTP</RouterLink></li><li><RouterLink to="#cron-scheduler">Cron Scheduler</RouterLink></li><li><RouterLink to="#email">Email</RouterLink></li></ul></li><li><RouterLink to="#steps-trigger-context">steps.trigger.context</RouterLink></li><li><RouterLink to="#limits-on-event-history">Limits on event history</RouterLink></li></ul></nav>
<h2 id="selecting-a-test-event" tabindex="-1"><a class="header-anchor" href="#selecting-a-test-event" aria-hidden="true">#</a> Selecting a test event</h2>
<p>When you test any step in your workflow, Pipedream passes the test event you select in the trigger step:</p>
<div>
<img width="600px" alt="Test event" src="@source/workflows/events/images/test-event.png">
</div>
<p>You can select any event you've previously sent to your trigger as your test event, or send a new one.</p>
<h2 id="examining-event-data" tabindex="-1"><a class="header-anchor" href="#examining-event-data" aria-hidden="true">#</a> Examining event data</h2>
<p>When you select an event, you'll see <a href="#event-format">the incoming event data</a> and the <a href="#steps-trigger-context">event context</a> for that event:</p>
<div>
<img width="400px" alt="Event and context" src="@source/workflows/events/images/event-and-context.png">
</div>
<p>Pipedream parses your incoming data and exposes it in the variable <a href="#event-format"><code>steps.trigger.event</code></a>, which you can access in any <a href="/workflows/steps/" target="_blank" rel="noopener noreferrer">workflow step<ExternalLinkIcon/></a>.</p>
<h2 id="copying-references-to-event-data" tabindex="-1"><a class="header-anchor" href="#copying-references-to-event-data" aria-hidden="true">#</a> Copying references to event data</h2>
<p>When you're <a href="#examining-event-data">examining event data</a>, you'll commonly want to copy the name of the variable that points to the data you need to reference in another step.</p>
<p>Hover over the property whose data you want to reference, and click the <strong>Copy Path</strong> button to its right:</p>
<div>
<img width="600px" alt="Copy path GIF" src="@source/workflows/events/images/copy-path.gif">
</div>
<h2 id="copying-the-values-of-event-data" tabindex="-1"><a class="header-anchor" href="#copying-the-values-of-event-data" aria-hidden="true">#</a> Copying the values of event data</h2>
<p>You can also copy the value of specific properties of your event data. Hover over the property whose data you want to copy, and click the <strong>Copy Value</strong> button to its right:</p>
<div>
<img width="500px" alt="Copy value GIF" src="@source/workflows/events/images/copy-value.gif">
</div>
<h2 id="event-format" tabindex="-1"><a class="header-anchor" href="#event-format" aria-hidden="true">#</a> Event format</h2>
<p>When you send an event to your workflow, Pipedream takes the trigger data — for example, the HTTP payload, headers, etc. — and adds our own Pipedream metadata to it.</p>
<p><strong>This data is exposed in the <code>steps.trigger.event</code> variable. You can reference this variable in any step of your workflow</strong>.</p>
<p>You can reference your event data in any <a href="/code/" target="_blank" rel="noopener noreferrer">code<ExternalLinkIcon/></a> or <a href="/components/actions/" target="_blank" rel="noopener noreferrer">action<ExternalLinkIcon/></a> step. See those docs or the general <a href="/workflows/steps/" target="_blank" rel="noopener noreferrer">docs on passing data between steps<ExternalLinkIcon/></a> for more information.</p>
<p>The specific shape of <code>steps.trigger.event</code> depends on the trigger type:</p>
<h3 id="http" tabindex="-1"><a class="header-anchor" href="#http" aria-hidden="true">#</a> HTTP</h3>
<table>
<thead>
<tr>
<th>Property</th>
<th style="text-align:center">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>body</code></td>
<td style="text-align:center">A string or object representation of the HTTP payload</td>
</tr>
<tr>
<td><code>client_ip</code></td>
<td style="text-align:center">IP address of the client that made the request</td>
</tr>
<tr>
<td><code>headers</code></td>
<td style="text-align:center">HTTP headers, represented as an object</td>
</tr>
<tr>
<td><code>method</code></td>
<td style="text-align:center">HTTP method</td>
</tr>
<tr>
<td><code>path</code></td>
<td style="text-align:center">HTTP request path</td>
</tr>
<tr>
<td><code>query</code></td>
<td style="text-align:center">Query string</td>
</tr>
<tr>
<td><code>url</code></td>
<td style="text-align:center">Request host + path</td>
</tr>
</tbody>
</table>
<h3 id="cron-scheduler" tabindex="-1"><a class="header-anchor" href="#cron-scheduler" aria-hidden="true">#</a> Cron Scheduler</h3>
<table>
<thead>
<tr>
<th>Property</th>
<th style="text-align:center">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>interval_seconds</code></td>
<td style="text-align:center">The number of seconds between scheduled invocations</td>
</tr>
<tr>
<td><code>cron</code></td>
<td style="text-align:center">When you've configured a custom cron schedule, the cron string</td>
</tr>
<tr>
<td><code>timestamp</code></td>
<td style="text-align:center">The epoch timestamp when the workflow ran</td>
</tr>
<tr>
<td><code>timezone_configured</code></td>
<td style="text-align:center">An object with formatted datetime data for the given invocation, tied to the schedule's timezone</td>
</tr>
<tr>
<td><code>timezone_utc</code></td>
<td style="text-align:center">An object with formatted datetime data for the given invocation, tied to the UTC timezone</td>
</tr>
</tbody>
</table>
<h3 id="email" tabindex="-1"><a class="header-anchor" href="#email" aria-hidden="true">#</a> Email</h3>
<p>We use Amazon SES to receive emails for the email trigger. You can find the shape of the event in the <a href="https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-notifications-contents.html" target="_blank" rel="noopener noreferrer">SES docs<ExternalLinkIcon/></a>.</p>
<h2 id="steps-trigger-context" tabindex="-1"><a class="header-anchor" href="#steps-trigger-context" aria-hidden="true">#</a> <code>steps.trigger.context</code></h2>
<p><code>steps.trigger.event</code> contain your event's <strong>data</strong>. <code>steps.trigger.context</code> contains <em>metadata</em> about the workflow and the invocation tied to this event.</p>
<p>You can use the data in <code>steps.trigger.context</code> to uniquely identify the Pipedream event ID, the timestamp at which the event invoked the workflow, and more:</p>
<table>
<thead>
<tr>
<th>Property</th>
<th style="text-align:center">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>deployment_id</code></td>
<td style="text-align:center">A globally-unique string representing the current version of the workflow</td>
</tr>
<tr>
<td><code>id</code></td>
<td style="text-align:center">A unique, Pipedream-provided identifier for the event that triggered this workflow</td>
</tr>
<tr>
<td><code>owner_id</code></td>
<td style="text-align:center">The Pipedream-assigned user ID for the owner of the workflow</td>
</tr>
<tr>
<td><code>platform_version</code></td>
<td style="text-align:center">The version of the Pipedream execution environment this event ran on</td>
</tr>
<tr>
<td><code>ts</code></td>
<td style="text-align:center">The ISO 8601 timestamp at which the event invoked the workflow</td>
</tr>
<tr>
<td><code>workflow_id</code></td>
<td style="text-align:center">The workflow ID</td>
</tr>
<tr>
<td><code>workflow_name</code></td>
<td style="text-align:center">The workflow name</td>
</tr>
</tbody>
</table>
<p>You may notice other properties in <code>context</code>. These are used internally by Pipedream, and are subject to change.</p>
<h2 id="limits-on-event-history" tabindex="-1"><a class="header-anchor" href="#limits-on-event-history" aria-hidden="true">#</a> Limits on event history</h2>
<p>Only the last 100 events are retained for each workflow. After 100 events have been processed, Pipedream will delete the oldest event data as new events arrive, keeping only the last 100 events.</p>
<Footer />
</template>
