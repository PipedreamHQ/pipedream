<template><h1 id="zoom" tabindex="-1"><a class="header-anchor" href="#zoom" aria-hidden="true">#</a> Zoom</h1>
<p>Pipedream provides a serverless programming platform for building event-driven <a href="/workflows/" target="_blank" rel="noopener noreferrer">workflows<ExternalLinkIcon/></a> that integrate apps. Pipedream comes with <a href="/components/actions/" target="_blank" rel="noopener noreferrer">prebuilt actions<ExternalLinkIcon/></a> for interacting with the Zoom API, and allows you to listen for Zoom events in your account and trigger code when they happen.</p>
<p>Pipedream is fully programmable - you can write <a href="/workflows/steps/code/" target="_blank" rel="noopener noreferrer">any Node.js code<ExternalLinkIcon/></a> to control your workflows - but also fully-managed: Pipedream runs your code, so you don't have to manage any infrastructure and can focus on your workflow's logic.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#overview">Overview</RouterLink></li><li><RouterLink to="#zoom-vs-zoom-admin-app">Zoom vs. Zoom Admin app</RouterLink></li><li><RouterLink to="#connecting-to-zoom-from-pipedream">Connecting to Zoom from Pipedream</RouterLink></li><li><RouterLink to="#zoom-event-sources">Zoom Event Sources</RouterLink><ul><li><RouterLink to="#creating-a-zoom-event-source">Creating a Zoom event source</RouterLink></li><li><RouterLink to="#event-specific-sources">Event-specific sources</RouterLink></li><li><RouterLink to="#zoom-custom-events-source">Zoom Custom Events source</RouterLink></li></ul></li><li><RouterLink to="#example-workflows">Example workflows</RouterLink></li><li><RouterLink to="#common-issues">Common Issues</RouterLink><ul><li><RouterLink to="#my-zoom-event-source-isn-t-receiving-events">My Zoom event source isn&#39;t receiving events</RouterLink></li></ul></li><li><RouterLink to="#removing-pipedream-s-access-to-your-zoom-account">Removing Pipedream&#39;s access to your Zoom account</RouterLink></li><li><RouterLink to="#usage">Usage</RouterLink></li></ul></nav>
<h2 id="overview" tabindex="-1"><a class="header-anchor" href="#overview" aria-hidden="true">#</a> Overview</h2>
<p><strong>Pipedream <a href="/workflows/" target="_blank" rel="noopener noreferrer">workflows<ExternalLinkIcon/></a> allow you to run any Node.js code that connects to the Zoom API</strong>. Just <a href="https://pipedream.com/new" target="_blank" rel="noopener noreferrer">create a new workflow<ExternalLinkIcon/></a>, then add prebuilt Zoom <a href="/components/actions/" target="_blank" rel="noopener noreferrer">actions<ExternalLinkIcon/></a> (create a meeting, send a chat message, etc.) or <a href="/workflows/steps/code/" target="_blank" rel="noopener noreferrer">write your own Node code<ExternalLinkIcon/></a>. These workflows can be triggered by HTTP requests, timers, email, or on any app-based event (new tweets, a Github PR, Zoom events, etc).</p>
<img src="@source/apps/zoom/images/workflow.png" width="500px" alt="How Pipedream works" style="margin-left: auto; margin-right: auto; display: block;"/>
<p><strong>Pipedream <a href="/event-sources/" target="_blank" rel="noopener noreferrer"><strong>event sources</strong><ExternalLinkIcon/></a> expose real-time event streams for any <a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference" target="_blank" rel="noopener noreferrer">Zoom event<ExternalLinkIcon/></a></strong> - just connect your Zoom account, and get an event stream. Event sources can trigger workflows, running custom code each time an event occurs in Zoom. For example, to run a workflow each time a meeting ends, you can create a <strong>Meeting Ended</strong> source. This source emits an event as soon as a meeting ends in your account, which can trigger a workflow that pulls participant stats, emails those participants a survey, or anything else you'd like.</p>
<img src="@source/apps/zoom/images/event-sources.png" alt="How Zoom Event sources work" width="500px" style="margin-left: auto; margin-right: auto; display: block;"/>
<p>You can also subscribe to a <a href="/api/sse/" target="_blank" rel="noopener noreferrer">private SSE stream<ExternalLinkIcon/></a> that lets you listen for these events <strong>in your own application</strong>, in real time. This allows you to use Pipedream to host the event source, which can trigger existing code in your own infrastructure (vs. a Pipedream workflow).</p>
<img src="@source/apps/zoom/images/sse.png" alt="Listen for an SSE event in your own app" width="500px" style="margin-left: auto; margin-right: auto; display: block;"/>
<h2 id="zoom-vs-zoom-admin-app" tabindex="-1"><a class="header-anchor" href="#zoom-vs-zoom-admin-app" aria-hidden="true">#</a> Zoom vs. Zoom Admin app</h2>
<p>Zoom users can be classified into two groups: non-admins and admins. Admins have account-level permissions that users do not, and Zoom has corresponding admin-level scopes that aren't relevant for normal users. Therefore, Pipedream exposes two apps — <strong>Zoom</strong> and <strong>Zoom Admin</strong> — to serve the two groups.</p>
<img src="@source/apps/zoom/images/zoom-apps.png" alt="Zoom and Zoom Admin apps" width="200px" />
<p>In the Zoom Marketplace, these apps are named <a href="https://marketplace.zoom.us/apps/jGaV-kRrT3igAYnn-J5v2g" target="_blank" rel="noopener noreferrer">Pipedream<ExternalLinkIcon/></a>, and <a href="https://marketplace.zoom.us/apps/tZvUsiucR96SqtvfBsemXg" target="_blank" rel="noopener noreferrer">Pipedream for Zoom Admins<ExternalLinkIcon/></a>, respectively.</p>
<p>Non-admins have <a href="https://marketplace.zoom.us/docs/guides/authorization/permissions#user-managed-scopes" target="_blank" rel="noopener noreferrer">permissions<ExternalLinkIcon/></a> to manage standard Zoom resources in their account: meetings, webinars, recordings, and more. <strong>If you're a non-admin, you'll want to use the Zoom app</strong>.</p>
<p>Zoom admins have <a href="https://marketplace.zoom.us/docs/guides/authorization/permissions#account-level-scopes" target="_blank" rel="noopener noreferrer">permissions<ExternalLinkIcon/></a> to manage account-level resources, like users and reports. They can also manage webinars and meetings across their organization. <strong>If you're an admin and need to manage these resources via API, you'll want to use the Zoom Admin app</strong>.</p>
<p>The <a href="https://marketplace.zoom.us/docs/guides/authorization/permissions" target="_blank" rel="noopener noreferrer">Zoom API docs on permissions<ExternalLinkIcon/></a> provide detailed information on these permissions and their associated OAuth scopes.</p>
<h2 id="connecting-to-zoom-from-pipedream" tabindex="-1"><a class="header-anchor" href="#connecting-to-zoom-from-pipedream" aria-hidden="true">#</a> Connecting to Zoom from Pipedream</h2>
<ol>
<li>First, sign up for Pipedream at <a href="https://pipedream.com" target="_blank" rel="noopener noreferrer">https://pipedream.com<ExternalLinkIcon/></a>.</li>
<li>Visit <a href="https://pipedream.com/accounts" target="_blank" rel="noopener noreferrer">https://pipedream.com/accounts<ExternalLinkIcon/></a>.</li>
<li>Click the button labeled <strong>Click Here to Connect an App</strong>.</li>
<li>Search for &quot;Zoom&quot; and select either <strong>Zoom</strong> or <strong>Zoom Admin</strong> (<a href="#zoom-vs-zoom-admin-app">see the differences above</a>):</li>
</ol>
<img src="@source/apps/zoom/images/zoom-apps-from-apps-page.png" alt="Zoom and Zoom Admin apps in Connect an App Modal" width="300px;" />
<p>This will open up a new window prompting you to authorize Pipedream's access to your Zoom account. Once you authorize access, you should see your Zoom account listed among your apps.</p>
<ol start="5">
<li><a href="https://pipedream.com/new" target="_blank" rel="noopener noreferrer">Create a new workflow<ExternalLinkIcon/></a>, <a href="/workflows/steps/" target="_blank" rel="noopener noreferrer">add a new step<ExternalLinkIcon/></a>, search for &quot;Zoom&quot; or &quot;Zoom Admin&quot;. Once you've selected either app, you can choose to either &quot;Run Node.js code&quot; or select one of the prebuilt actions for performing common API operations.</li>
<li>At this stage, you'll be asked to link the Zoom account you connected above, authorizing the request to the Zoom API with your credentials:</li>
</ol>
<img src="@source/apps/zoom/images/connect-zoom-account.png" alt="Connect Zoom Account" width="500px;" />
<h2 id="zoom-event-sources" tabindex="-1"><a class="header-anchor" href="#zoom-event-sources" aria-hidden="true">#</a> Zoom Event Sources</h2>
<p><strong>Pipedream <a href="/event-sources/" target="_blank" rel="noopener noreferrer"><strong>event sources</strong><ExternalLinkIcon/></a> expose real-time event streams for any <a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference" target="_blank" rel="noopener noreferrer">Zoom event<ExternalLinkIcon/></a></strong> - just connect your Zoom account, and get an event stream.</p>
<p>Event sources can trigger workflows, running custom code each time an event occurs in Zoom. For example, to run a workflow each time a meeting ends, you can create a <strong>Meeting Ended</strong> source. This source emits an event as soon as a meeting ends in your account, which can trigger a workflow that pulls participant stats, emails those participants a survey, or anything else you'd like.</p>
<p>There are two categories of Zoom event sources:</p>
<ul>
<li><a href="#event-specific-sources">Event-specific sources</a> listen for a <em>specific</em> Zoom event (<strong>Meeting Created</strong>, <strong>Recording Completed</strong>, etc). Event-specific sources exist only for the most common Zoom events, but you can <a href="https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&amp;labels=enhancement&amp;template=new-source.md&amp;title=%5BTRIGGER%5D" target="_blank" rel="noopener noreferrer">request another source here<ExternalLinkIcon/></a>.</li>
<li>The <a href="#zoom-custom-events-source">Custom Events source</a> allows you to listen for <em>any</em> event from Zoom, and even lets you listen for <em>multiple</em> events at the same time. For example, if you want to run a workflow on both <strong>Meeting Started</strong> and <strong>Webinar Started</strong> events, you can create a custom source that listens for them both, and use that event source as your workflow's trigger.</li>
</ul>
<h3 id="creating-a-zoom-event-source" tabindex="-1"><a class="header-anchor" href="#creating-a-zoom-event-source" aria-hidden="true">#</a> Creating a Zoom event source</h3>
<ol>
<li>Visit <a href="https://pipedream.com/sources" target="_blank" rel="noopener noreferrer">https://pipedream.com/sources<ExternalLinkIcon/></a>.</li>
<li>Click the <strong>Create Source</strong> button.</li>
<li>In the <strong>Select an App</strong> drop-down, select either <strong>Zoom</strong> or <strong>Zoom Admin</strong> (<a href="#zoom-vs-zoom-admin-app">see the difference above</a>).</li>
<li>In the <strong>Select a Source</strong> drop-down, you can either choose from the list of sources tied to a <a href="#event-specific-sources">specific event</a> (<strong>Meeting Created</strong>, <strong>Recording Completed</strong>, etc.), or create an event source that listens for <em>any</em> Zoom event by selecting the <a href="#zoom-custom-events-source"><strong>Zoom Custom Events</strong> or <strong>Zoom Admin Custom Events</strong> source</a>.</li>
</ol>
<img src="@source/apps/zoom/images/zoom-sources-list.png" alt="List of Zoom event sources" />
<h3 id="event-specific-sources" tabindex="-1"><a class="header-anchor" href="#event-specific-sources" aria-hidden="true">#</a> Event-specific sources</h3>
<p>You can create event sources tied to common Zoom events, like <strong>Meeting Created</strong> and <strong>Recording Completed</strong>, by selecting one of the corresponding event sources. These event sources are built to process specific events, and emit data in a format that makes sense for the event type.</p>
<p>For example, the <strong>Recording Completed</strong> source lets you filter on options specific to recordings:</p>
<img src="@source/apps/zoom/images/recording-completed-source.png" alt="Recording Completed Source" />
<p>and <strong>it emits each recording file as its own event</strong> - that is, if you're listening for video, audio, and chat recordings, this source will emit up to 3 events for each meeting: one for each file type.</p>
<p>You can find the source code for each of these event sources in the <a href="https://github.com/PipedreamHQ/pipedream" target="_blank" rel="noopener noreferrer">PipedreamHQ/pipedream<ExternalLinkIcon/></a> Github repo:</p>
<ul>
<li><a href="https://github.com/PipedreamHQ/pipedream/tree/master/components/zoom" target="_blank" rel="noopener noreferrer">Zoom event sources<ExternalLinkIcon/></a></li>
<li><a href="https://github.com/PipedreamHQ/pipedream/tree/master/components/zoom-admin" target="_blank" rel="noopener noreferrer">Zoom Admin event sources<ExternalLinkIcon/></a></li>
</ul>
<p>If you can't find the source you're looking for, you can use the <a href="#zoom-custom-events-source">Zoom Custom Events source</a> to listen for any events from Zoom. You can also <a href="https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&amp;labels=enhancement&amp;template=new-source.md&amp;title=%5BTRIGGER%5D" target="_blank" rel="noopener noreferrer">request another source here<ExternalLinkIcon/></a>, or develop your own Zoom source and open up a pull request in the <a href="https://github.com/PipedreamHQ/pipedream" target="_blank" rel="noopener noreferrer">PipedreamHQ/pipedream<ExternalLinkIcon/></a> Github repo to add that source to the Pipedream platform for anyone to use.</p>
<h3 id="zoom-custom-events-source" tabindex="-1"><a class="header-anchor" href="#zoom-custom-events-source" aria-hidden="true">#</a> Zoom Custom Events source</h3>
<p>The <strong>Zoom Custom Events</strong> or <strong>Zoom Admin Custom Events</strong> source allows you to listen for <em>any</em> event from Zoom, and even lets you listen for <em>multiple</em> events at the same time.</p>
<p>For example, if you want to run a workflow on both <strong>Meeting Started</strong> and <strong>Webinar Started</strong> events, you can create a custom source that listens for them both, and use that event source as your workflow's trigger. Just create the <strong>Zoom Custom Events</strong> source and select <code>meeting.started</code> and <code>webinar.started</code> from the list of events in the <strong>Zoom Events</strong> drop-:down:</p>
<img src="@source/apps/zoom/images/zoom-events-dropdown.png" alt="Zoom Events drop-down" />
<h4 id="list-of-custom-events" tabindex="-1"><a class="header-anchor" href="#list-of-custom-events" aria-hidden="true">#</a> List of Custom Events</h4>
<p>Below, you'll find a full list of the events that you can listen for, with links to the corresponding Zoom docs. Some events are also only available for <em>either</em> the Zoom <em>or</em> Zoom Admin apps, which is indicated by the <strong>Zoom</strong> and <strong>Zoom Admin</strong> columns.</p>
<table>
<thead>
<tr>
<th style="text-align:center">Event</th>
<th style="text-align:center">Description</th>
<th style="text-align:center">Zoom</th>
<th style="text-align:center">Zoom Admin</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/account-events/account-created" target="_blank" rel="noopener noreferrer"><code>account.created</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">New Sub Account created</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/account-events/account-updated" target="_blank" rel="noopener noreferrer"><code>account.updated</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">An Account or a Sub Account's profile is updated</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/account-events/account-settings-updated" target="_blank" rel="noopener noreferrer"><code>account.settings_updated</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">An account or a Sub Account’s settings are updated</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/account-events/account-disassociated" target="_blank" rel="noopener noreferrer"><code>account.disassociated</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Sub Account Disassociated from a Master Account</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-alerted" target="_blank" rel="noopener noreferrer"><code>meeting.alert</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Meeting service issue encountered</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-created" target="_blank" rel="noopener noreferrer"><code>meeting.created</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Meeting created in my Zoom account</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-created" target="_blank" rel="noopener noreferrer"><code>meeting.created.by_me</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Meeting created by me</td>
<td style="text-align:center">✓</td>
<td style="text-align:center"></td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-created" target="_blank" rel="noopener noreferrer"><code>meeting.created.for_me</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Meeting created where I'm the host</td>
<td style="text-align:center">✓</td>
<td style="text-align:center"></td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-updated" target="_blank" rel="noopener noreferrer"><code>meeting.updated</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Meeting updated</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-deleted" target="_blank" rel="noopener noreferrer"><code>meeting.deleted</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Meeting deleted in my Zoom account</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-deleted" target="_blank" rel="noopener noreferrer"><code>meeting.deleted.by_me</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Meeting deleted by me</td>
<td style="text-align:center">✓</td>
<td style="text-align:center"></td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-deleted" target="_blank" rel="noopener noreferrer"><code>meeting.deleted.for_me</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Meeting deleted where I was the host</td>
<td style="text-align:center">✓</td>
<td style="text-align:center"></td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-started" target="_blank" rel="noopener noreferrer"><code>meeting.started</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Meeting started</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-ending" target="_blank" rel="noopener noreferrer"><code>meeting.ended</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Meeting ended</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-registrant-created" target="_blank" rel="noopener noreferrer"><code>meeting.registration_created</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">User registered for meeting</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-registration-approved" target="_blank" rel="noopener noreferrer"><code>meeting.registration_approved</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Meeting registration approved</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-registration-cancelled" target="_blank" rel="noopener noreferrer"><code>meeting.registration_cancelled</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Meeting registration cancelled</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><code>meeting.registration_denied</code></td>
<td style="text-align:center">Meeting registration denied</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-sharing-started" target="_blank" rel="noopener noreferrer"><code>meeting.sharing_started</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">A host or attendee shared their screen</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-sharing-started" target="_blank" rel="noopener noreferrer"><code>meeting.sharing_started.host</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">A host shared their screen</td>
<td style="text-align:center">✓</td>
<td style="text-align:center"></td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-sharing-started" target="_blank" rel="noopener noreferrer"><code>meeting.sharing_started.participant</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">An attendee shared their screen</td>
<td style="text-align:center">✓</td>
<td style="text-align:center"></td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-sharing-ended" target="_blank" rel="noopener noreferrer"><code>meeting.sharing_ended</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">A host or attendee stopped sharing their screen</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-sharing-ended" target="_blank" rel="noopener noreferrer"><code>meeting.sharing_ended.host</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">A host stopped sharing their screen</td>
<td style="text-align:center">✓</td>
<td style="text-align:center"></td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-sharing-ended" target="_blank" rel="noopener noreferrer"><code>meeting.sharing_ended.participant</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">An attendee stopped sharing their screen</td>
<td style="text-align:center">✓</td>
<td style="text-align:center"></td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-participant-joined-before-host" target="_blank" rel="noopener noreferrer"><code>meeting.participant_jbh_joined</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Attendee joined meeting before host</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/meeting-participant-waiting-for-host" target="_blank" rel="noopener noreferrer"><code>meeting.participant_jbh_waiting</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Attendee waiting for host to join meeting</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/participant-joined-meeting" target="_blank" rel="noopener noreferrer"><code>meeting.participant_joined</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Host or attendee joined meeting</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/participant-joined-waiting-room" target="_blank" rel="noopener noreferrer"><code>meeting.participant_joined_waiting_room</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Participant joined waiting room</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/participant-admitted" target="_blank" rel="noopener noreferrer"><code>meeting.participant_admitted</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Participant was admitted to meeting from waiting room</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/participant-put-in-waiting-room" target="_blank" rel="noopener noreferrer"><code>meeting.participant_put_in_waiting_room</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Participant placed in waiting room from meeting</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/meeting-events/participant-left-waiting-room" target="_blank" rel="noopener noreferrer"><code>meeting.participant_left_waiting_room</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Participant left waiting room, or was removed</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/recording-events/recording-started" target="_blank" rel="noopener noreferrer"><code>recording.started</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Recording started</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/recording-events/recording-paused" target="_blank" rel="noopener noreferrer"><code>recording.paused</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Recording paused</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/recording-events/recording-resumed" target="_blank" rel="noopener noreferrer"><code>recording.resumed</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Recording resumed</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/recording-events/recording-stopped" target="_blank" rel="noopener noreferrer"><code>recording.stopped</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Recording stopped</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/recording-events/recording-completed" target="_blank" rel="noopener noreferrer"><code>recording.completed</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Recording completed</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/recording-events/recording-renamed" target="_blank" rel="noopener noreferrer"><code>recording.renamed</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Recording renamed</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/recording-events/recording-renamed" target="_blank" rel="noopener noreferrer"><code>recording.renamed.by_me</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Recording renamed by me</td>
<td style="text-align:center">✓</td>
<td style="text-align:center"></td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/recording-events/recording-renamed" target="_blank" rel="noopener noreferrer"><code>recording.renamed</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Recording renamed for an event where I was the host</td>
<td style="text-align:center">✓</td>
<td style="text-align:center"></td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/recording-events/recording-trashed" target="_blank" rel="noopener noreferrer"><code>recording.trashed</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Recording trashed</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/recording-events/recording-trashed" target="_blank" rel="noopener noreferrer"><code>recording.trashed.by_me</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Recording trashed by me</td>
<td style="text-align:center">✓</td>
<td style="text-align:center"></td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/recording-events/recording-trashed" target="_blank" rel="noopener noreferrer"><code>recording.trashed.for_me</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Recording trashed for an event where I was the host</td>
<td style="text-align:center">✓</td>
<td style="text-align:center"></td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/recording-events/recording-deleted" target="_blank" rel="noopener noreferrer"><code>recording.deleted</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Recording deleted</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/recording-events/recording-deleted" target="_blank" rel="noopener noreferrer"><code>recording.deleted.by_me</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Recording deleted by me</td>
<td style="text-align:center">✓</td>
<td style="text-align:center"></td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/recording-events/recording-deleted" target="_blank" rel="noopener noreferrer"><code>recording.deleted.for_me</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Recording deleted for an event where I was the host</td>
<td style="text-align:center">✓</td>
<td style="text-align:center"></td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/recording-events/recording-recovered" target="_blank" rel="noopener noreferrer"><code>recording.recovered</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Recording recovered</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/recording-events/recording-recovered" target="_blank" rel="noopener noreferrer"><code>recording.recovered</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Recording recovered by me</td>
<td style="text-align:center">✓</td>
<td style="text-align:center"></td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/recording-events/recording-recovered" target="_blank" rel="noopener noreferrer"><code>recording.recovered</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Recording recovered for an event where I was the host</td>
<td style="text-align:center">✓</td>
<td style="text-align:center"></td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/recording-events/recording-transcript-completed" target="_blank" rel="noopener noreferrer"><code>recording.transcript_completed</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Recording transcript completed</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/recording-events/recording-registration-created" target="_blank" rel="noopener noreferrer"><code>recording.registration_completed</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">User registered for an on-demand recording</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/recording-events/recording-registration-approved" target="_blank" rel="noopener noreferrer"><code>recording.registration_approved</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">User approved to view recording</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/recording-events/recording-registration-denied" target="_blank" rel="noopener noreferrer"><code>recording.registration_denied</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">User denied access to cloud recording</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/user-events/user-created" target="_blank" rel="noopener noreferrer"><code>user.created</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">User created</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/user-events/user-invitation-accepted" target="_blank" rel="noopener noreferrer"><code>user.invitation_accepted</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">User accepted account invitation</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/user-events/user-updated" target="_blank" rel="noopener noreferrer"><code>user.updated</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">User profile updated</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/user-events/user-settings-updated" target="_blank" rel="noopener noreferrer"><code>user.settings_updated</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">User settings updated</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/user-events/user-activated" target="_blank" rel="noopener noreferrer"><code>user.activated</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">User activated</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/user-events/user-deactivated" target="_blank" rel="noopener noreferrer"><code>user.deactivated</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">User deactivated</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/user-events/user-disassociated" target="_blank" rel="noopener noreferrer"><code>user.disassociated</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">User disassociated</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/user-events/user-deleted" target="_blank" rel="noopener noreferrer"><code>user.deleted</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">User deleted</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/user-events/user-signed-in" target="_blank" rel="noopener noreferrer"><code>user.signed_in</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">User signed in</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/user-events/user-signed-out" target="_blank" rel="noopener noreferrer"><code>user.signed_out</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">User signed out</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/webinar-events/webinar-created" target="_blank" rel="noopener noreferrer"><code>webinar.created</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Webinar created in my account</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/webinar-events/webinar-created" target="_blank" rel="noopener noreferrer"><code>webinar.created.by_me</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Webinar created by me</td>
<td style="text-align:center">✓</td>
<td style="text-align:center"></td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/webinar-events/webinar-created" target="_blank" rel="noopener noreferrer"><code>webinar.created.for_me</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Webinar created where I'm the host</td>
<td style="text-align:center">✓</td>
<td style="text-align:center"></td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/webinar-events/webinar-updated" target="_blank" rel="noopener noreferrer"><code>webinar.updated</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Webinar updated</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/webinar-events/webinar-deleted" target="_blank" rel="noopener noreferrer"><code>webinar.deleted</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Webinar deleted in my account</td>
<td style="text-align:center"></td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/webinar-events/webinar-deleted" target="_blank" rel="noopener noreferrer"><code>webinar.deleted.by_me</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Webinar deleted by me</td>
<td style="text-align:center">✓</td>
<td style="text-align:center"></td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/webinar-events/webinar-deleted" target="_blank" rel="noopener noreferrer"><code>webinar.deleted</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Webinar deleted where I'm the host</td>
<td style="text-align:center">✓</td>
<td style="text-align:center"></td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/webinar-events/webinar-started" target="_blank" rel="noopener noreferrer"><code>webinar.started</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Webinar started</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/webinar-events/webinar-ended" target="_blank" rel="noopener noreferrer"><code>webinar.ended</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Webinar ended</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/webinar-events/webinar-alert" target="_blank" rel="noopener noreferrer"><code>webinar.alert</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Webinar service issue encountered</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/webinar-events/webinar-sharing-started" target="_blank" rel="noopener noreferrer"><code>webinar.sharing_started</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">A host or attendee shared their screen</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/webinar-events/webinar-sharing-started" target="_blank" rel="noopener noreferrer"><code>webinar.sharing_started.host</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">A host shared their screen</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/webinar-events/webinar-sharing-started" target="_blank" rel="noopener noreferrer"><code>webinar.sharing_started.participant</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">An attendee shared their screen</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/webinar-events/webinar-sharing-ended" target="_blank" rel="noopener noreferrer"><code>webinar.sharing_ended</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">A host or attendee stopped sharing their screen</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/webinar-events/webinar-registration-created" target="_blank" rel="noopener noreferrer"><code>webinar.registration_created</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">User registered for webinar</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/webinar-events/webinar-registration-approved" target="_blank" rel="noopener noreferrer"><code>webinar.registration_approved</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Webinar registration approved</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/webinar-events/webinar-registration-cancelled" target="_blank" rel="noopener noreferrer"><code>webinar.registration_cancelled</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Webinar registration cancelled</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/webinar-events/webinar-registration-denied" target="_blank" rel="noopener noreferrer"><code>webinar.registration_denied</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Webinar registration denied</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/webinar-events/webinar-participant-joined" target="_blank" rel="noopener noreferrer"><code>webinar.participant_joined</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Host or attendee joined webinar</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://marketplace.zoom.us/docs/api-reference/webhook-reference/webinar-events/participant-left" target="_blank" rel="noopener noreferrer"><code>webinar.participant_left</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Host or attendee left webinar</td>
<td style="text-align:center">✓</td>
<td style="text-align:center">✓</td>
</tr>
</tbody>
</table>
<h2 id="example-workflows" tabindex="-1"><a class="header-anchor" href="#example-workflows" aria-hidden="true">#</a> Example workflows</h2>
<p>You can copy any of the workflows below by clicking <strong>Copy</strong> in the top-right corner of the workflow. This will create a copy of the workflow in your account, where you can connect your Zoom account.</p>
<ul>
<li><a href="https://pipedream.com/@zoom-demo/save-zoom-recordings-to-amazon-s3-email-host-then-delete-zoom-recording-p_gYCjqj/edit" target="_blank" rel="noopener noreferrer">Save Zoom recordings to Amazon S3, email host, then delete Zoom recording<ExternalLinkIcon/></a></li>
<li><a href="https://pipedream.com/@zoom-demo/send-meeting-metrics-to-host-via-email-p_n1CMZN/edit" target="_blank" rel="noopener noreferrer">Send meeting metrics to host via email<ExternalLinkIcon/></a></li>
</ul>
<h2 id="common-issues" tabindex="-1"><a class="header-anchor" href="#common-issues" aria-hidden="true">#</a> Common Issues</h2>
<p>If you encounter any issues connecting to Zoom with Pipedream, please <a href="https://pipedream.com/support" target="_blank" rel="noopener noreferrer">reach out to our Support team<ExternalLinkIcon/></a>.</p>
<h3 id="my-zoom-event-source-isn-t-receiving-events" tabindex="-1"><a class="header-anchor" href="#my-zoom-event-source-isn-t-receiving-events" aria-hidden="true">#</a> My Zoom event source isn't receiving events</h3>
<p>It's likely that you need to re-authorize Pipedream's access to your Zoom account to start receiving events. Here's how to do that:</p>
<ol>
<li>Visit <a href="https://pipedream.com/sources" target="_blank" rel="noopener noreferrer">https://pipedream.com/sources<ExternalLinkIcon/></a></li>
<li>Select your event source, and click on the <strong>Configuration</strong> tab.</li>
<li>Press <strong>unlink</strong> next to your connected Zoom account, then press the <strong>Connect Zoom</strong> button.</li>
<li>When your list of connected Zoom accounts appears, click <strong>New</strong>. <strong>This will prompt you to authorize Pipedream's access to your Zoom account <em>again</em>, creating a new auth grant.</strong></li>
<li>This should renew the link between your Zoom account and Pipedream. Try triggering your Zoom event again.</li>
</ol>
<h2 id="removing-pipedream-s-access-to-your-zoom-account" tabindex="-1"><a class="header-anchor" href="#removing-pipedream-s-access-to-your-zoom-account" aria-hidden="true">#</a> Removing Pipedream's access to your Zoom account</h2>
<p>You can revoke Pipedream's access to your Zoom account by visiting your <a href="https://marketplace.zoom.us/user/installed" target="_blank" rel="noopener noreferrer">list of installed apps in Zoom<ExternalLinkIcon/></a>.</p>
<p>As soon as you do, any Pipedream workflows that connect to Zoom will immediately fail to work.</p>
<p>You can delete any Zoom connected accounts in <a href="https://pipedream.com/accounts" target="_blank" rel="noopener noreferrer">your list of Pipedream Accounts<ExternalLinkIcon/></a>, as well.</p>
<h2 id="usage" tabindex="-1"><a class="header-anchor" href="#usage" aria-hidden="true">#</a> Usage</h2>
<p>Please see the section on <a href="#connecting-to-zoom-from-pipedream">Connecting to Zoom from Pipedream</a> to create a Pipedream workflow that connects to the Zoom API.</p>
<p>Pipedream's Zoom app requests all <a href="https://marketplace.zoom.us/docs/guides/authorization/permissions#user-managed-scopes" target="_blank" rel="noopener noreferrer">Zoom user-managed App Scopes<ExternalLinkIcon/></a>.</p>
<p>Pipedream's Zoom Admin app requests all <a href="https://marketplace.zoom.us/docs/guides/authorization/permissions#account-level-scopes" target="_blank" rel="noopener noreferrer">Zoom account-level App Scopes<ExternalLinkIcon/></a>.</p>
<Footer />
</template>
