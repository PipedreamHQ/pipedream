<template><h1 id="destinations" tabindex="-1"><a class="header-anchor" href="#destinations" aria-hidden="true">#</a> Destinations</h1>
<p><strong>Destinations</strong>, like <a href="/components/actions/" target="_blank" rel="noopener noreferrer">actions<ExternalLinkIcon/></a>, abstract the delivery and connection logic required to send events to services like Amazon S3, or targets like HTTP and email.</p>
<p>However, Destinations are different than actions in two ways:</p>
<ul>
<li><strong>Events are delivered to the Destinations asynchronously</strong>, after your workflow completes. This means you don't wait for network I/O (e.g. for HTTP requests or connection overhead for data warehouses) within your workflow code, so you can process more events faster.</li>
<li>In the case of data stores like S3, you typically don't want to send every event on its own. This can be costly and carries little benefit. <strong>Instead, you typically want to batch a collection of events together, sending the batch at some frequency. Destinations handle that batching for relevant services</strong>.</li>
</ul>
<p>The docs below discuss features common to all Destinations. See the <a href="#available-destinations">docs for a given destination</a> for information specific to those destinations.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#available-destinations">Available Destinations</RouterLink></li><li><RouterLink to="#using-destinations">Using destinations</RouterLink><ul><li><RouterLink to="#using-destinations-in-workflows">Using destinations in workflows</RouterLink></li><li><RouterLink to="#using-destinations-in-actions">Using destinations in actions</RouterLink></li></ul></li><li><RouterLink to="#asynchronous-delivery">Asynchronous Delivery</RouterLink></li></ul></nav>
<h2 id="available-destinations" tabindex="-1"><a class="header-anchor" href="#available-destinations" aria-hidden="true">#</a> Available Destinations</h2>
<ul>
<li><a href="/destinations/http/" target="_blank" rel="noopener noreferrer">HTTP<ExternalLinkIcon/></a></li>
<li><a href="/destinations/email/" target="_blank" rel="noopener noreferrer">Email<ExternalLinkIcon/></a></li>
<li><a href="/destinations/s3/" target="_blank" rel="noopener noreferrer">S3<ExternalLinkIcon/></a></li>
<li><a href="/destinations/sql/" target="_blank" rel="noopener noreferrer">Pipedream Data Warehouse<ExternalLinkIcon/></a></li>
<li><a href="/destinations/sse/" target="_blank" rel="noopener noreferrer">SSE<ExternalLinkIcon/></a></li>
</ul>
<h2 id="using-destinations" tabindex="-1"><a class="header-anchor" href="#using-destinations" aria-hidden="true">#</a> Using destinations</h2>
<h3 id="using-destinations-in-workflows" tabindex="-1"><a class="header-anchor" href="#using-destinations-in-workflows" aria-hidden="true">#</a> Using destinations in workflows</h3>
<p>You can send data to Destinations in <a href="/workflows/steps/code/" target="_blank" rel="noopener noreferrer">Node.js code steps<ExternalLinkIcon/></a>, too, using <code>$.send</code> functions.</p>
<p><code>$.send</code> is an object provided by Pipedream that exposes destination-specific functions like <code>$.send.http()</code>, <code>$.send.s3()</code>, and more. <strong>This allows you to send data to destinations programmatically, if you need more control than the default actions provide</strong>.</p>
<p>Let's use <code>$.send.http()</code> to send an HTTP POST request like we did in the Action example above. <a href="/components/actions/#adding-a-new-action" target="_blank" rel="noopener noreferrer">Add a new Action<ExternalLinkIcon/></a>, then search for &quot;<strong>Run Node.js code</strong>&quot;:</p>
<p><a href="https://requestbin.com" target="_blank" rel="noopener noreferrer">Create an endpoint URL<ExternalLinkIcon/></a>, adding the code below to your code step, with the URL you created:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> steps<span class="token punctuation">,</span> $<span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    $<span class="token punctuation">.</span>send<span class="token punctuation">.</span><span class="token function">http</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">method</span><span class="token operator">:</span> <span class="token string">"POST"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">url</span><span class="token operator">:</span> <span class="token string">"[YOUR URL HERE]"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Luke Skywalker"</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>See the docs for the <a href="/destinations/http/" target="_blank" rel="noopener noreferrer">HTTP destination<ExternalLinkIcon/></a> to learn more about all the options you can pass to the <code>$.send.http()</code> function.</p>
<p>Again, it's important to remember that <strong>Destination delivery is asynchronous</strong>. If you iterate over an array of values and send an HTTP request for each:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> steps<span class="token punctuation">,</span> $<span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> names <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">"Luke"</span><span class="token punctuation">,</span> <span class="token string">"Han"</span><span class="token punctuation">,</span> <span class="token string">"Leia"</span><span class="token punctuation">,</span> <span class="token string">"Obi Wan"</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">const</span> name <span class="token keyword">of</span> names<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      $<span class="token punctuation">.</span>send<span class="token punctuation">.</span><span class="token function">http</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">method</span><span class="token operator">:</span> <span class="token string">"POST"</span><span class="token punctuation">,</span>
        <span class="token literal-property property">url</span><span class="token operator">:</span> <span class="token string">"[YOUR URL HERE]"</span><span class="token punctuation">,</span>
        <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          name<span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p>you won't have to <code>await</code> the execution of the HTTP requests in your workflow. We'll collect every <code>$.send.http()</code> call and defer those HTTP requests, sending them after your workflow finishes.</p>
<h3 id="using-destinations-in-actions" tabindex="-1"><a class="header-anchor" href="#using-destinations-in-actions" aria-hidden="true">#</a> Using destinations in actions</h3>
<p>If you're authoring a <a href="/components/actions/" target="_blank" rel="noopener noreferrer">component action<ExternalLinkIcon/></a>, you can deliver data to destinations, too. <code>$.send</code> isn't directly available to actions like it is for workflow code steps. <strong>Instead, you use <code>$.send</code> to access the destination-specific functions</strong>:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Action Demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"action_demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">"0.0.1"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"action"</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    $<span class="token punctuation">.</span>send<span class="token punctuation">.</span><span class="token function">http</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">method</span><span class="token operator">:</span> <span class="token string">"POST"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">url</span><span class="token operator">:</span> <span class="token string">"[YOUR URL HERE]"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">data</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Luke Skywalker"</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p><a href="/components/api/#actions" target="_blank" rel="noopener noreferrer">See the component action API docs<ExternalLinkIcon/></a> for more details.</p>
<h2 id="asynchronous-delivery" tabindex="-1"><a class="header-anchor" href="#asynchronous-delivery" aria-hidden="true">#</a> Asynchronous Delivery</h2>
<p>Events are delivered to destinations <em>asynchronously</em> — that is, separate from the execution of your workflow. <strong>This means you're not waiting for network or connection I/O in the middle of your function, which can be costly</strong>.</p>
<p>Some destination payloads, like HTTP, are delivered within seconds. For other destinations, like S3 and SQL, we collect individual events into a batch and send the batch to the destination. See the <a href="#available-destinations">docs for a specific destination</a> for the relevant batch delivery frequency.</p>
<Footer />
</template>
