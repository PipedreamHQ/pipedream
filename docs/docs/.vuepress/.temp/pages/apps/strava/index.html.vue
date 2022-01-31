<template><h1 id="strava" tabindex="-1"><a class="header-anchor" href="#strava" aria-hidden="true">#</a> Strava</h1>
<p>Pipedream provides a serverless programming platform for building event-driven <a href="/workflows/" target="_blank" rel="noopener noreferrer">workflows<ExternalLinkIcon/></a> that integrate apps. Pipedream comes with <a href="/components/actions/" target="_blank" rel="noopener noreferrer">prebuilt actions<ExternalLinkIcon/></a> for interacting with the Strava API, and allows you to listen for Strava events in your account and trigger code when they happen.</p>
<p>Pipedream is fully programmable - you can write <a href="/workflows/steps/code/" target="_blank" rel="noopener noreferrer">any Node.js code<ExternalLinkIcon/></a> to control your workflows - but also fully-managed: Pipedream runs your code, so you don't have to manage any infrastructure and can focus on your workflow's logic.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#overview">Overview</RouterLink></li><li><RouterLink to="#strava-events-event-sources">Strava Events &amp; Event Sources</RouterLink></li><li><RouterLink to="#strava-workflows">Strava Workflows</RouterLink></li><li><RouterLink to="#common-issues">Common Issues</RouterLink><ul><li><RouterLink to="#event-delay">Event Delay</RouterLink></li></ul></li><li><RouterLink to="#removing-pipedream-s-access-to-your-strava-account">Removing Pipedream&#39;s access to your Strava account</RouterLink></li><li><RouterLink to="#strava-developer-docs">Strava Developer Docs</RouterLink></li></ul></nav>
<h2 id="overview" tabindex="-1"><a class="header-anchor" href="#overview" aria-hidden="true">#</a> Overview</h2>
<p><strong>Pipedream <a href="/workflows/" target="_blank" rel="noopener noreferrer">workflows<ExternalLinkIcon/></a> allow you to run any Node.js code that connects to the Strava API</strong>. Just <a href="https://pipedream.com/new" target="_blank" rel="noopener noreferrer">create a new workflow<ExternalLinkIcon/></a>, then add prebuilt Strava <a href="/components/actions/" target="_blank" rel="noopener noreferrer">actions<ExternalLinkIcon/></a> or <a href="/workflows/steps/code/" target="_blank" rel="noopener noreferrer">write your own Node code<ExternalLinkIcon/></a>. These workflows can be triggered by HTTP requests, timers, email, or on any app-based event (new tweets, a Github PR, Zoom events, etc).</p>
<p><strong>Pipedream <a href="/event-sources/" target="_blank" rel="noopener noreferrer"><strong>event sources</strong><ExternalLinkIcon/></a> expose real-time event streams for <a href="#strava-events-event-sources">Strava events</a></strong> - just connect your Strava account, and get an event stream. Event sources can trigger workflows, running custom code each time an event occurs in Strava. For example, to run a workflow each time you complete a new activity, you can create an <strong>Activity Created</strong> source. This source emits an event when you add a new activity to Strava, which can trigger a workflow that <a href="https://pipedream.com/@dylan/send-new-strava-activities-to-slack-p_5VCBKZ/edit" target="_blank" rel="noopener noreferrer">sends the activity data to Slack<ExternalLinkIcon/></a>, <a href="https://pipedream.com/@dylan/store-new-strava-activity-data-in-a-google-spreadsheet-p_D1CvkG/edit" target="_blank" rel="noopener noreferrer">stores it in a Google sheet<ExternalLinkIcon/></a>, or anything else you'd like.</p>
<p>You can also subscribe to a <a href="/api/sse/" target="_blank" rel="noopener noreferrer">private SSE stream<ExternalLinkIcon/></a> that lets you listen for these events <strong>in your own application</strong>, in real time. This allows you to use Pipedream to host the event source, which can trigger existing code in your own infrastructure (vs. a Pipedream workflow).</p>
<h2 id="strava-events-event-sources" tabindex="-1"><a class="header-anchor" href="#strava-events-event-sources" aria-hidden="true">#</a> Strava Events &amp; Event Sources</h2>
<p>Pipedream exposes event sources for each of the following events:</p>
<table>
<thead>
<tr>
<th style="text-align:center">Event (click to create source)</th>
<th style="text-align:center">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center"><a href="https://pipedream.com/sources?action=create&amp;key=strava-activity-created" target="_blank" rel="noopener noreferrer"><code>activity.created</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">New activity added</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://pipedream.com/sources?action=create&amp;key=strava-activity-updated" target="_blank" rel="noopener noreferrer"><code>activity.updated</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Activity title, type changed</td>
</tr>
<tr>
<td style="text-align:center"><a href="https://pipedream.com/sources?action=create&amp;key=strava-activity-deleted" target="_blank" rel="noopener noreferrer"><code>activity.deleted</code><ExternalLinkIcon/></a></td>
<td style="text-align:center">Activity deleted</td>
</tr>
</tbody>
</table>
<p>You can also create a <a href="https://pipedream.com/sources?action=create&amp;key=strava-custom-events" target="_blank" rel="noopener noreferrer">Custom Strava Events<ExternalLinkIcon/></a> source that will allow you to listen for any combination of the events above. For example, if you wanted to run a Pipedream workflow every time an event was added <em>or</em> updated, you can create a Custom Events source that will emit both events.</p>
<p>You can review the code for any of these event sources <a href="https://github.com/PipedreamHQ/pipedream/tree/master/components/strava" target="_blank" rel="noopener noreferrer">on the <code>PipedreamHQ/pipedream</code> Github repo<ExternalLinkIcon/></a>. The Pipedream team welcomes PRs and suggested improvements.</p>
<h2 id="strava-workflows" tabindex="-1"><a class="header-anchor" href="#strava-workflows" aria-hidden="true">#</a> Strava Workflows</h2>
<p>Curious what you can do with Strava event sources, or need some inspiration? Copy these workflows:</p>
<ul>
<li><a href="https://pipedream.com/@dylan/send-new-strava-activities-to-slack-p_5VCBKZ/edit" target="_blank" rel="noopener noreferrer">Send new Strava activities to Slack<ExternalLinkIcon/></a></li>
<li><a href="https://pipedream.com/@dylan/store-new-strava-activities-in-a-google-spreadsheet-p_D1CvkG/edit" target="_blank" rel="noopener noreferrer">Store new Strava activity data in a Google spreadsheet<ExternalLinkIcon/></a></li>
</ul>
<h2 id="common-issues" tabindex="-1"><a class="header-anchor" href="#common-issues" aria-hidden="true">#</a> Common Issues</h2>
<p>If you're having an issue you can't solve with these docs, <a href="https://pipedream.com/support/" target="_blank" rel="noopener noreferrer">get support here<ExternalLinkIcon/></a>.</p>
<h3 id="event-delay" tabindex="-1"><a class="header-anchor" href="#event-delay" aria-hidden="true">#</a> Event Delay</h3>
<p>The Pipedream team has observed intermittent delays between the time an event occurs in Strava and the time it's received by Pipedream. This delay can last 15 minutes or more. If you trigger a new event in Strava and are not seeing the event emitted by your Pipedream source, wait for at least 30 minutes.</p>
<h2 id="removing-pipedream-s-access-to-your-strava-account" tabindex="-1"><a class="header-anchor" href="#removing-pipedream-s-access-to-your-strava-account" aria-hidden="true">#</a> Removing Pipedream's access to your Strava account</h2>
<p>You can revoke Pipedream's access to your Strava account by visiting your <a href="https://www.strava.com/settings/apps" target="_blank" rel="noopener noreferrer">Strava Settings<ExternalLinkIcon/></a>.</p>
<p>As soon as you do, any Pipedream workflows that connect to Strava will immediately fail to work.</p>
<p>Once you've revoked Pipedream's access to your account from Strava, you can delete any Strava connected accounts in <a href="https://pipedream.com/accounts" target="_blank" rel="noopener noreferrer">your list of Pipedream Accounts<ExternalLinkIcon/></a>, as well.</p>
<h2 id="strava-developer-docs" tabindex="-1"><a class="header-anchor" href="#strava-developer-docs" aria-hidden="true">#</a> Strava Developer Docs</h2>
<ul>
<li><a href="http://developers.strava.com/" target="_blank" rel="noopener noreferrer">API Docs<ExternalLinkIcon/></a></li>
<li><a href="https://developers.strava.com/docs/webhooks/" target="_blank" rel="noopener noreferrer">Webhook Events API<ExternalLinkIcon/></a></li>
<li><a href="https://www.strava.com/legal/api" target="_blank" rel="noopener noreferrer">API Agreement<ExternalLinkIcon/></a></li>
</ul>
<Footer />
</template>
