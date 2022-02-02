<template><h1 id="quickstart" tabindex="-1"><a class="header-anchor" href="#quickstart" aria-hidden="true">#</a> Quickstart</h1>
<p>Sign up for a <a href="https://pipedream.com/auth/signup" target="_blank" rel="noopener noreferrer">free Pipedream account (no credit card required)<ExternalLinkIcon/></a> and complete this quickstart guide to learn the basic patterns for workflow development:</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#create-a-new-workflow">Create a new workflow</RouterLink></li><li><RouterLink to="#add-an-http-webhook-trigger">Add an HTTP / Webhook trigger</RouterLink></li><li><RouterLink to="#send-data-to-the-workflow">Send data to the workflow</RouterLink></li><li><RouterLink to="#enrich-trigger-data-using-node-js-and-npm">Enrich trigger data using Node.js and npm</RouterLink></li><li><RouterLink to="#save-data-to-google-sheets">Save data to Google Sheets</RouterLink></li></ul></nav>
<h3 id="create-a-new-workflow" tabindex="-1"><a class="header-anchor" href="#create-a-new-workflow" aria-hidden="true">#</a> Create a new workflow</h3>
<p>First, create a new workflow by clicking <strong>New</strong> from <a href="https://pipedream.com/workflows" target="_blank" rel="noopener noreferrer">https://pipedream.com/workflows<ExternalLinkIcon/></a>:</p>
<p><img src="https://pipedream.com/docs/assets/img/image-20210516114638660.739caab0.png" alt="image-20210516114638660"></p>
<h3 id="add-an-http-webhook-trigger" tabindex="-1"><a class="header-anchor" href="#add-an-http-webhook-trigger" aria-hidden="true">#</a> Add an HTTP / Webhook trigger</h3>
<p>Pipedream will launch the workflow builder. For this example, select the <strong>HTTP / Webhook Requests</strong> trigger.</p>
<p><img src="@source/quickstart/image-20220123213843066.png" alt="./image-20220123213843066"></p>
<p>Click <strong>Continue</strong> to accept the default settings.</p>
<p><img src="@source/quickstart/image-20220123214244795.png" alt="./image-20220123214244795"></p>
<p>Pipedream will generate a unique URL to trigger this workflow.</p>
<p><img src="@source/quickstart/image-20220123214505923.png" alt="./image-20220123214505923"></p>
<h3 id="send-data-to-the-workflow" tabindex="-1"><a class="header-anchor" href="#send-data-to-the-workflow" aria-hidden="true">#</a> Send data to the workflow</h3>
<p>Next, send data to the trigger URL to help you build the workflow. For this example, send an HTTP POST request with a JSON body containing a simple message.</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"message"</span><span class="token operator">:</span> <span class="token string">"Pipedream is awesome!"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>You can edit and run the following <code>cURL</code> command (or use your favorite HTTP tool).</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> -d <span class="token string">'{
  "message": "Pipedream is awesome!"
}'</span>   -H <span class="token string">"Content-Type: application/json"</span>   YOUR-TRIGGER-URL-GOES-HERE
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>When Pipedream receives the request, it will display the contents of the HTTP request. Expand the <code>body</code> to validate that the message was received. <img src="@source/quickstart/image-20220123215443936.png" alt="./image-20220123215443936"></p>
<p>If you need to send a different event to your workflow you can select it from the event selector:</p>
<p><img src="@source/quickstart/image-20220123215558412.png" alt="./image-20220123215558412"></p>
<div class="custom-container tip"><p class="custom-container-title">TIP</p>
<p>The selected event will be used to provide autocomplete suggestion as you build your workflow. The data will also be used when testing later steps.</p>
</div>
<h3 id="enrich-trigger-data-using-node-js-and-npm" tabindex="-1"><a class="header-anchor" href="#enrich-trigger-data-using-node-js-and-npm" aria-hidden="true">#</a> Enrich trigger data using Node.js and npm</h3>
<p>Before we send data to Google Sheets, let's use the npm <a href="https://www.npmjs.com/package/sentiment" target="_blank" rel="noopener noreferrer"><code>sentiment</code><ExternalLinkIcon/></a> package to generate a sentiment score for our message. To do that, click <strong>Continue</strong> or the <strong>+</strong> button.</p>
<p><img src="@source/quickstart/image-20220123220018170.png" alt="./image-20220123220018170"></p>
<p>That will open the <strong>Add a step</strong> menu. Select <strong>Run custom code</strong>.</p>
<p><img src="@source/quickstart/image-20220123220128877.png" alt="./image-20220123220128877"></p>
<p>Pipedream will add a Node.js code step. Rename the step to <strong>sentiment</strong>.</p>
<p><img src="@source/quickstart/image-20220123221849231.png" alt="image-20220123221849231"></p>
<p>Next, add the following code to the code step:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> Sentiment <span class="token keyword">from</span> <span class="token string">"sentiment"</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> steps<span class="token punctuation">,</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> sentiment <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Sentiment</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> sentiment<span class="token punctuation">.</span><span class="token function">analyze</span><span class="token punctuation">(</span>steps<span class="token punctuation">.</span>trigger<span class="token punctuation">.</span>event<span class="token punctuation">.</span>body<span class="token punctuation">.</span>message<span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>This code imports the npm package, passes the message we sent to our trigger to the <code>analyze()</code> function by referencing <code>steps.trigger.event.body.message</code> and then returns the result.</p>
<div class="custom-container tip"><p class="custom-container-title">TIP</p>
<p>To use any npm package on Pipedream, just <code>import</code> it. There's no <code>npm install</code> or <code>package.json</code> required.</p>
</div>
<div class="custom-container tip"><p class="custom-container-title">TIP</p>
<p>Any data you <code>return</code> from a step is exported so it can be inspected and referenced it in future steps via the <code>steps</code> object. In this example, return values will be exported to <code>steps.sentiment.$return_value</code> because we renamed the step to <strong>sentiment</strong> .</p>
</div>
<p>Your code step should now look like the screenshot below. To run the step and test the code, click the <strong>Test</strong> button.</p>
<p><img src="@source/quickstart/image-20220123222340361.png" alt="image-20220123222340361"></p>
<p>You should see the results of the sentiment analysis when the test is complete.</p>
<p><img src="@source/quickstart/image-20220123222643042.png" alt="image-20220123222643042"></p>
<div class="custom-container tip"><p class="custom-container-title">TIP</p>
<p>When you <strong>Test</strong> a step, only the current step is executed. Use the caret to test different ranges of steps including the entire workflow.</p>
</div>
<h3 id="save-data-to-google-sheets" tabindex="-1"><a class="header-anchor" href="#save-data-to-google-sheets" aria-hidden="true">#</a> Save data to Google Sheets</h3>
<p>Next, create a Google Sheet and add <strong>Timestamp</strong>, <strong>Message</strong> and <strong>Sentiment Score</strong> to the first row. These labels will act as our column headers amd will help us configure the Google Sheets step of the workflow.</p>
<p><img src="@source/quickstart/image-20220125184754078.png" alt="image-20220125184754078"></p>
<p>Next, let's add a step to the workflow to send the data to Google Sheets. First, click <strong>+</strong> after the <code>sentiment</code> code step and select the <strong>Google Sheets</strong> app.</p>
<p><img src="@source/quickstart/image-20220125185156527.png" alt="image-20220125185156527"></p>
<p>Then select the <strong>Add Single Row</strong> action.</p>
<p><img src="@source/quickstart/image-20220125185305043.png" alt="image-20220125185305043"></p>
<p>Click to connect you Google Sheets account to Pipedream (or select it from the dropdown if you previously connected an account).</p>
<p><img src="@source/quickstart/image-20220125185354469.png" alt="image-20220125185354469"></p>
<p>Pipedream will open Google's sign in flow in a new window. Sign in with the account you want to connect.</p>
<img src="@source/quickstart/image-20220125185544800.png" alt="image-20220125185544800" style="zoom: 33%;" />
<div class="custom-container warning"><p class="custom-container-title">Important</p>
<p>If prompted, you must check the box for Pipedream to <strong>See, edit, create and delete all of your Google Drive files</strong>. These permissions are required for configure and use the pre-built actions for Google Sheets.</p>
<img src="@source/quickstart/image-20220125185952120.png" alt="image-20220125185952120" style="zoom:33%;" />
<p>Learn more about Pipedream's <a href="/privacy-and-security/" target="_blank" rel="noopener noreferrer">privacy and security policy<ExternalLinkIcon/></a>.</p>
</div>
<p>When you complete connecting your Google account, the window should close and you should return to Pipedream. Your connected account should automatically be selected. Next, select your spreadsheet from the dropdown menu:</p>
<p><img src="@source/quickstart/image-20220125190643112.png" alt="image-20220125190643112"></p>
<p>Then select the sheet name (the default sheet name in Google Sheets is <strong>Sheet1</strong>):</p>
<p><img src="@source/quickstart/image-20220125190740937.png" alt="image-20220125190740937"></p>
<p>Next, select if the spreadsheet has headers in the first row. When a header row exists, Pipedream will automatically retrieve the header labels to make it easy to enter data (if not, you can manually construct an array of values). Since the sheet for this example contains headers, select <strong>Yes</strong>.</p>
<p><img src="@source/quickstart/image-20220125191025880.png" alt="image-20220125191025880"></p>
<p>Pipedream will retrieve the headers and generate a form to enter data in your sheet:</p>
<p><img src="@source/quickstart/image-20220125191155907.png" alt="image-20220125191155907"></p>
<p>First, let's use the object explorer to pass the timestamp for the workflow event as the value for the first column. This data can be found in the context object on the trigger. When you click into the <strong>Timestamp</strong> field, Pipedream will display an object explorer to make it easy to find data. Scroll or search to find the <code>ts</code> key under <code>steps.trigger.context</code> and click <strong>select path</strong>. That will insert the reference <code>{{steps.trigger.context.ts}}</code>:</p>
<p><img src="@source/quickstart/image-20220125191627775.png" alt="image-20220125191627775"></p>
<p>Next, let's use autocomplete to enter a value for the <strong>Message</strong> column. First, add double braces <span v-pre>{{</span> — Pipedream will automatically add the closing braces <span v-pre>}}</span>. Then, type <code>steps.trigger.event.body.message</code> between the pairs of braces. Pipedream will provide autocomplete suggestions as you type. Press <strong>Tab</strong>  to use a suggestion and then click <code>.</code> to get suggestions for the next key. The final value in the <strong>Message</strong> field should be <span v-pre>{{steps.trigger.event.body.message}}</span>.</p>
<p><img src="@source/quickstart/image-20220125191907876.png" alt="image-20220125191907876"></p>
<p>Finally, let's copy a reference from a previous step. Scroll up to the <code>sentiment</code> step and click the <strong>Copy Path</strong> link next to the score.</p>
<p><img src="@source/quickstart/image-20220125192301634.png" alt="image-20220125192301634"></p>
<p>::: pre</p>
<p>Paste the value into the <strong>Sentiment Score</strong> field — Pipedream will automatically wrap the reference in double braces <code>{{ }}</code>.</p>
<p>:::</p>
<p><img src="@source/quickstart/image-20220125192410390.png" alt="image-20220125192410390"></p>
<p>Now that the configuration is complete, click <strong>Test</strong> to validate the configuration for this step. When the test is complete, you will see a success message and a summary of the action performed:</p>
<p><img src="@source/quickstart/image-20220125192709058.png" alt="image-20220125192709058"></p>
<p>If you load your spreadsheet, you should see the data Pipedream inserted.</p>
<p><img src="@source/quickstart/image-20220125192818879.png" alt="image-20220125192818879"></p>
<p>Next, return to your workflow. Before you deploy, customize the name of your workflow:</p>
<p><img src="@source/quickstart/image-20220125193340378.png" alt="image-20220125193340378"></p>
<p>Then click <strong>Deploy</strong> to run your workflow on every trigger event.</p>
<p><img src="@source/quickstart/image-20220125200445675.png" alt="image-20220125200445675"></p>
<p>When your workflow deploys, you will be redirected to the <strong>Inspector</strong>. Your workflow is now live.</p>
<p><img src="@source/quickstart/image-20220125193507453.png" alt="image-20220125193507453"></p>
<p>To validate your workflow is working as expected, send a new request to your workflow: You can edit and run the following <code>cURL</code> command:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> -d <span class="token string">'{
  "message": "Wow!!! Pipedream IS awesome and easy to use!!!"
}'</span>   -H <span class="token string">"Content-Type: application/json"</span>   YOUR-TRIGGER-URL-GOES-HERE
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>The event will instantly appear in the event list. Select it to inspect the workflow execution.</p>
<p><img src="@source/quickstart/image-20220125194354113.png" alt="image-20220125194354113"></p>
<p>Finally, you can return to Google Sheets to validate that the new data was automatically inserted.</p>
<p><img src="@source/quickstart/image-20220125194510308.png" alt="image-20220125194510308"></p>
<p>Congratulations! You completed the quickstart and should now understand the basic patterns for workflow development. Next, try creating your own workflows and check out the docs to learn more!</p>
</template>
