<template><h1 id="concurrency-and-throttling" tabindex="-1"><a class="header-anchor" href="#concurrency-and-throttling" aria-hidden="true">#</a> Concurrency and Throttling</h1>
<p>Pipedream makes it easy to manage the concurrency and rate at which events trigger your workflow code using execution controls.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#overview">Overview</RouterLink><ul><li><RouterLink to="#concurrency">Concurrency</RouterLink></li><li><RouterLink to="#throttling">Throttling</RouterLink></li></ul></li><li><RouterLink to="#usage">Usage</RouterLink><ul><li><RouterLink to="#where-do-i-manage-concurrency-and-throttling">Where Do I Manage Concurrency and Throttling?</RouterLink></li><li><RouterLink to="#managing-event-concurrency">Managing Event Concurrency</RouterLink></li><li><RouterLink to="#throttling-workflow-execution">Throttling Workflow Execution</RouterLink></li><li><RouterLink to="#applying-concurrency-and-throttling-together">Applying Concurrency and Throttling Together</RouterLink></li><li><RouterLink to="#pausing-workflow-execution">Pausing Workflow Execution</RouterLink></li><li><RouterLink to="#increasing-the-queue-size-for-a-workflow">Increasing the queue size for a workflow</RouterLink></li></ul></li></ul></nav>
<h2 id="overview" tabindex="-1"><a class="header-anchor" href="#overview" aria-hidden="true">#</a> Overview</h2>
<p>Workflows listen for events and execute as soon as they are triggered. While this behavior is expected for many use cases, there can be unintended consequences.</p>
<h3 id="concurrency" tabindex="-1"><a class="header-anchor" href="#concurrency" aria-hidden="true">#</a> Concurrency</h3>
<p>Without restricting concurrency, events can be processed in parallel and there is no guarantee that they will execute in the order in which they were received. This can cause race conditions.</p>
<p>For example, if two workflow events try to add data to Google Sheets simultaneously, they may both attempt to write data to the same row. As a result, one event can overwrite data from another event. The diagram below illustrates this example — both <code>Event 1</code> and <code>Event 2</code> attempt to write data to Google Sheets concurrently — as a result, they will both write to the same row and the data for one event will be overwritten and lost (and no error will be thrown).</p>
<p><img src="@source/workflows/concurrency-and-throttling/images/image-20201027132901691.png" alt="image-20201027132901691"></p>
<p>You can avoid race conditions like this by limiting workflow concurrency to a single &quot;worker&quot;. What this means is that only one event will be processed at a time, and the next event will not start processing until the first is complete (unprocesssed events will maintained in a queue and processed by the workflow in order). The following diagram illustrates how the events in the last diagram would executed if concurrency was limited to a single worker.</p>
<p><img src="@source/workflows/concurrency-and-throttling/images/image-20201027133308888.png" alt="image-20201027133308888"></p>
<p>While the first example resulted in only two rows of data in Google Sheets, this time data for all three events are recorded to three separate rows.</p>
<h3 id="throttling" tabindex="-1"><a class="header-anchor" href="#throttling" aria-hidden="true">#</a> Throttling</h3>
<p>If your workflow integrates with any APIs, then you may need to limit the rate at which your workflow executes to avoid hitting rate limits from your API provider. Since event-driven workflows are stateless, you can't manage the rate of execution from within your workflow code. Pipedream's execution controls solve this problem by allowing you to control the maximum number of times a workflow may be invoked over a specific period of time (e.g., up to 1 event every second).</p>
<h2 id="usage" tabindex="-1"><a class="header-anchor" href="#usage" aria-hidden="true">#</a> Usage</h2>
<p>Events emitted from a source to a workflow are placed in a queue, and Pipedream triggers your workflow with events from the queue based on your concurrency and throttling settings. These settings may be customized per workflow (so the same events may be processed at different rates by different workflows).</p>
<p><img src="@source/workflows/concurrency-and-throttling/images/image-20201027145847752.png" alt="image-20201027145847752"></p>
<p>The maximum number of events Pipedream will queue per workflow depends on your account type.</p>
<ul>
<li>Up to 100 events will be queued per workflow for the <a href="/pricing/#developer-tier" target="_blank" rel="noopener noreferrer">Developer Tier<ExternalLinkIcon/></a></li>
<li>Workflows owned by paid plans may have custom limits. If you need a larger queue size, <a href="#increasing-the-queue-size-for-a-workflow">see here</a>.</li>
</ul>
<p><strong>IMPORTANT:</strong> If the number of events emitted to a workflow exceeds the queue size, events will be lost. If that happens, an error message will be displayed in the event list of your workflow and your <a href="/workflows/error-handling/global-error-workflow/" target="_blank" rel="noopener noreferrer">global error workflow<ExternalLinkIcon/></a> will be triggered.</p>
<p>To learn more about how the feature works and technical details, check out our <a href="https://blog.pipedream.com/concurrency-controls-design/" target="_blank" rel="noopener noreferrer">engineering blog post<ExternalLinkIcon/></a>.</p>
<h3 id="where-do-i-manage-concurrency-and-throttling" tabindex="-1"><a class="header-anchor" href="#where-do-i-manage-concurrency-and-throttling" aria-hidden="true">#</a> Where Do I Manage Concurrency and Throttling?</h3>
<p>Concurrency and throttling can be managed in the <strong>Execution Controls</strong> section of your <strong>Workflow Settings</strong>. Event queues are currently supported for any workflow that is triggered by an event source. Event queues are not currently supported for native workflow triggers (native HTTP, cron, SDK and email).</p>
<p><img src="@source/workflows/concurrency-and-throttling/images/image-20201027120141750.png" alt="image-20201027120141750"></p>
<h3 id="managing-event-concurrency" tabindex="-1"><a class="header-anchor" href="#managing-event-concurrency" aria-hidden="true">#</a> Managing Event Concurrency</h3>
<p>Concurrency controls define how many events can be executed in parallel. To enforce serialized, in-order execution, limit concurrency to <code>1</code> worker. This guarantees that each event will only be processed once the execution for the previous event is complete.</p>
<p>To execute events in parallel, increase the number of workers (the number of workers defines the maximum number of concurrent events that may be processed), or disable concurrency controls for unlimited parallelization.</p>
<h3 id="throttling-workflow-execution" tabindex="-1"><a class="header-anchor" href="#throttling-workflow-execution" aria-hidden="true">#</a> Throttling Workflow Execution</h3>
<p>To throttle workflow execution, enable it in your workflow settings and configure the <strong>limit</strong> and <strong>interval</strong>.</p>
<p>The limit defines how many events (from <code>0-10000</code>) to process in a given time period.</p>
<p>The interval defines the time period over which the limit will be enforced. You may specify the time period as a number of seconds, minutes or hours (ranging from <code>1-10000</code>)</p>
<h3 id="applying-concurrency-and-throttling-together" tabindex="-1"><a class="header-anchor" href="#applying-concurrency-and-throttling-together" aria-hidden="true">#</a> Applying Concurrency and Throttling Together</h3>
<p>The conditions for both concurrency and throttling must be met in order for a new event to trigger a workflow execution. Here are some examples:</p>
<table>
<thead>
<tr>
<th>Concurrency</th>
<th>Throttling</th>
<th>Result</th>
</tr>
</thead>
<tbody>
<tr>
<td>Off</td>
<td>Off</td>
<td>Events will trigger your workflow <strong>as soon as they are received</strong>. Events may execute in parallel.</td>
</tr>
<tr>
<td>1 Worker</td>
<td>Off</td>
<td>Events will trigger your workflow in a <strong>serialized pattern</strong> (a maximum of 1 event will be processed at a time). As soon as one event finishes processing, the next event in the queue will be processed.</td>
</tr>
<tr>
<td>1 Worker</td>
<td>1 Event per Second</td>
<td>Events will trigger your workflow in a <strong>serialized pattern</strong> at a <strong>maximum rate</strong> of 1 event per second. <br /><br />If an event takes <u>less</u> than one second to finish processing, the next event in the queue will not being processing until 1 second from the start of the most recently processed event. <br />If an event takes <u>longer</u> than one second to process, the next event in the queue will begin processing immediately.</td>
</tr>
<tr>
<td>1 Worker</td>
<td>10 Events per Minute</td>
<td>Events will trigger your workflow in a <strong>serialized pattern</strong> at a <strong>maximum rate</strong> of 10 events per minute. <br /><br />If an event takes <u>less</u> than one minute to finish processing, the next event in the queue immediately begin processing. If 10 events been processed in less than one minute, the remaining events will be queued until 1 minute from the start of the initial event.<br /></td>
</tr>
<tr>
<td>5 Workers</td>
<td>Off</td>
<td>Up to 5 events will trigger your workflow in parallel as soon as they are received. If more events arrive while 5 events are being processed, they will be queued and executed in order as soon as an event completes processing.</td>
</tr>
</tbody>
</table>
<h3 id="pausing-workflow-execution" tabindex="-1"><a class="header-anchor" href="#pausing-workflow-execution" aria-hidden="true">#</a> Pausing Workflow Execution</h3>
<p>To stop the queue from invoking your workflow, throttle workflow execution and set the limit to <code>0</code>.</p>
<h3 id="increasing-the-queue-size-for-a-workflow" tabindex="-1"><a class="header-anchor" href="#increasing-the-queue-size-for-a-workflow" aria-hidden="true">#</a> Increasing the queue size for a workflow</h3>
<p>By default, your workflow can hold up to {{$site.themeConfig.DEFAULT_WORKFLOW_QUEUE_SIZE}} events in its queue at once. Any events that arrive once the queue is full will be dropped, and you'll see an <a href="/errors/#event-queue-full" target="_blank" rel="noopener noreferrer">Event Queue Full<ExternalLinkIcon/></a> error.</p>
<p>For example, if you serialize the execution of your workflow by setting a concurrency of <code>1</code>, but receive 200 events from your workflow's event source at once, the workflow's queue can only hold the first 100 events. The last 100 events will be dropped.</p>
<p>Users on <a href="https://pipedream.com/pricing" target="_blank" rel="noopener noreferrer">paid tiers<ExternalLinkIcon/></a> can <a href="/workflows/events/concurrency-and-throttling/#increasing-the-queue-size-for-a-workflow" target="_blank" rel="noopener noreferrer">increase their queue size up to {{$site.themeConfig.MAX_WORKFLOW_QUEUE_SIZE}}<ExternalLinkIcon/></a> for a given workflow, just below the <strong>Concurrency</strong> section of your <strong>Execution Controls</strong> settings:</p>
<div>
<img alt="Queue size" width="400" src="@source/workflows/concurrency-and-throttling/images/queue-size.png">
</div>
</template>
