<template><h1 id="logs" tabindex="-1"><a class="header-anchor" href="#logs" aria-hidden="true">#</a> Logs</h1>
<p>Sources can produce log using <code>console</code> statements, and can throw errors. These logs show up in the sources UI for each source, under <strong>LOGS</strong>.</p>
<p><a href="/event-sources/" target="_blank" rel="noopener noreferrer">Like events<ExternalLinkIcon/></a>, logs can also be consumed programmatically:</p>
<ul>
<li>Connecting to the <a href="/api/sse/" target="_blank" rel="noopener noreferrer">SSE stream<ExternalLinkIcon/></a> directly</li>
<li>Using the <a href="#pd-logs"><code>pd logs</code></a> CLI command</li>
</ul>
<h2 id="sse" tabindex="-1"><a class="header-anchor" href="#sse" aria-hidden="true">#</a> SSE</h2>
<h3 id="what-is-sse" tabindex="-1"><a class="header-anchor" href="#what-is-sse" aria-hidden="true">#</a> What is SSE?</h3>
<p><a href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events" target="_blank" rel="noopener noreferrer">Server-sent Events<ExternalLinkIcon/></a> (SSE) defines a spec for how servers can send events directly to clients that subscribe to those events, similar to <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API" target="_blank" rel="noopener noreferrer">WebSockets<ExternalLinkIcon/></a> and related server-to-client push technologies.</p>
<p>Unlike WebSockets, SSE enables one-way communication from server to clients (WebSockets enable bidirectional communication between server and client, allowing you to pass messages back and forth). If you only need a client to subscribe to events from a server, and don't require bidirectional communication, SSE is simple way to make that happen.</p>
<h3 id="connecting-to-the-sse-stream-directly" tabindex="-1"><a class="header-anchor" href="#connecting-to-the-sse-stream-directly" aria-hidden="true">#</a> Connecting to the SSE stream directly</h3>
<p><a href="/event-sources/" target="_blank" rel="noopener noreferrer">Just like for events<ExternalLinkIcon/></a>, logs are published to a source-specific SSE stream.</p>
<p>To connect to this stream, you'll need to:</p>
<ul>
<li>Get the SSE URL for your source using <a href="/cli/reference/#pd-list" target="_blank" rel="noopener noreferrer"><code>pd list streams</code><ExternalLinkIcon/></a>, modifying the URL slightly (see below).</li>
<li>Connect to the SSE stream, passing your Pipedream API key in the <code>Authorization</code> HTTP header using <a href="/api/auth/#authorizing-api-requests" target="_blank" rel="noopener noreferrer">Bearer Auth<ExternalLinkIcon/></a>.</li>
</ul>
<p>When you run <code>pd list streams</code>, you'll see output like the following:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>λ pd list streams

  NAME                  TYPE   VISIBILITY  SSE
  http                  http   private     https://rt.pipedream.com/sse/dc/dc_abc123/emits
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>This SSE URL points to the <code>/emits</code> stream, which contains your source's events. <strong>Change <code>/emits</code> to <code>/observations</code> to connect to the logs stream</strong>.</p>
<p><a href="https://github.com/PipedreamHQ/node-sse-example" target="_blank" rel="noopener noreferrer"><strong>See this repo</strong><ExternalLinkIcon/></a> for an example Node.js app that processes events from a Pipedream SSE stream.</p>
<p><a href="https://en.wikipedia.org/wiki/Server-sent_events#Libraries" target="_blank" rel="noopener noreferrer">Most programming languages provide SSE clients<ExternalLinkIcon/></a> that facilitate interaction with SSE streams. For example, the Node.js example repo uses the <a href="https://www.npmjs.com/package/eventsource" target="_blank" rel="noopener noreferrer"><code>eventsource</code> npm package<ExternalLinkIcon/></a>, which implements the <a href="https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events" target="_blank" rel="noopener noreferrer"><code>EventSource</code> API<ExternalLinkIcon/></a>.</p>
<h2 id="pd-logs" tabindex="-1"><a class="header-anchor" href="#pd-logs" aria-hidden="true">#</a> <code>pd logs</code></h2>
<p>The <a href="/cli/reference/#pd-logs" target="_blank" rel="noopener noreferrer"><code>pd logs</code> command<ExternalLinkIcon/></a> streams logs for a source directly to your shell:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pd logs <span class="token operator">&lt;</span>source-id-or-name<span class="token operator">></span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h2 id="limits" tabindex="-1"><a class="header-anchor" href="#limits" aria-hidden="true">#</a> Limits</h2>
<p>Pipedream stores the last 100 logs (standard output and standard error) for each source.</p>
<Footer />
</template>
