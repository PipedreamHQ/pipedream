<template><h1 id="sources" tabindex="-1"><a class="header-anchor" href="#sources" aria-hidden="true">#</a> Sources</h1>
<p>Event sources operate primarily as workflow triggers. When you add a new app-based <a href="/workflows/steps/triggers/" target="_blank" rel="noopener noreferrer">trigger<ExternalLinkIcon/></a> to your workflow, you're creating an event source.</p>
<div>
<img alt="New-app-based trigger" width="600px" src="@source/sources/images/app-based-trigger.png">
</div>
<p>Event sources run as their own resources, separate from workflows, for two reasons:</p>
<ul>
<li>A single event sources can trigger more than one workflow. If you have a data source that you want to run <em>multiple</em> workflows, you can create an event source once and use it as the trigger for each workflow.</li>
<li>If you need to consume events emitted by event sources in your own application, you don't need to run a workflow: you can use Pipedream's <a href="/api/rest/" target="_blank" rel="noopener noreferrer">REST API<ExternalLinkIcon/></a> or a <a href="/api/sse/" target="_blank" rel="noopener noreferrer">private, real-time SSE stream<ExternalLinkIcon/></a> to access the event data directly.</li>
</ul>
<p>You can view your event sources at <a href="https://pipedream.com/sources" target="_blank" rel="noopener noreferrer">https://pipedream.com/sources<ExternalLinkIcon/></a>. Here, you'll see the events a specific source has emitted, as well as the logs and configuration for that source.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#overview">Overview</RouterLink></li><li><RouterLink to="#creating-event-sources">Creating event sources</RouterLink><ul><li><RouterLink to="#creating-a-source-from-the-ui">Creating a source from the UI</RouterLink></li><li><RouterLink to="#creating-a-source-from-the-cli">Creating a source from the CLI</RouterLink></li></ul></li><li><RouterLink to="#consuming-events-from-sources">Consuming events from sources</RouterLink></li><li><RouterLink to="#example-http-source">Example: HTTP source</RouterLink></li><li><RouterLink to="#example-cron-jobs">Example: Cron jobs</RouterLink></li><li><RouterLink to="#example-rss">Example: RSS</RouterLink></li><li><RouterLink to="#publishing-a-new-event-source-or-modifying-an-existing-source">Publishing a new event source, or modifying an existing source</RouterLink></li><li><RouterLink to="#limits">Limits</RouterLink></li></ul></nav>
<h2 id="overview" tabindex="-1"><a class="header-anchor" href="#overview" aria-hidden="true">#</a> Overview</h2>
<p>Event sources collect data from apps or service like Github, Twitter, and Google Calendar, then <strong>emit</strong> this data as individual events. These events trigger linked workflows, and <a href="#consuming-events-from-sources">can be retrieved using the API or SSE interfaces</a>.</p>
<p>If the service supports webhooks or another mechanism for real-time data delivery, the event source uses it. For example, Google Sheets supports webhooks, which allows Google Sheets event sources to emit updates instantly.</p>
<p>If a service doesn't support real-time event delivery, Pipedream polls the API for updates every few minutes, emitting events as the API produces them. For example, Airtable doesn't support webhooks, so we poll their API for new records added to a table.</p>
<h2 id="creating-event-sources" tabindex="-1"><a class="header-anchor" href="#creating-event-sources" aria-hidden="true">#</a> Creating event sources</h2>
<p>You can create event sources from the Pipedream UI or CLI.</p>
<h3 id="creating-a-source-from-the-ui" tabindex="-1"><a class="header-anchor" href="#creating-a-source-from-the-ui" aria-hidden="true">#</a> Creating a source from the UI</h3>
<p>Visit <a href="https://pipedream.com/sources" target="_blank" rel="noopener noreferrer">https://pipedream.com/sources<ExternalLinkIcon/></a> and click the <strong>New +</strong> button at the top right to create a new event source. You'll see a list of sources tied to apps (like Twitter and Github) and generic interfaces (like HTTP). Select your source, and you'll be asked to connect any necessary accounts (for example, the Twitter source requires you authorize Pipedream access to your Twitter account), and enter the values for any configuration settings tied to the source.</p>
<p>Once you've created a source, you can use it to trigger <a href="/workflows/" target="_blank" rel="noopener noreferrer">Pipedream workflows<ExternalLinkIcon/></a> or <a href="#consuming-events-from-sources">consume its events</a> using Pipedream's APIs.</p>
<h3 id="creating-a-source-from-the-cli" tabindex="-1"><a class="header-anchor" href="#creating-a-source-from-the-cli" aria-hidden="true">#</a> Creating a source from the CLI</h3>
<p><a href="/cli/install/" target="_blank" rel="noopener noreferrer">Download the CLI<ExternalLinkIcon/></a> and run:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pd deploy
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>This will bring up an interactive menu prompting you to select a source. Once selected, you'll be asked to connect any necessary accounts (for example, the Twitter source requires you authorize Pipedream access to your Twitter account), and enter the values for any configuration settings tied to the source.</p>
<p>Once you've created a source, you can use it to trigger <a href="/workflows/" target="_blank" rel="noopener noreferrer">Pipedream workflows<ExternalLinkIcon/></a> or <a href="#consuming-events-from-sources">consume its events</a> using Pipedream's APIs.</p>
<h2 id="consuming-events-from-sources" tabindex="-1"><a class="header-anchor" href="#consuming-events-from-sources" aria-hidden="true">#</a> Consuming events from sources</h2>
<p>You can view the events for a source in the sources UI, under the <strong>Events</strong> section of that source.</p>
<p>You can also trigger a <a href="/workflows/" target="_blank" rel="noopener noreferrer">Pipedream workflow<ExternalLinkIcon/></a> every time your source emits a new event. This lets you run workflows for every new tweet, every new item in an RSS feed, and more.</p>
<p>Finally, you can consume events programmatically, outside the Pipedream platform, in a few different ways:</p>
<ul>
<li>In real-time, using the <a href="/api/sse/" target="_blank" rel="noopener noreferrer">SSE stream<ExternalLinkIcon/></a> linked to your source</li>
<li>In real-time, via the CLI's <a href="/api/sse/#subscribe-to-new-events-using-the-pipedream-cli" target="_blank" rel="noopener noreferrer"><code>pd events</code> command<ExternalLinkIcon/></a></li>
<li>In batch, using the <a href="#rest-api">REST API</a></li>
</ul>
<h2 id="example-http-source" tabindex="-1"><a class="header-anchor" href="#example-http-source" aria-hidden="true">#</a> Example: HTTP source</h2>
<p>The simplest event source is an <strong>HTTP source</strong>.</p>
<p>When you create an HTTP source:</p>
<ul>
<li>You get a unique HTTP endpoint that you can send any HTTP request to.</li>
<li>You can view the details of any HTTP request sent to your endpoint: its payload, headers, and more.</li>
<li>You can delete the source and its associated events once you're done.</li>
</ul>
<p>HTTP sources are essentially <a href="https://requestbin.com" target="_blank" rel="noopener noreferrer">request bins<ExternalLinkIcon/></a> that can be managed via API.</p>
<p>HTTP sources are a good example of how you can turn an event stream into an API: the HTTP requests are the <strong>event stream</strong>, generated from your application, client browsers, webhooks, etc. Then, you can retrieve HTTP requests via Pipedream's <a href="/api/rest/" target="_blank" rel="noopener noreferrer"><strong>REST API</strong><ExternalLinkIcon/></a>, or stream them directly to other apps using the <a href="/api/sse/" target="_blank" rel="noopener noreferrer">SSE interface<ExternalLinkIcon/></a>.</p>
<p><a href="https://github.com/PipedreamHQ/pipedream/tree/master/components/http#quickstart" target="_blank" rel="noopener noreferrer"><strong>See the Github quickstart for more information on HTTP event sources</strong><ExternalLinkIcon/></a>.</p>
<h2 id="example-cron-jobs" tabindex="-1"><a class="header-anchor" href="#example-cron-jobs" aria-hidden="true">#</a> Example: Cron jobs</h2>
<p>You can also use event sources to run any Node code on a schedule, allowing you to poll a service or API for data and emit that data as an event. The emitted events can trigger Pipedream workflows, and can be retrieved using Pipedream's <a href="/api/rest/" target="_blank" rel="noopener noreferrer"><strong>REST API</strong><ExternalLinkIcon/></a> or <a href="/api/sse/" target="_blank" rel="noopener noreferrer">SSE interface<ExternalLinkIcon/></a>.</p>
<h2 id="example-rss" tabindex="-1"><a class="header-anchor" href="#example-rss" aria-hidden="true">#</a> Example: RSS</h2>
<p>You can run an event source that polls an RSS for new items and emits them in real time as formatted JSON.</p>
<p><a href="https://pipedream.com/sources/new?app=rss&amp;key=rss-new-item-in-feed" target="_blank" rel="noopener noreferrer"><strong>Create an RSS event source here</strong><ExternalLinkIcon/></a>.</p>
<h2 id="publishing-a-new-event-source-or-modifying-an-existing-source" tabindex="-1"><a class="header-anchor" href="#publishing-a-new-event-source-or-modifying-an-existing-source" aria-hidden="true">#</a> Publishing a new event source, or modifying an existing source</h2>
<p>Anyone can create an event source or edit an existing one. The code for all event sources is public, and kept in the <a href="https://github.com/PipedreamHQ/pipedream" target="_blank" rel="noopener noreferrer"><code>PipedreamHQ/pipedream</code> repo<ExternalLinkIcon/></a>. <a href="/components/quickstart/nodejs/sources/" target="_blank" rel="noopener noreferrer">Read this quickstart<ExternalLinkIcon/></a> and see the <a href="/components/api/" target="_blank" rel="noopener noreferrer">event source API docs<ExternalLinkIcon/></a> to learn more about the source development process.</p>
<p>You can chat about source development with the Pipedream team in the <code>#contribute</code> channel of our <a href="https://join.slack.com/t/pipedream-users/shared_invite/zt-ernlymsn-UHfPg~Dfp08uGkAd8dpkww" target="_blank" rel="noopener noreferrer">public Slack<ExternalLinkIcon/></a>, and in the <code>#dev</code> topic in the <a href="https://pipedream.com/community/c/dev/11" target="_blank" rel="noopener noreferrer">Pipedream community<ExternalLinkIcon/></a>.</p>
<h2 id="limits" tabindex="-1"><a class="header-anchor" href="#limits" aria-hidden="true">#</a> Limits</h2>
<p>Event sources are subject to the <a href="/limits/" target="_blank" rel="noopener noreferrer">same limits as Pipedream workflows<ExternalLinkIcon/></a>.</p>
<Footer />
</template>
