<template><h1 id="pipedream-platform-axios" tabindex="-1"><a class="header-anchor" href="#pipedream-platform-axios" aria-hidden="true">#</a> <code>@pipedream/platform</code> axios</h1>
<nav class="table-of-contents"><ul><li><RouterLink to="#why-pipedream-platform-axios">Why @pipedream/platform axios?</RouterLink></li><li><RouterLink to="#using-pipedream-platform-axios-in-component-actions">Using @pipedream/platform axios in component actions</RouterLink></li></ul></nav>
<h2 id="why-pipedream-platform-axios" tabindex="-1"><a class="header-anchor" href="#why-pipedream-platform-axios" aria-hidden="true">#</a> Why <code>@pipedream/platform</code> axios?</h2>
<p><code>axios</code> is an HTTP client for Node.js (<a href="/workflows/steps/code/nodejs/http-requests/" target="_blank" rel="noopener noreferrer">see these docs<ExternalLinkIcon/></a> for usage examples).</p>
<p><code>axios</code> has a simple programming API and works well for most use cases. But its default error handling behavior isn't easy to use. When you make an HTTP request and the server responds with an error code in the 4XX or 5XX range of status codes, <code>axios</code> returns this stack trace:</p>
<div>
<img alt="default axios stack trace" src="@source/pipedream-axios/images/default-axios-stack.png">
</div>
<p>This only communicates the error code, and not any other information (like the body or headers) returned from the server.</p>
<p>Pipedream publishes an <code>axios</code> wrapper as a part of <a href="https://github.com/PipedreamHQ/platform" target="_blank" rel="noopener noreferrer">the <code>@pipedream/platform</code> package<ExternalLinkIcon/></a>. This presents the same programming API as <code>axios</code>, but implements two helpful features:</p>
<ol>
<li>When the HTTP request succeeds (response code &lt; <code>400</code>), it returns only the <code>data</code> property of the response object — the HTTP response body. This is typically what users want to see when they make an HTTP request:</li>
</ol>
<div>
<img alt="pipedream axios success case" width="300px" src="@source/pipedream-axios/images/pipedream-axios-success.png">
</div>
<ol start="2">
<li>When the HTTP request <em>fails</em> (response code &gt;= <code>400</code>), it displays a detailed error message in the Pipedream UI (the HTTP response body), and returns the whole <code>axios</code> response object so users can review details on the HTTP request and response:</li>
</ol>
<div>
<img alt="pipedream axios error case" src="@source/pipedream-axios/images/pipedream-axios-stack.png">
</div>
<h2 id="using-pipedream-platform-axios-in-component-actions" tabindex="-1"><a class="header-anchor" href="#using-pipedream-platform-axios-in-component-actions" aria-hidden="true">#</a> Using <code>@pipedream/platform</code> axios in component actions</h2>
<p>To use <code>@pipedream/platform</code> axios in component actions, import it:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> axios <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@pipedream/platform"</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p><code>@pipedream/platform</code> axios uses methods <a href="/components/api/#actions" target="_blank" rel="noopener noreferrer">provided by the <code>$</code> object<ExternalLinkIcon/></a>, so you'll need to pass that as the first argument to <code>axios</code> when making HTTP requests, and pass the <a href="https://github.com/axios/axios#request-config" target="_blank" rel="noopener noreferrer">standard <code>axios</code> request config<ExternalLinkIcon/></a> as the second argument.</p>
<p>Here's an example action:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> axios <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@pipedream/platform"</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"my-test-component"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"My Test component"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">"0.0.1"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"action"</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">await</span> <span class="token function">axios</span><span class="token punctuation">(</span>$<span class="token punctuation">,</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">url</span><span class="token operator">:</span> <span class="token string">"https://httpstat.us/200"</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br></div></div></template>
