<template><h1 id="rest-api-example-create-an-rss-source" tabindex="-1"><a class="header-anchor" href="#rest-api-example-create-an-rss-source" aria-hidden="true">#</a> REST API example: Create an RSS source</h1>
<p>Here, we'll walk through an example of how to create an RSS <a href="/event-sources/" target="_blank" rel="noopener noreferrer">event source<ExternalLinkIcon/></a> and retrieve events from that source using the <a href="/api/rest/" target="_blank" rel="noopener noreferrer">REST API<ExternalLinkIcon/></a>.</p>
<p>Before you begin, you'll need your <a href="/api/auth/#pipedream-api-key" target="_blank" rel="noopener noreferrer">Pipedream API Key<ExternalLinkIcon/></a>.</p>
<h2 id="find-the-details-of-the-source-you-d-like-to-create" tabindex="-1"><a class="header-anchor" href="#find-the-details-of-the-source-you-d-like-to-create" aria-hidden="true">#</a> Find the details of the source you'd like to create</h2>
<p>To create an event source using Pipedream's REST API, you'll need two things:</p>
<ul>
<li>The <code>key</code> that identifies the component by name</li>
<li>The <code>props</code> - input data - required to create the source</li>
</ul>
<p>You can find the <code>key</code> by reviewing the code for the source, <a href="https://github.com/PipedreamHQ/pipedream/tree/master/components" target="_blank" rel="noopener noreferrer">in Pipedream's Github repo<ExternalLinkIcon/></a>.</p>
<p>In the <code>components/</code> directory, you'll see a list of apps. Navigate to the app-specific directory for your source, then visit the <code>sources/</code> directory in that dir to find your source. For example, to create an RSS source, visit the <a href="https://github.com/PipedreamHQ/pipedream/blob/master/components/rss/sources/new-item-in-feed/new-item-in-feed.js" target="_blank" rel="noopener noreferrer"><code>components/rss/sources/new-item-in-feed/new-item-in-feed.js</code> source<ExternalLinkIcon/></a>.</p>
<p>The <code>key</code> is a globally unique identifier for the source. You'll see the <code>key</code> for this source near the top of the file:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"rss-new-item-in-feed"</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>Given this key, make an API request to the <code>/components/registry/{key}</code> endpoint of Pipedream's REST API:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> https://api.pipedream.com/v1/components/registry/rss-new-item-in-feed <span class="token punctuation">\</span>
  -H <span class="token string">"Authorization: Bearer XXX"</span> -vvv <span class="token punctuation">\</span>
  -H <span class="token string">"Content-Type: application/json"</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>This returns information about the component, including a <code>configurable_props</code> section that lists the input you'll need to provide to create the source:</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token property">"configurable_props"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
  <span class="token punctuation">{</span>
    <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"rss"</span><span class="token punctuation">,</span>
    <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"app"</span><span class="token punctuation">,</span>
    <span class="token property">"app"</span><span class="token operator">:</span> <span class="token string">"rss"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"url"</span><span class="token punctuation">,</span>
    <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"string"</span><span class="token punctuation">,</span>
    <span class="token property">"label"</span><span class="token operator">:</span> <span class="token string">"Feed URL"</span><span class="token punctuation">,</span>
    <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"Enter the URL for any public RSS feed."</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">{</span>
    <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"timer"</span><span class="token punctuation">,</span>
    <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"$.interface.timer"</span><span class="token punctuation">,</span>
    <span class="token property">"default"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">"intervalSeconds"</span><span class="token operator">:</span> <span class="token number">900</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">]</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><p>In this specific case, you can ignore the <code>rss</code> &quot;app&quot; prop. The other two props — <code>url</code> and <code>timer</code> — are inputs that you can control:</p>
