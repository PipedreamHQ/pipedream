<template><h1 id="use-any-npm-package" tabindex="-1"><a class="header-anchor" href="#use-any-npm-package" aria-hidden="true">#</a> Use any npm package</h1>
<p>Next, let's replace the <strong>GET Request</strong> action with a code step that uses the <code>axios</code> npm package. This example builds on the workflow created in <a href="/quickstart/" target="_blank" rel="noopener noreferrer">previous sections<ExternalLinkIcon/></a> and will cover how to:</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#delete-a-step">Delete a step</RouterLink></li><li><RouterLink to="#use-an-npm-package-in-a-code-step">Use an npm package in a code step</RouterLink></li></ul></nav>
<div class="custom-container tip"><p class="custom-container-title">TIP</p>
<p>If you didn't complete the previous examples, we recommend you start from the <a href="/quickstart/" target="_blank" rel="noopener noreferrer">beginning of this guide<ExternalLinkIcon/></a>. If you still want to start here, <a href="https://pipedream.com/@gettingstarted/quickstart-make-outbound-http-requests-p_6lCQOLo" target="_blank" rel="noopener noreferrer">copy this workflow<ExternalLinkIcon/></a> and then follow the instructions below. If you have any issues completing this example, you can <a href="https://pipedream.com/@gettingstarted/quickstart-use-any-npm-package-p_pWCg5BP" target="_blank" rel="noopener noreferrer">view, copy and run a completed version<ExternalLinkIcon/></a>.</p>
</div>
<h3 id="delete-a-step" tabindex="-1"><a class="header-anchor" href="#delete-a-step" aria-hidden="true">#</a> Delete a step</h3>
<p>First, delete <code>steps.get_iss_position</code> by clicking the <strong>X</strong> button at the top right of the step.</p>
<p><img src="@source/quickstart/using-npm-packages/images/image-20210525175501367.png" alt="image-20210525175501367"></p>
<h3 id="use-an-npm-package-in-a-code-step" tabindex="-1"><a class="header-anchor" href="#use-an-npm-package-in-a-code-step" aria-hidden="true">#</a> Use an npm package in a code step</h3>
<p>Let's replace the action with a code step. Next, click the <strong>+</strong> button and add a <strong>Run Node.js code</strong> step to the spot where the action used to be (between the two other steps).</p>
<p><img src="@source/quickstart/using-npm-packages/images/image-20210525175626293.png" alt="image-20210525175626293"></p>
<p>Next, rename the step from <code>steps.nodejs</code> to <code>steps.get_iss_position</code>. Since we're replicating the behavior of the action we just deleted, the step name needs to be identical so the reference in <code>steps.respond</code> continues to work.</p>
<p><img src="@source/quickstart/using-npm-packages/images/rename-nodejs.gif" alt="rename-nodejs"></p>
<p>Next, add the following code to <code>steps.get_iss_position</code> to get the position of ISS using the <code>axios</code> npm package (more details below):</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> axios <span class="token keyword">from</span> <span class="token string">'axios'</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> response <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token function">axios</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">method</span><span class="token operator">:</span> <span class="token string">"GET"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">url</span><span class="token operator">:</span> <span class="token string">"http://api.open-notify.org/iss-now.json"</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>

<span class="token keyword">return</span> response<span class="token punctuation">.</span>data
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>Following is an explanation of what's happening in the code:</p>
<ol>
<li>First, we <code>import</code> the <code>axios</code> npm package to use it. There's no <code>npm install</code> or <code>package.json</code> required. Pipedream automatically installs any npm package you <code>import</code>.</li>
<li>We use <code>axios</code> to make a <code>GET</code> request to the open-notify.org API to get the latest position of the ISS (<a href="https://pipedream.com/docs/workflows/steps/code/async/" target="_blank" rel="noopener noreferrer">always remember to <code>await</code> promises<ExternalLinkIcon/></a>).</li>
<li>Finally, we <code>return</code> the API response to export it from the step. Data must be exported to inspect it and reference it in later workflow steps. We return <code>response.data</code> since the data we want to export is in the <code>data</code> key of the the <code>axios</code> response.</li>
</ol>
<p>Next, <strong>Deploy</strong> your changes and reload the endpoint URL in your browser. You should continue to see the latest ISS position returned.</p>
<p><img src="@source/quickstart/using-npm-packages/images/reload-iss-position.gif" alt="reload-iss-position"></p>
<p>Return to your workflow and select the event that corresponds with your most recent test. You should see the <code>steps.get_iss_position</code> code step output the ISS position similar to the <strong>GET Request</strong> action you just replaced.</p>
<p><img src="@source/quickstart/using-npm-packages/images/image-20210525181057299.png" alt="image-20210525181057299"></p>
<p><strong>Next, let's transform data returned by the ISS API and save it to Google Sheets.</strong></p>
<p style="text-align:center;">
<a :href="$withBase('/quickstart/add-data-to-google-sheets/')"><img src="@source/quickstart/next.png"></a>
</p></template>
