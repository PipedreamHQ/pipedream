<template><h1 id="settings" tabindex="-1"><a class="header-anchor" href="#settings" aria-hidden="true">#</a> Settings</h1>
<p>You can control workflow-specific settings in the <strong>Settings</strong> header, just above your workflow's code.</p>
<div>
<img alt="Workflow settings" src="@source/workflows/settings/images/workflow-settings.png">
</div>
<nav class="table-of-contents"><ul><li><RouterLink to="#errors">Errors</RouterLink></li><li><RouterLink to="#execution-controls">Execution Controls</RouterLink><ul><li><RouterLink to="#execution-timeout-limit">Execution Timeout Limit</RouterLink></li><li><RouterLink to="#memory">Memory</RouterLink></li><li><RouterLink to="#concurrency-and-throttling">Concurrency and Throttling</RouterLink></li></ul></li><li><RouterLink to="#attachments">Attachments</RouterLink><ul><li><RouterLink to="#limits">Limits</RouterLink></li></ul></li></ul></nav>
<h2 id="errors" tabindex="-1"><a class="header-anchor" href="#errors" aria-hidden="true">#</a> Errors</h2>
<p>By default, any errors raised in a workflow are sent to the <strong>Global Error Workflow</strong>. This workflow sends you an email with the details of this error, once per error, per workflow, per 24-hour period.</p>
<p>But the Global Error Workflow is just another workflow, and lives in your account. So you can modify it however you'd like. For example, you can send errors to Slack, or send critical issues to Pagerduty, or log all errors to a table in the <a href="/destinations/sql/" target="_blank" rel="noopener noreferrer">SQL service<ExternalLinkIcon/></a> for later analysis.</p>
<h2 id="execution-controls" tabindex="-1"><a class="header-anchor" href="#execution-controls" aria-hidden="true">#</a> Execution Controls</h2>
<h3 id="execution-timeout-limit" tabindex="-1"><a class="header-anchor" href="#execution-timeout-limit" aria-hidden="true">#</a> Execution Timeout Limit</h3>
<p>Workflows have a default <a href="/limits/#time-per-execution" target="_blank" rel="noopener noreferrer">execution limit<ExternalLinkIcon/></a>, which defines the time workflows can run for a single invocation until they're timed out.</p>
<p>If your workflow times out, and needs to run for longer than the <a href="/limits/#time-per-execution" target="_blank" rel="noopener noreferrer">default limit<ExternalLinkIcon/></a>, you can change that limit here.</p>
<h3 id="memory" tabindex="-1"><a class="header-anchor" href="#memory" aria-hidden="true">#</a> Memory</h3>
<p>By default, workflows run with <code>{{$site.themeConfig.MEMORY_LIMIT}}</code> of memory. If you're processing a lot of data in memory, you might need to raise that limit. Here, you can increase the memory of your workflow up to <code>{{$site.themeConfig.MEMORY_ABSOLUTE_LIMIT}}</code>.</p>
<p><strong>Pipedream charges invocations proportional to your memory configuration</strong>. When you modify your memory settings, Pipedream will show you the number of invocations you'll be charged per execution. <a href="/pricing/#how-does-workflow-memory-affect-billable-invocations" target="_blank" rel="noopener noreferrer">Read more here<ExternalLinkIcon/></a>.</p>
<h3 id="concurrency-and-throttling" tabindex="-1"><a class="header-anchor" href="#concurrency-and-throttling" aria-hidden="true">#</a> Concurrency and Throttling</h3>
<p><a href="/workflows/events/concurrency-and-throttling/" target="_blank" rel="noopener noreferrer">Manage the concurrency and rate<ExternalLinkIcon/></a> at which events from a source trigger your workflow code.</p>
<h2 id="attachments" tabindex="-1"><a class="header-anchor" href="#attachments" aria-hidden="true">#</a> Attachments</h2>
<p>Sometimes, you'll need to reference static files in your workflow, like a CSV. Files uploaded in the <strong>Attachments</strong> section can be referenced in your workflow using the <code>$attachments</code> object.</p>
<p>For example, if you upload a file named <code>test.csv</code>, Pipedream will expose the <em>file path</em> of the uploaded file at <code>$attachments[&quot;test.csv&quot;]</code>. You can read the contents of the file using <code>fs.readFileSync</code>:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> fs <span class="token keyword">from</span> <span class="token string">"fs"</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> fileData <span class="token operator">=</span> fs<span class="token punctuation">.</span><span class="token function">readFileSync</span><span class="token punctuation">(</span>$attachments<span class="token punctuation">[</span><span class="token string">"test.csv"</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>fileData<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><div>
<img alt="File attachment data" src="@source/workflows/settings/images/attachment-file-data.png">
</div>
<h3 id="limits" tabindex="-1"><a class="header-anchor" href="#limits" aria-hidden="true">#</a> Limits</h3>
<p>Each attachment is limited to <code>10MB</code> in size. The total size of all attachments within a single workflow cannot exceed <code>200MB</code>.</p>
</template>
