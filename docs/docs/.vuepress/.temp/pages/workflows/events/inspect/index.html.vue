<template><h1 id="inspect-events" tabindex="-1"><a class="header-anchor" href="#inspect-events" aria-hidden="true">#</a> Inspect Events</h1>
<p><a href="#the-inspector">The inspector</a> lists the events you send to a <a href="/workflows/" target="_blank" rel="noopener noreferrer">workflow<ExternalLinkIcon/></a>. Once you choose a <a href="/workflows/steps/triggers/" target="_blank" rel="noopener noreferrer">trigger<ExternalLinkIcon/></a> and send events to it, you'll see those events in the inspector, to the left of your workflow.</p>
<p>Clicking on an event from the list lets you <a href="/workflows/events/#examining-incoming-event-data" target="_blank" rel="noopener noreferrer">review the incoming event data and workflow execution logs<ExternalLinkIcon/></a> for that event.</p>
<p>You can use the inspector to replay events, delete them, and more.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#the-inspector">The inspector</RouterLink></li><li><RouterLink to="#live-pause">Live / Pause</RouterLink></li><li><RouterLink to="#search">Search</RouterLink></li><li><RouterLink to="#event-duration">Event Duration</RouterLink></li><li><RouterLink to="#replaying-and-deleting-events">Replaying and deleting events</RouterLink></li><li><RouterLink to="#messages">Messages</RouterLink></li><li><RouterLink to="#events-from-older-versions-your-workflow">Events from older versions your workflow</RouterLink></li><li><RouterLink to="#limits">Limits</RouterLink></li></ul></nav>
<h2 id="the-inspector" tabindex="-1"><a class="header-anchor" href="#the-inspector" aria-hidden="true">#</a> The inspector</h2>
<p>The inspector lists your workflow's events:</p>
<div>
<img width="400px" alt="The Inspector" src="@source/workflows/events/inspect/images/event-in-inspector.png">
</div>
<h2 id="live-pause" tabindex="-1"><a class="header-anchor" href="#live-pause" aria-hidden="true">#</a> Live / Pause</h2>
<p>Events appear in the inspector in real-time; you shouldn't have to refresh the page to see them. This is the default mode.</p>
<p>If your events arrive at a fast rate, it can be helpful to pause the display of those events. Hover over the section labeled <strong>Today</strong> and press the <strong>Pause</strong> button to pause the event stream. Press <strong>Paused</strong> again to see the live stream again.</p>
<div>
<img width="400px" alt="Pause event stream" src="@source/workflows/events/inspect/images/pause.gif">
</div>
<p><strong>Events sent to a source still invoke your workflow, but they do not show up in the Inspector</strong> while you're in a paused state.</p>
<h2 id="search" tabindex="-1"><a class="header-anchor" href="#search" aria-hidden="true">#</a> Search</h2>
<p>Above the inspector, you'll see a search box you can use to filter the list of events:</p>
<div>
<img width="400px" alt="Inspector search box" src="@source/workflows/events/inspect/images/search.gif">
</div>
<p>Here are a few things to note about searches:</p>
<ul>
<li>Search is case-insensitive. Both &quot;post&quot; and &quot;POST&quot; should match queries sent using the HTTP <code>POST</code> method, for example.</li>
<li>We perform partial string matches on the text you're searching for. &quot;test&quot; will match events with &quot;test&quot; and &quot;testing&quot; in the body.</li>
<li>We search through all field names and values in the event. For example, you can search for text in the HTTP method, path, body and more.</li>
</ul>
<h2 id="event-duration" tabindex="-1"><a class="header-anchor" href="#event-duration" aria-hidden="true">#</a> Event Duration</h2>
<p>The duration shown next to each event notes the time it took to run your code, in addition to the time it took Pipedream to handle the execution of that code and manage its output. Specifically,</p>
<p><strong>Duration = Time Your Code Ran + Pipedream Execution Time</strong></p>
<h2 id="replaying-and-deleting-events" tabindex="-1"><a class="header-anchor" href="#replaying-and-deleting-events" aria-hidden="true">#</a> Replaying and deleting events</h2>
<p>Hover over an event, and you'll see two buttons:</p>
<div>
<img width="400px" alt="Replay and delete events" src="@source/workflows/events/inspect/images/replay-and-delete.png">
</div>
<p>The blue button with the arrow <strong>replays</strong> the event against the newest version of your workflow. The red button with the X <strong>deletes</strong> the event.</p>
<p>You can also delete all events currently in the inspector by pressing the <strong>Delete All Events</strong> button at the bottom of the inspector.</p>
<h2 id="messages" tabindex="-1"><a class="header-anchor" href="#messages" aria-hidden="true">#</a> Messages</h2>
<p>Any <code>console.log()</code> statements or other output of code steps is attached to the associated code cells. But <a href="/workflows/steps/code/#end" target="_blank" rel="noopener noreferrer"><code>$end()</code><ExternalLinkIcon/></a> or <a href="/workflows/steps/code/#exceptions" target="_blank" rel="noopener noreferrer">exceptions<ExternalLinkIcon/></a> end a workflow's execution, so their details appear in the inspector:</p>
<div>
<img width="400px" alt="$end message" src="@source/workflows/events/inspect/images/dollar-end.png">
</div>
<div>
<img width="400px" alt="Exception message" src="@source/workflows/events/inspect/images/exception.png">
</div>
<h2 id="events-from-older-versions-your-workflow" tabindex="-1"><a class="header-anchor" href="#events-from-older-versions-your-workflow" aria-hidden="true">#</a> Events from older versions your workflow</h2>
<p>When you modify and save your workflow, we increment its version:</p>
<div>
<img alt="workflow version" src="@source/workflows/events/inspect/images/version.png">
</div>
<p>Events sent to the newest version of your workflow appear in black in the Inspector. Events from older versions appear in grey:</p>
<div>
<img alt="Newer events in black, older events in grey" width="400px" src="@source/workflows/events/inspect/images/new-old-events.png">
</div>
<p>When you select events from older versions of your workflow, note that we display the workflow and all associated observability at that point in time. So if an older version of your workflow had a code step, or an action, that you've subsequently removed, it will still appear with older events sent to that version. <a href="/workflows/managing/#reverting-your-workflow-to-a-previous-version" target="_blank" rel="noopener noreferrer">Read more here<ExternalLinkIcon/></a>.</p>
<h2 id="limits" tabindex="-1"><a class="header-anchor" href="#limits" aria-hidden="true">#</a> Limits</h2>
<p>Pipedream retains a limited history of events for a given workflow. See the <a href="/limits/#event-execution-history" target="_blank" rel="noopener noreferrer">limits docs<ExternalLinkIcon/></a> for more information.</p>
<Footer />
</template>
