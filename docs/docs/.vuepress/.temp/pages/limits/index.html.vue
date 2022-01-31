<template><h1 id="limits" tabindex="-1"><a class="header-anchor" href="#limits" aria-hidden="true">#</a> Limits</h1>
<p>Pipedream imposes limits on source and workflow execution, the events you send to Pipedream, and other properties. You'll receive an <a href="/errors/" target="_blank" rel="noopener noreferrer">error<ExternalLinkIcon/></a> if you encounter these limits.</p>
<p>Some of these limits apply only on the free tier. For example, Pipedream limits the daily number of invocations and execution time you can use on the free tier. <strong>On paid tiers, you can run an unlimited number of invocations, for any amount of execution time</strong>.</p>
<p>Other limits apply to both the free and paid tiers, but many can be raised upon request. Please see the details on each limit below.</p>
<p><strong>These limits are subject to change at any time</strong>.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#number-of-workflows">Number of Workflows</RouterLink></li><li><RouterLink to="#number-of-event-sources">Number of Event Sources</RouterLink></li><li><RouterLink to="#daily-invocations">Daily Invocations</RouterLink><ul><li><RouterLink to="#invocations-quota-notifications">Invocations Quota Notifications</RouterLink></li></ul></li><li><RouterLink to="#compute-time-per-day">Compute time per day</RouterLink><ul><li><RouterLink to="#compute-time-quota-notifications">Compute Time Quota Notifications</RouterLink></li></ul></li><li><RouterLink to="#http-triggers">HTTP Triggers</RouterLink><ul><li><RouterLink to="#http-request-body-size">HTTP Request Body Size</RouterLink></li><li><RouterLink to="#qps-queries-per-second">QPS (Queries Per Second)</RouterLink></li></ul></li><li><RouterLink to="#email-triggers">Email Triggers</RouterLink></li><li><RouterLink to="#memory">Memory</RouterLink></li><li><RouterLink to="#disk">Disk</RouterLink></li><li><RouterLink to="#workflows">Workflows</RouterLink><ul><li><RouterLink to="#time-per-execution">Time per execution</RouterLink></li><li><RouterLink to="#event-execution-history">Event / Execution History</RouterLink></li><li><RouterLink to="#logs-step-exports-and-other-observability">Logs, Step Exports, and other observability</RouterLink></li></ul></li><li><RouterLink to="#sql-service">SQL Service</RouterLink></li><li><RouterLink to="#acceptable-use">Acceptable Use</RouterLink></li></ul></nav>
<h2 id="number-of-workflows" tabindex="-1"><a class="header-anchor" href="#number-of-workflows" aria-hidden="true">#</a> Number of Workflows</h2>
<p><strong>You can run an unlimited number of workflows</strong>, as long as each operates under the limits below.</p>
<h2 id="number-of-event-sources" tabindex="-1"><a class="header-anchor" href="#number-of-event-sources" aria-hidden="true">#</a> Number of Event Sources</h2>
<p><strong>You can run an unlimited number of event sources</strong>, as long as each operates under the limits below.</p>
<h2 id="daily-invocations" tabindex="-1"><a class="header-anchor" href="#daily-invocations" aria-hidden="true">#</a> Daily Invocations</h2>
<table>
<thead>
<tr>
<th style="text-align:center">Tier</th>
<th style="text-align:center">Daily Invocations Quota</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">Developer</td>
<td style="text-align:center">{{$site.themeConfig.DAILY_INVOCATIONS_LIMIT}}</td>
</tr>
<tr>
<td style="text-align:center">Professional Plan</td>
<td style="text-align:center">No limit (pay per invocation above the <a href="/pricing/#base-invocations-quota" target="_blank" rel="noopener noreferrer">base invocations quota<ExternalLinkIcon/></a>)</td>
</tr>
<tr>
<td style="text-align:center">Orgs (free)</td>
<td style="text-align:center">{{$site.themeConfig.FREE_ORG_DAILY_INVOCATIONS_LIMIT}}</td>
</tr>
<tr>
<td style="text-align:center">Orgs (Team Plan)</td>
<td style="text-align:center">No limit (pay per invocation above the <a href="/pricing/#base-invocations-quota" target="_blank" rel="noopener noreferrer">base invocations quota<ExternalLinkIcon/></a>)</td>
</tr>
</tbody>
</table>
<p>You can view your invocations usage in your <a href="https://pipedream.com/settings/billing" target="_blank" rel="noopener noreferrer">Billing and Usage Settings<ExternalLinkIcon/></a>. Here you'll find your usage for the last 30 days, broken out by day, and by source / workflow.</p>
<p>Your quota is reset, daily, at 00:00 (midnight) UTC.</p>
<h3 id="invocations-quota-notifications" tabindex="-1"><a class="header-anchor" href="#invocations-quota-notifications" aria-hidden="true">#</a> Invocations Quota Notifications</h3>
<table>
<thead>
<tr>
<th style="text-align:center">Tier</th>
<th style="text-align:center">Notifications</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">Free tiers</td>
<td style="text-align:center">You'll receive an email at 80% and 100% of your daily usage.</td>
</tr>
<tr>
<td style="text-align:center">Paid tiers</td>
<td style="text-align:center">You'll receive an email at 80% and 100% of your <a href="/pricing/#base-invocations-quota" target="_blank" rel="noopener noreferrer">base invocations quota<ExternalLinkIcon/></a> for your <a href="/pricing/#billing-period" target="_blank" rel="noopener noreferrer">billing period<ExternalLinkIcon/></a>.</td>
</tr>
</tbody>
</table>
<h2 id="compute-time-per-day" tabindex="-1"><a class="header-anchor" href="#compute-time-per-day" aria-hidden="true">#</a> Compute time per day</h2>
<p>Users on the <a href="/pricing/#developer-tier" target="_blank" rel="noopener noreferrer">Developer (free) tier<ExternalLinkIcon/></a>, and free Organizations, have a default compute time quota of <strong>30 minutes (1,800,000 milliseconds) per day</strong> across all workflows and event sources. <strong>You are <em>not</em> limited on compute time on paid plans like the <a href="/pricing/#professional-tier" target="_blank" rel="noopener noreferrer">Professional tier<ExternalLinkIcon/></a></strong>.</p>
<p>You can view your current usage in your <a href="https://pipedream.com/settings/billing" target="_blank" rel="noopener noreferrer">Billing and Usage Settings<ExternalLinkIcon/></a>.</p>
<p>Your compute time quota is reset, daily, at 00:00 (midnight) UTC.</p>
<h3 id="compute-time-quota-notifications" tabindex="-1"><a class="header-anchor" href="#compute-time-quota-notifications" aria-hidden="true">#</a> Compute Time Quota Notifications</h3>
<table>
<thead>
<tr>
<th style="text-align:center">Tier</th>
<th style="text-align:center">Notifications</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">Free tiers</td>
<td style="text-align:center">You'll receive an email at 80% and 100% of your daily usage.</td>
</tr>
<tr>
<td style="text-align:center">Paid tiers</td>
<td style="text-align:center"><strong>Not applicable</strong> - Paid tiers have unlimited compute time, so receive no notifications</td>
</tr>
</tbody>
</table>
<h2 id="http-triggers" tabindex="-1"><a class="header-anchor" href="#http-triggers" aria-hidden="true">#</a> HTTP Triggers</h2>
<p>The following limits apply to <a href="/workflows/steps/triggers/#http" target="_blank" rel="noopener noreferrer">HTTP triggers<ExternalLinkIcon/></a>.</p>
<h3 id="http-request-body-size" tabindex="-1"><a class="header-anchor" href="#http-request-body-size" aria-hidden="true">#</a> HTTP Request Body Size</h3>
<p>By default, the body of HTTP requests sent to a source or workflow is limited to <code>{{$site.themeConfig.PAYLOAD_SIZE_LIMIT}}</code>.</p>
<p>Your endpoint will issue a <code>413 Payload Too Large</code> status code when the body of your request exceeds <code>{{$site.themeConfig.PAYLOAD_SIZE_LIMIT}}</code>.</p>
<p><strong>Pipedream supports two different ways to bypass this limit</strong>. Both of these interfaces support uploading data up to <code>5TB</code>, though you may encounter other platform limits.</p>
<ul>
<li>You can send large HTTP payloads by passing the <code>pipedream_upload_body=1</code> query string or an <code>x-pd-upload-body: 1</code> HTTP header in your HTTP request. <a href="/workflows/steps/triggers/#sending-large-payloads" target="_blank" rel="noopener noreferrer">Read more here<ExternalLinkIcon/></a>.</li>
<li>You can upload multiple large files, like images and videos, using the <a href="/workflows/steps/triggers/#large-file-support" target="_blank" rel="noopener noreferrer">large file upload interface<ExternalLinkIcon/></a>.</li>
</ul>
<h3 id="qps-queries-per-second" tabindex="-1"><a class="header-anchor" href="#qps-queries-per-second" aria-hidden="true">#</a> QPS (Queries Per Second)</h3>
<p>Generally the rate of HTTP requests sent to an endpoint is quantified by QPS, or <em>queries per second</em>. A query refers to an HTTP request.</p>
<p><strong>You can send an average of 10 requests per second to your HTTP trigger</strong>. Any requests that exceed that threshold may trigger rate limiting. If you're rate limited, we'll return a <code>429 Too Many Requests</code> response. If you control the application sending requests, you should retry the request with <a href="https://cloud.google.com/storage/docs/exponential-backoff" target="_blank" rel="noopener noreferrer">exponential backoff<ExternalLinkIcon/></a> or a similar technique.</p>
<p>We'll also accept short bursts of traffic, as long as you remain close to an average of 10 QPS (e.g. sending a batch of 50 requests every 30 seconds should not trigger rate limiting).</p>
<p><strong>This limit can be raised for Professional, Teams, and Enterprise customers</strong>. To request an increase, <a href="https://pipedream.com/support/" target="_blank" rel="noopener noreferrer">reach out to our Support team<ExternalLinkIcon/></a> with the HTTP endpoint whose QPS you'd like to increase, with the new, desired limit.</p>
<h2 id="email-triggers" tabindex="-1"><a class="header-anchor" href="#email-triggers" aria-hidden="true">#</a> Email Triggers</h2>
<p>Currently, most of the <a href="#http-triggers">limits that apply to HTTP triggers</a> also apply to <a href="/workflows/steps/triggers/#email" target="_blank" rel="noopener noreferrer">email triggers<ExternalLinkIcon/></a>.</p>
<p>The only limit that differs between email and HTTP triggers is the payload size: the body of HTTP requests is limited to <code>{{$site.themeConfig.PAYLOAD_SIZE_LIMIT}}</code>, where the total size of an email sent to a workflow - its body, headers, and attachments - is limited to <code>{{$site.themeConfig.EMAIL_PAYLOAD_SIZE_LIMIT}}</code> on the default interface.</p>
<h2 id="memory" tabindex="-1"><a class="header-anchor" href="#memory" aria-hidden="true">#</a> Memory</h2>
<p>By default, workflows run with <code>{{$site.themeConfig.MEMORY_LIMIT}}</code> of memory. You can modify a workflow's memory <a href="/workflows/settings/#memory" target="_blank" rel="noopener noreferrer">in your workflow's Settings<ExternalLinkIcon/></a>, up to <code>{{$site.themeConfig.MEMORY_ABSOLUTE_LIMIT}}</code>.</p>
<p>Increasing your workflow's memory gives you a proportional increase in CPU. If your workflow is limited by memory or compute, increasing your workflow's memory can reduce its overall runtime and make it more performant.</p>
<p><strong>Pipedream charges invocations proportional to your memory configuration</strong>. <a href="/pricing/#how-does-workflow-memory-affect-billable-invocations" target="_blank" rel="noopener noreferrer">Read more here<ExternalLinkIcon/></a>.</p>
<h2 id="disk" tabindex="-1"><a class="header-anchor" href="#disk" aria-hidden="true">#</a> Disk</h2>
<p>Your code, or a third party library, may need access to disk during the execution of your workflow or event source. <strong>You have access to <code>{{$site.themeConfig.TMP_SIZE_LIMIT}}</code> of disk in the <code>/tmp</code> directory</strong>.</p>
<p>This limit cannot be raised.</p>
<h2 id="workflows" tabindex="-1"><a class="header-anchor" href="#workflows" aria-hidden="true">#</a> Workflows</h2>
<h3 id="time-per-execution" tabindex="-1"><a class="header-anchor" href="#time-per-execution" aria-hidden="true">#</a> Time per execution</h3>
<p>Every event sent to a workflow triggers a new execution of that workflow. Workflows have a default execution limit that varies with the trigger type:</p>
<ul>
<li>HTTP and Email-triggered workflows default to <strong>30 seconds</strong> per execution.</li>
<li>Cron-triggered workflows default to <strong>60 seconds</strong> per execution.</li>
</ul>
<p>If your code exceeds your workflow-level limit, we'll throw a <strong>Timeout</strong> error and stop your workflow. Any partial logs and observability associated with code cells that ran successfully before the timeout will be attached to the event in the UI, so you can examine the state of your workflow and troubleshoot where it may have failed.</p>
<p>You can increase the timeout limit, up to a max value set by your plan:</p>
<table>
<thead>
<tr>
<th style="text-align:center">Tier</th>
<th style="text-align:center">Maximum time per execution</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">Free tiers</td>
<td style="text-align:center">300 seconds (5 min)</td>
</tr>
<tr>
<td style="text-align:center">Paid tiers</td>
<td style="text-align:center">750 seconds (12.5 min)</td>
</tr>
</tbody>
</table>
<p>Events that trigger a <strong>Timeout</strong> error will appear in red in the <a href="/workflows/events/inspect/" target="_blank" rel="noopener noreferrer">Inspector<ExternalLinkIcon/></a>. You'll see the timeout error, also in red, in the cell at which the code timed out.</p>
<h3 id="event-execution-history" tabindex="-1"><a class="header-anchor" href="#event-execution-history" aria-hidden="true">#</a> Event / Execution History</h3>
<p>The <a href="/workflows/events/inspect/#the-inspector" target="_blank" rel="noopener noreferrer">Inspector<ExternalLinkIcon/></a> shows the execution history for a given workflow. There are two limits that impact this history:</p>
<ul>
<li>You can view the last {{$site.themeConfig.INSPECTOR_EVENT_LIMIT}} events sent to your workflow. Sending events over this limit removes the oldest event in the history from Pipedream's system.</li>
<li>The execution details for a specific run also expires after {{$site.themeConfig.INSPECTOR_EVENT_EXPIRY_DAYS}} days. So if a workflow was triggered once a day, you’d only see a rolling history of {{$site.themeConfig.INSPECTOR_EVENT_EXPIRY_DAYS}} executions.</li>
</ul>
<p>If you'd like to store execution or error history for a longer period, consider sending execution data to a table in the <a href="/destinations/sql/" target="_blank" rel="noopener noreferrer">SQL Service<ExternalLinkIcon/></a>, an <a href="/destinations/s3/" target="_blank" rel="noopener noreferrer">Amazon S3 bucket<ExternalLinkIcon/></a>, or another external data store.</p>
<h3 id="logs-step-exports-and-other-observability" tabindex="-1"><a class="header-anchor" href="#logs-step-exports-and-other-observability" aria-hidden="true">#</a> Logs, Step Exports, and other observability</h3>
<p>The total size of <code>console.log()</code> statements, <a href="/workflows/steps/#step-exports" target="_blank" rel="noopener noreferrer">step exports<ExternalLinkIcon/></a>, and the original event data sent to the workflow cannot exceed a combined size of <code>{{$site.themeConfig.FUNCTION_PAYLOAD_LIMIT}}</code>. If you produce logs or step exports larger than this - for example, passing around large API responses, CSVs, or other data - you may encounter a <strong>Function Payload Limit Exceeded</strong> in your workflow.</p>
<p>This limit cannot be raised.</p>
<h2 id="sql-service" tabindex="-1"><a class="header-anchor" href="#sql-service" aria-hidden="true">#</a> SQL Service</h2>
<p>You can create any number of tables in the SQL service, and store any number of records. However, there are a few limits you should be aware of</p>
<ul>
<li>Events sent to a SQL Destination are stored for 30 days. After 30 days, the record is completely deleted. Records newer than 30 days (for example, data sent a day ago) will be retained, until that record is 30 days old, at which point it will be deleted. <a href="/destinations/sql/#data-retention" target="_blank" rel="noopener noreferrer">Read more here<ExternalLinkIcon/></a>.</li>
<li>Queries are limited to a runtime of 60 seconds.</li>
<li>You cannot issue a query that returns over <code>1GB</code> of data.</li>
</ul>
<p><a href="/destinations/sql/" target="_blank" rel="noopener noreferrer">Read more about the SQL Service here<ExternalLinkIcon/></a>.</p>
<h2 id="acceptable-use" tabindex="-1"><a class="header-anchor" href="#acceptable-use" aria-hidden="true">#</a> Acceptable Use</h2>
<p>We ask that you abide by our <a href="https://pipedream.com/terms/#b-acceptable-use" target="_blank" rel="noopener noreferrer">Acceptable Use<ExternalLinkIcon/></a> policy. In short this means: don't use Pipedream to break the law; don't abuse the platform; and don't use the platform to harm others.</p>
<Footer />
</template>
