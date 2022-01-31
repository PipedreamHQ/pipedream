<template><h1 id="make-outbound-http-requests" tabindex="-1"><a class="header-anchor" href="#make-outbound-http-requests" aria-hidden="true">#</a> Make outbound HTTP requests</h1>
<p>In the previous examples, we focused on catching inbound HTTP requests and manipulating the workflow response. Next, let's add an action step to make an outbound request from our workflow — we'll get data from a simple HTTP API and return the response from our workflow. This example builds on the workflow created in <a href="/quickstart/" target="_blank" rel="noopener noreferrer">previous sections<ExternalLinkIcon/></a> and will cover how to:</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#use-a-pre-built-action-to-make-an-http-request-from-your-workflow">Use a pre-built action to make an HTTP request from your workflow</RouterLink></li><li><RouterLink to="#inspect-the-exports-for-the-action-step">Inspect the exports for the action step</RouterLink></li><li><RouterLink to="#use-data-exported-by-the-action-in-the-workflow-response">Use data exported by the action in the workflow response</RouterLink></li></ul></nav>
<div class="custom-container tip"><p class="custom-container-title">TIP</p>
<p>If you didn't complete the previous examples, we recommend you start from the <a href="/quickstart/" target="_blank" rel="noopener noreferrer">beginning of this guide<ExternalLinkIcon/></a>. If you still want to start here, <a href="https://pipedream.com/@gettingstarted/quickstart-hello-name-p_WxCqxbR" target="_blank" rel="noopener noreferrer">copy this workflow<ExternalLinkIcon/></a> and then follow the instructions below. If you have any issues completing this example, you can <a href="https://pipedream.com/@gettingstarted/quickstart-make-outbound-http-requests-p_6lCQOLo" target="_blank" rel="noopener noreferrer">view, copy and run a completed version<ExternalLinkIcon/></a>.</p>
</div>
<h3 id="use-a-pre-built-action-to-make-an-http-request-from-your-workflow" tabindex="-1"><a class="header-anchor" href="#use-a-pre-built-action-to-make-an-http-request-from-your-workflow" aria-hidden="true">#</a> Use a pre-built action to make an HTTP request from your workflow</h3>
<p>First, click on the <strong>+</strong> sign between the two steps to open the step menu.</p>
<p><img src="@source/quickstart/make-http-request/images/image-20210525171237467.png" alt="image-20210525171237467"></p>
<p>Next, select the <strong>HTTP / Webhook</strong> app:</p>
<p><img src="@source/quickstart/make-http-request/images/image-20210525171326688.png" alt="image-20210525171326688"></p>
<p>Then select the <strong>GET Request</strong> action (to make an HTTP <code>GET</code> request):</p>
<p><img src="@source/quickstart/make-http-request/images/image-20210525171411902.png" alt="image-20210525171411902"></p>
<p>Next, enter <code>http://api.open-notify.org/iss-now.json</code> in the <strong>URL</strong> field. This URL is a free API provided by open-notify.org  to return the current position of the International Space Station (ISS). It does not require any authentication.</p>
<p><img src="@source/quickstart/make-http-request/images/image-20210525171518303.png" alt="image-20210525171518303"></p>
<p>Then, update the step name from <code>steps.get_request</code> to <code>steps.get_iss_position</code>. <strong>This is important — if you don't update the name, the updates below that use data exported by this step will fail.</strong></p>
<p><img src="@source/quickstart/make-http-request/images/get_iss_position.gif" alt="get_iss_position"></p>
<p>Finally, click <strong>Deploy</strong> and then hit the <strong>Send Test Event</strong> button in the trigger to run the workflow so we can test our change (we don't need to make a live request from our web browser since we're not validating the workflow response with this test).</p>
<p><img src="@source/quickstart/make-http-request/images/image-20210525171621793.png" alt="image-20210525171621793"></p>
<h3 id="inspect-the-exports-for-the-action-step" tabindex="-1"><a class="header-anchor" href="#inspect-the-exports-for-the-action-step" aria-hidden="true">#</a> Inspect the exports for the action step</h3>
<p>Select the new event from the list to inspect the execution. The response from the <strong>GET Request</strong> action should be exported as <code>steps.get_iss_position.$return_value</code>. Expand the <code>iss_position</code> key to inspect the <code>latitude</code> and <code>longitude</code> returned by the API. If you run the workflow again, you'll see the position change for each execution:</p>
<p><img src="@source/quickstart/make-http-request/images/image-20210525171711647.png" alt="image-20210525171711647"></p>
<h3 id="use-data-exported-by-the-action-in-the-workflow-response" tabindex="-1"><a class="header-anchor" href="#use-data-exported-by-the-action-in-the-workflow-response" aria-hidden="true">#</a> Use data exported by the action in the workflow response</h3>
<p>Next, update <code>$respond()</code> in <code>steps.respond</code> to return <code>steps.get_iss_position.$return_value.iss_position</code> as the body of the workflow response:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">await</span> <span class="token function">$respond</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">status</span><span class="token operator">:</span> <span class="token number">200</span><span class="token punctuation">,</span>
  <span class="token literal-property property">immediate</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token literal-property property">body</span><span class="token operator">:</span> steps<span class="token punctuation">.</span>get_iss_position<span class="token punctuation">.</span>$return_value<span class="token punctuation">.</span>iss_position
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p><img src="@source/quickstart/make-http-request/images/image-20210525171805160.png" alt="image-20210525171805160"></p>
<p>Finally, <strong>Deploy</strong> and reload the endpoint for your workflow in your web browser. <code>hello foo!</code> should be replaced by the JSON representing the ISS position. Each time you load the endpoint the most recent position will be returned.</p>
<p><img src="@source/quickstart/make-http-request/images/get-iss-position.gif" alt="get-iss-position"></p>
<div class="custom-container tip"><p class="custom-container-title">TIP</p>
<p>If you get an error, make sure you renamed the <strong>GET Request</strong> action to <code>steps.get_iss_position</code></p>
</div>
<p><strong>Next, let's replace the GET Request action with a code step and use the <code>axios</code> npm package to get the position of the ISS.</strong></p>
<p style="text-align:center;">
<a :href="$withBase('/quickstart/using-npm-packages/')"><img src="@source/quickstart/next.png"></a>
</p></template>
