<template><h1 id="rest-api-example-webhooks" tabindex="-1"><a class="header-anchor" href="#rest-api-example-webhooks" aria-hidden="true">#</a> REST API Example: Webhooks</h1>
<p>Pipedream supports webhooks as a way to deliver events to a endpoint you own. Webhooks are managed at an account-level, and you send data to these webhooks using <a href="#subscriptions">subscriptions</a>.</p>
<p>For example, you can run a Twitter <a href="/event-sources" target="_blank" rel="noopener noreferrer">event source<ExternalLinkIcon/></a> that listens for new tweets. If you <a href="#subscriptions">subscribe</a> the webhook to this source, Pipedream will deliver those tweets directly to your webhook's URL without running a workflow.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#send-events-from-an-existing-event-source-to-a-webhook">Send events from an existing event source to a webhook</RouterLink><ul><li><RouterLink to="#step-1-retrieve-the-source-s-id">Step 1 - retrieve the source&#39;s ID</RouterLink></li><li><RouterLink to="#step-2-create-a-webhook">Step 2 - Create a webhook</RouterLink></li><li><RouterLink to="#step-3-create-a-subscription">Step 3 - Create a subscription</RouterLink></li><li><RouterLink to="#step-4-trigger-an-event">Step 4 - Trigger an event</RouterLink></li></ul></li><li><RouterLink to="#extending-these-ideas">Extending these ideas</RouterLink></li></ul></nav>
<h2 id="send-events-from-an-existing-event-source-to-a-webhook" tabindex="-1"><a class="header-anchor" href="#send-events-from-an-existing-event-source-to-a-webhook" aria-hidden="true">#</a> Send events from an existing event source to a webhook</h2>
<p><a href="/event-sources" target="_blank" rel="noopener noreferrer">Event sources<ExternalLinkIcon/></a> source data from a service / API, emitting events that can trigger Pipedream workflows. For example, you can run a Github event source that emits an event anytime someone stars your repo, triggering a workflow on each new star.</p>
<p><strong>You can also send the events emitted by an event source to a webhook</strong>.</p>
<div>
<img alt="Github stars to Pipedream" src="@source/api/rest/webhooks/images/webhook-proxy.png">
</div>
<h3 id="step-1-retrieve-the-source-s-id" tabindex="-1"><a class="header-anchor" href="#step-1-retrieve-the-source-s-id" aria-hidden="true">#</a> Step 1 - retrieve the source's ID</h3>
<p>First, you'll need the ID of your source. You can visit <a href="https://pipedream.com/sources" target="_blank" rel="noopener noreferrer">https://pipedream.com/sources<ExternalLinkIcon/></a>, select a source, and copy its ID from the URL. It's the string that starts with <code>dc_</code>:</p>
<div>
<img alt="Source ID" width="300px" src="@source/api/rest/webhooks/images/source-id.png">
</div>
<p>You can also find the ID by running <code>pd list sources</code> using <a href="/cli/reference/#pd-list" target="_blank" rel="noopener noreferrer">the CLI<ExternalLinkIcon/></a>.</p>
<h3 id="step-2-create-a-webhook" tabindex="-1"><a class="header-anchor" href="#step-2-create-a-webhook" aria-hidden="true">#</a> Step 2 - Create a webhook</h3>
<p>You can create a webhook using the <a href="/api/rest/#create-a-webhook" target="_blank" rel="noopener noreferrer"><code>POST /webhooks</code> endpoint<ExternalLinkIcon/></a>. The endpoint accepts 3 params:</p>
<ul>
<li><code>url</code>: the endpoint to which you'd like to deliver events</li>
<li><code>name</code>: a name to assign to the webhook, for your own reference</li>
<li><code>description</code>: a longer description</li>
</ul>
<p>You can make a request to this endpoint using <code>cURL</code>:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token string">"https://api.pipedream.com/v1/webhooks?url=https://endpoint.m.pipedream.net&amp;name=name&amp;description=description \
  -X POST \
  -H "</span>Authorization: Bearer <span class="token operator">&lt;</span>api_key<span class="token operator">></span><span class="token string">" \
  -H "</span>Content-Type: application/json"
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>Successful API responses contain a webhook ID in <code>data.id</code> — the string that starts with <code>wh_</code> — which you'll use in <strong>Step 3</strong>:</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"wh_abc123"</span>
    ...
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h3 id="step-3-create-a-subscription" tabindex="-1"><a class="header-anchor" href="#step-3-create-a-subscription" aria-hidden="true">#</a> Step 3 - Create a subscription</h3>
<p><a href="/api/rest/#subscriptions" target="_blank" rel="noopener noreferrer">Subscriptions<ExternalLinkIcon/></a> allow you to deliver events from one Pipedream resource to another. In the language of subscriptions, the webhook will <strong>listen</strong> for events <strong>emitted</strong> by the event source.</p>
<p>You can make a request to the <a href="/api/rest/#listen-for-events-from-another-source-or-workflow" target="_blank" rel="noopener noreferrer"><code>POST /subscriptions</code> endpoint<ExternalLinkIcon/></a> to create this subscription. This endpoint requires two params:</p>
<ul>
<li><code>emitter_id</code>: the source ID from <strong>Step 1</strong></li>
<li><code>listener_id</code>: the webhook ID from <strong>Step 2</strong></li>
</ul>
<p>You can make a request to this endpoint using <code>cURL</code>:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token string">"https://api.pipedream.com/v1/subscriptions?emitter_id=dc_abc123&amp;listener_id=wh_abc123"</span> <span class="token punctuation">\</span>
  -X POST <span class="token punctuation">\</span>
  -H <span class="token string">"Authorization: Bearer &lt;api_key>"</span> <span class="token punctuation">\</span>
  -H <span class="token string">"Content-Type: application/json"</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>If successful, this endpoint should return a <code>200 OK</code> with metadata on the subscription. You can also <a href="/api/rest/#get-current-user-s-subscriptions" target="_blank" rel="noopener noreferrer">list your subscriptions<ExternalLinkIcon/></a> to confirm that it's active.</p>
<h3 id="step-4-trigger-an-event" tabindex="-1"><a class="header-anchor" href="#step-4-trigger-an-event" aria-hidden="true">#</a> Step 4 - Trigger an event</h3>
<p>Trigger an event in your source (for example, send a tweet, star a Github repo, etc). You should see the event emitted by the source delivered to the webhook URL.</p>
<h2 id="extending-these-ideas" tabindex="-1"><a class="header-anchor" href="#extending-these-ideas" aria-hidden="true">#</a> Extending these ideas</h2>
<p>You can configure <em>any</em> events to be delivered to a webhook: events emitted by event source, or those <a href="/destinations/emit/" target="_blank" rel="noopener noreferrer">emitted by a workflow<ExternalLinkIcon/></a>.</p>
<p>You can also configure an event to be delivered to <em>multiple</em> webhooks by creating multiple webhooks / subscriptions.</p>
<Footer />
</template>