<ul>
<li><code>url</code>: the URL to the RSS feed</li>
<li><code>timer</code> (optional): the frequency at which you'd like to poll the RSS feed for new items. By default, this source will poll for new items every 15 minutes.</li>
</ul>
<h2 id="creating-the-source" tabindex="-1"><a class="header-anchor" href="#creating-the-source" aria-hidden="true">#</a> Creating the source</h2>
<p>To create an RSS event source, make an HTTP POST request to the <code>/v1/sources</code> endpoint of Pipedream's REST API, passing the <code>url</code> you'd like to poll and the frequency at which you'd like to run the source in the <code>timer</code> object. In this example, we'll run the source once every 60 seconds.</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> https://api.pipedream.com/v1/sources <span class="token punctuation">\</span>
  -H <span class="token string">"Authorization: Bearer XXX"</span> -vvv <span class="token punctuation">\</span>
  -H <span class="token string">"Content-Type: application/json"</span> <span class="token punctuation">\</span>
  -d <span class="token string">'{"key": "rss-new-item-in-feed", "name": "test-rss", "configured_props": { "url": "https://rss.m.pipedream.net", "timer": { "intervalSeconds": 60 }}}'</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p>If successful, you should get back a <code>200 OK</code> response from the API with the following payload:</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"dc_abc123"</span><span class="token punctuation">,</span>
    <span class="token property">"user_id"</span><span class="token operator">:</span> <span class="token string">"u_abc123"</span><span class="token punctuation">,</span>
    <span class="token property">"component_id"</span><span class="token operator">:</span> <span class="token string">"sc_abc123"</span><span class="token punctuation">,</span>
    <span class="token property">"configured_props"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">"url"</span><span class="token operator">:</span> <span class="token string">"https://rss.m.pipedream.net"</span><span class="token punctuation">,</span>
      <span class="token property">"timer"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">"cron"</span><span class="token operator">:</span> <span class="token null keyword">null</span><span class="token punctuation">,</span>
        <span class="token property">"interval_seconds"</span><span class="token operator">:</span> <span class="token number">60</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">"active"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">"created_at"</span><span class="token operator">:</span> <span class="token number">1589486978</span><span class="token punctuation">,</span>
    <span class="token property">"updated_at"</span><span class="token operator">:</span> <span class="token number">1589486978</span><span class="token punctuation">,</span>
    <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"your-name-here"</span><span class="token punctuation">,</span>
    <span class="token property">"name_slug"</span><span class="token operator">:</span> <span class="token string">"your-name-here"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><p>Visit <a href="https://pipedream.com/sources" target="_blank" rel="noopener noreferrer">https://pipedream.com/sources<ExternalLinkIcon/></a> to see your running source. You should see the source listed on the left with the name you specified in the API request.</p>
<h2 id="fetching-new-events" tabindex="-1"><a class="header-anchor" href="#fetching-new-events" aria-hidden="true">#</a> Fetching new events</h2>
<p>The RSS source polls your feed URL for items at the specified frequency. It emits new items as <strong>events</strong> of the following shape:</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"permalink"</span><span class="token operator">:</span> <span class="token string">"https://example.com/8161"</span><span class="token punctuation">,</span>
  <span class="token property">"guid"</span><span class="token operator">:</span> <span class="token string">"https://example.com/8161"</span><span class="token punctuation">,</span>
  <span class="token property">"title"</span><span class="token operator">:</span> <span class="token string">"Example post"</span><span class="token punctuation">,</span>
  <span class="token property">"link"</span><span class="token operator">:</span> <span class="token string">"https://example.com/8161"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h3 id="sse" tabindex="-1"><a class="header-anchor" href="#sse" aria-hidden="true">#</a> SSE</h3>
<p>You can subscribe to new events in real time by listening to the SSE stream tied to this source. Take the <code>id</code> from the API response above — <code>dc_abc123</code> in our example — and make a request to this endpoint:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> -H <span class="token string">"Authorization: Bearer &lt;api key>"</span> <span class="token punctuation">\</span>
  <span class="token string">"https://api.pipedream.com/sources/dc_abc123/sse"</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p><a href="/api/sse/" target="_blank" rel="noopener noreferrer">See the SSE docs for more detail on this interface<ExternalLinkIcon/></a>.</p>
<h3 id="rest-api" tabindex="-1"><a class="header-anchor" href="#rest-api" aria-hidden="true">#</a> REST API</h3>
<p>You can also fetch items in batch using the REST API. If you don't need to act on items in real time, and just need to fetch new items from the feed on a regular interval, you can fetch events like so:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> -H <span class="token string">"Authorization: Bearer &lt;api key>"</span> <span class="token punctuation">\</span>
  <span class="token string">"https://api.pipedream.com/v1/sources/dc_BVuN2Q/event_summaries"</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p><a href="/api/rest/#get-source-events" target="_blank" rel="noopener noreferrer">See the docs on the <code>/event_summaries</code> endpoint<ExternalLinkIcon/></a> for more details on the parameters it accepts. For example, you can pass a <code>limit</code> param to return only <code>N</code> results per page, and paginate over results using the <code>before</code> and <code>after</code> cursors described in the <a href="/api/rest/#pagination" target="_blank" rel="noopener noreferrer">pagination docs<ExternalLinkIcon/></a>.</p>
</template>
