<template><h1 id="creating-an-http-source" tabindex="-1"><a class="header-anchor" href="#creating-an-http-source" aria-hidden="true">#</a> Creating an HTTP source</h1>
<p>This tutorial will walk you through how to:</p>
<ol>
<li><a href="#install-the-pipedream-cli">Install the Pipedream CLI</a></li>
<li><a href="#link-your-pipedream-account-to-the-cli">Link your Pipedream account to the CLI</a></li>
<li><a href="#create-an-http-source">Create an HTTP source</a></li>
<li><a href="#consume-events-from-your-source">Consume events from your source</a></li>
</ol>
<p>This should take about 5 minutes to complete.</p>
<h2 id="install-the-pipedream-cli" tabindex="-1"><a class="header-anchor" href="#install-the-pipedream-cli" aria-hidden="true">#</a> Install the Pipedream CLI</h2>
<p><a href="/cli/install/" target="_blank" rel="noopener noreferrer">See the CLI installation docs<ExternalLinkIcon/></a> to learn how to install the CLI for your OS / architecture.</p>
<h2 id="link-your-pipedream-account-to-the-cli" tabindex="-1"><a class="header-anchor" href="#link-your-pipedream-account-to-the-cli" aria-hidden="true">#</a> Link your Pipedream account to the CLI</h2>
<p>If you haven't signed up for a Pipedream account, you can create an account at this step.</p>
<p>Run:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd login
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>This will open up a new window in your default browser. If you're already logged into your Pipedream account in this browser, this will immediately link the CLI to this account, writing your API key for that account to your <a href="/cli/reference/#cli-config-file" target="_blank" rel="noopener noreferrer"><code>pd</code> config file<ExternalLinkIcon/></a>.</p>
<p>Otherwise, you'll be directed to login or sign up for a new account.</p>
<p>Once you're done, go back to your shell and you should see confirmation that your account is linked:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>> pd login
Logged in as dylburger (dylan@pipedream.com)
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h2 id="create-an-http-source" tabindex="-1"><a class="header-anchor" href="#create-an-http-source" aria-hidden="true">#</a> Create an HTTP source</h2>
<p>Run:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd deploy http-new-requests
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>Deploying this source creates an endpoint URL specific your source that you can send any HTTP request to. The CLI will display this endpoint when your source is done deploying. It'll also immediately start listening to the SSE stream tied to your source, displaying new events as they arrive:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>> pd deploy http-new-requests

Deploying...
Deploy complete.

Source name: http
Endpoint: https://myendpoint.m.pipedream.net

Listening for new events on the SSE stream for this source:

    https://rt.pipedream.com/sse/dc/dc_123/emits

Press Ctrl + C to terminate.
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div><p>In a new shell, send an HTTP request to the endpoint URL for your event source, for example using <code>cURL</code>:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>curl -d '{"name": "Luke"}' https://myendpoint.m.pipedream.net
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>You should see the HTTP request data displayed by the CLI:</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"body"</span><span class="token operator">:</span> <span class="token string">"{\"name\": \"Luke\"}"</span><span class="token punctuation">,</span>
  <span class="token property">"headers"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"accept"</span><span class="token operator">:</span> <span class="token string">"*/*"</span><span class="token punctuation">,</span>
    <span class="token property">"content-length"</span><span class="token operator">:</span> <span class="token string">"16"</span><span class="token punctuation">,</span>
    <span class="token property">"content-type"</span><span class="token operator">:</span> <span class="token string">"application/x-www-form-urlencoded"</span><span class="token punctuation">,</span>
    <span class="token property">"host"</span><span class="token operator">:</span> <span class="token string">"myendpoint.m.pipedream.net"</span><span class="token punctuation">,</span>
    <span class="token property">"user-agent"</span><span class="token operator">:</span> <span class="token string">"curl/7.64.1"</span><span class="token punctuation">,</span>
    <span class="token property">"x-amzn-trace-id"</span><span class="token operator">:</span> <span class="token string">"Root=1-5e56fefe-13fa3e702fe4366c8c7ee6e0"</span><span class="token punctuation">,</span>
    <span class="token property">"x-forwarded-for"</span><span class="token operator">:</span> <span class="token string">"1.1.1.1"</span><span class="token punctuation">,</span>
    <span class="token property">"x-forwarded-port"</span><span class="token operator">:</span> <span class="token string">"443"</span><span class="token punctuation">,</span>
    <span class="token property">"x-forwarded-proto"</span><span class="token operator">:</span> <span class="token string">"https"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"method"</span><span class="token operator">:</span> <span class="token string">"POST"</span><span class="token punctuation">,</span>
  <span class="token property">"path"</span><span class="token operator">:</span> <span class="token string">"/"</span><span class="token punctuation">,</span>
  <span class="token property">"query"</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><h2 id="consume-events-from-your-source" tabindex="-1"><a class="header-anchor" href="#consume-events-from-your-source" aria-hidden="true">#</a> Consume events from your source</h2>
<p>There are a few ways to consume events sent to a source. Let's review them one-by-one.</p>
<h3 id="pd-events" tabindex="-1"><a class="header-anchor" href="#pd-events" aria-hidden="true">#</a> <code>pd events</code></h3>
<p>We saw above that the <code>pd deploy</code> command will begin listening for new events as soon as a source is created. This is nice the first time you deploy a source, but to retrieve events later you'll want to use <code>pd events</code>. You can return the last event sent to your source by running:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd events -n 1 http
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>or, like above, you can listen for new events as they arrive:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd events -f http
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p><code>http</code> is the default name associated with the <a href="https://github.com/PipedreamHQ/pipedream/blob/master/components/http/sources/new-requests/new-requests.js" target="_blank" rel="noopener noreferrer">source you deployed above<ExternalLinkIcon/></a>. <code>pd events</code> can accept the name of the ID of the source, which you can see by running <code>pd list sources</code>.</p>
<h2 id="next-steps" tabindex="-1"><a class="header-anchor" href="#next-steps" aria-hidden="true">#</a> Next Steps</h2>
<p><a href="https://github.com/PipedreamHQ/pipedream/blob/master/components/http/sources/new-requests/new-requests.js" target="_blank" rel="noopener noreferrer">This source<ExternalLinkIcon/></a> accepts any HTTP request and returns a 200 OK to the client. But you can modify this behavior in any way you'd like to validate the request, issue a custom response, or run any Node.js code you'd like. <a href="https://github.com/PipedreamHQ/pipedream/tree/master/components/http" target="_blank" rel="noopener noreferrer">Check out our other example HTTP sources<ExternalLinkIcon/></a> to learn more.</p>
<p>For more information on the Pipedream CLI, see the <a href="/cli/reference/" target="_blank" rel="noopener noreferrer">command reference<ExternalLinkIcon/></a>.</p>
<Footer />
</template>
