<template><h1 id="run-workflow-on-a-schedule" tabindex="-1"><a class="header-anchor" href="#run-workflow-on-a-schedule" aria-hidden="true">#</a> Run workflow on a schedule</h1>
<p>Next, let's run a workflow on a schedule to keep our HTTP triggered workflow &quot;warm&quot; (<a href="https://pipedream.com/docs/workflows/events/cold-starts/" target="_blank" rel="noopener noreferrer">learn more<ExternalLinkIcon/></a> about &quot;cold starts&quot; and the value of keeping workflows &quot;warm&quot;). <strong>Note:</strong> Most use cases do not require keeping a workflow &quot;warm&quot; — we're using the example to demonstrate how to use the <strong>Schedule</strong> trigger. This example builds on the workflow created in <a href="/quickstart/" target="_blank" rel="noopener noreferrer">previous sections<ExternalLinkIcon/></a> and will cover how to:</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#create-a-workflow-using-the-schedule-trigger">Create a workflow using the schedule trigger</RouterLink></li><li><RouterLink to="#test-a-scheduled-workflow">Test a scheduled workflow</RouterLink></li><li><RouterLink to="#configure-a-schedule">Configure a schedule</RouterLink></li></ul></nav>
<div class="custom-container tip"><p class="custom-container-title">TIP</p>
<p>If you didn't complete the previous examples, we recommend you start from the <a href="/quickstart/" target="_blank" rel="noopener noreferrer">beginning of this guide<ExternalLinkIcon/></a>. If you still want to start here, <a href="https://pipedream.com/@gettingstarted/quickstart-use-connected-accounts-in-code-p_ezCVLgy" target="_blank" rel="noopener noreferrer">copy this workflow<ExternalLinkIcon/></a> and then follow the instructions below. If you have any issues completing this example, you can view, copy and run completed versions: <a href="https://pipedream.com/@gettingstarted/quickstart-run-workflow-on-a-schedule-1-2-p_n1Co22e" target="_blank" rel="noopener noreferrer">Scheduled Workflow<ExternalLinkIcon/></a>, <a href="https://pipedream.com/@gettingstarted/quickstart-run-workflow-on-a-schedule-2-2-p_NMCBZZ7" target="_blank" rel="noopener noreferrer">Updated HTTP Triggered Workflow<ExternalLinkIcon/></a>.</p>
</div>
<h3 id="create-a-workflow-using-the-schedule-trigger" tabindex="-1"><a class="header-anchor" href="#create-a-workflow-using-the-schedule-trigger" aria-hidden="true">#</a> Create a workflow using the schedule trigger</h3>
<p>First, create a new workflow. Then name it <code>Schedule Quickstart</code> and select the <strong>Schedule</strong> trigger (we'll modify the HTTP triggered workflow in a moment, <strong>so we recommend creating this workflow in a separate tab</strong>):</p>
<p><img src="@source/quickstart/run-workflow-on-a-schedule/images/image-20210525190912450.png" alt="image-20210525190912450"></p>
<p>Next, expand the step menu and select the <strong>GET Request</strong> action in the <strong>HTTP / Webhook</strong> app.</p>
<p><img src="@source/quickstart/run-workflow-on-a-schedule/images/image-20210525190953091.png" alt="image-20210525190953091"></p>
<p>Enter the endpoint URL to trigger the workflow you built in the previous examples and add <code>/keepwarm</code> to the path (e.g., <code>https://YOUR-ENDPOINT-ID.m.pipedream.net/keepwarm</code>).</p>
<p><img src="@source/quickstart/run-workflow-on-a-schedule/images/image-20210525191155803.png" alt="image-20210525191155803"></p>
<h3 id="test-a-scheduled-workflow" tabindex="-1"><a class="header-anchor" href="#test-a-scheduled-workflow" aria-hidden="true">#</a> Test a scheduled workflow</h3>
<p>Next, <strong>Deploy</strong> and click <strong>Run Now</strong> to test your workflow.</p>
<p><img src="@source/quickstart/run-workflow-on-a-schedule/images/image-20210525191406036.png" alt="image-20210525191406036"></p>
<p>When you inspect the execution, you'll notice that <code>steps.get_request</code> returned an array of objects. That means the HTTP workflow ran end-to-end — including getting the latest ISS position and adding it to Google Sheets:</p>
<p><img src="@source/quickstart/run-workflow-on-a-schedule/images/image-20210525191520789.png" alt="image-20210525191520789"></p>
<p>However, we don't want that to happen on our <code>/keepwarm</code> invocations. Let's fix that by adding a <code>$end()</code> statement to the HTTP workflow.</p>
<p>Switch back to your HTTP triggered workflow, select the most recent event and expand <code>steps.trigger.raw_event</code>. The <code>uri</code> for the request should be <code>/keepwarm</code>.</p>
<p><img src="@source/quickstart/run-workflow-on-a-schedule/images/image-20210525191622270.png" alt="image-20210525191622270"></p>
<p>Let's use that field for our filter. When requests are made to the <code>/keepwarm</code> path, let's respond with an HTTP <code>204</code> no content response and end the workflow invocation.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">if</span><span class="token punctuation">(</span>steps<span class="token punctuation">.</span>trigger<span class="token punctuation">.</span>raw_event<span class="token punctuation">.</span>uri <span class="token operator">===</span> <span class="token string">'/keepwarm'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">await</span> <span class="token function">$respond</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">status</span><span class="token operator">:</span> <span class="token number">204</span><span class="token punctuation">,</span>
    <span class="token literal-property property">immediate</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token function">$end</span><span class="token punctuation">(</span><span class="token string">"/keepwarm invocation"</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p><img src="@source/quickstart/run-workflow-on-a-schedule/images/image-20210525191725278.png" alt="image-20210525191725278"></p>
<p><strong>Deploy</strong> the HTTP workflow, return to the scheduled workflow and click <strong>Run Now</strong> again. This time, no content should be returned from <code>steps.get_request</code>:</p>
<p><img src="@source/quickstart/run-workflow-on-a-schedule/images/image-20210525191829397.png" alt="image-20210525191829397"></p>
<p>If you check the HTTP workflow, you should see the workflow execution ended at <code>steps.filter_keepwarm</code>:</p>
<p><img src="@source/quickstart/run-workflow-on-a-schedule/images/image-20210525191854260.png" alt="image-20210525191854260"></p>
<h3 id="configure-a-schedule" tabindex="-1"><a class="header-anchor" href="#configure-a-schedule" aria-hidden="true">#</a> Configure a schedule</h3>
<p>Finally, return to the scheduled workflow, configure it to run every 15 minutes, and <strong>Deploy</strong> to update trigger configuration:</p>
<p><img src="@source/quickstart/run-workflow-on-a-schedule/images/image-20210525191935400.png" alt="image-20210525191935400"></p>
<p>Your scheduled workflow will now run every 15 minutes — 24 hours a day, 7 days a week.</p>
<p><strong>Next, we'll create a workflow using an app trigger to run a workflow every time there is a new item in an RSS feed.</strong></p>
<p style="text-align:center;">
<a :href="$withBase('/quickstart/email-yourself/')"><img src="@source/quickstart/next.png"></a>
</p></template>
