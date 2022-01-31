<template><h1 id="rest-api-example-workflow-errors" tabindex="-1"><a class="header-anchor" href="#rest-api-example-workflow-errors" aria-hidden="true">#</a> REST API example: Workflow errors</h1>
<p>Any time your workflow throws an error, that error is sent to the <a href="/workflows/error-handling/global-error-workflow/" target="_blank" rel="noopener noreferrer">global error workflow<ExternalLinkIcon/></a>. By default, the global error workflow sends you an email with a summary of the error, but you can modify this workflow in any way you'd like (for example, you can send all errors to Slack or Discord, instead of email). This is helpful for most error-handling cases, but you'll often encounter cases the global error workflow can't cover.</p>
<p>For example, you may want to handle errors from one workflow differently from errors in another. Or, you might want to operate on errors using the API, instead of with a workflow. This doc shows you how to handle both of these example scenarios.</p>
<p>Before you jump into the examples below, remember that all Pipedream workflows are just Node.js code. You might be able to handle your error within a specific step, using JavaScript's <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch" target="_blank" rel="noopener noreferrer"><code>try / catch</code> statement<ExternalLinkIcon/></a>.</p>
<hr>
<nav class="table-of-contents"><ul><li><RouterLink to="#list-the-last-100-errors-from-the-rest-api">List the last 100 errors from the REST API</RouterLink></li><li><RouterLink to="#forward-errors-for-one-workflow-to-another-workflow">Forward errors for one workflow to another workflow</RouterLink></li></ul></nav>
<h2 id="list-the-last-100-errors-from-the-rest-api" tabindex="-1"><a class="header-anchor" href="#list-the-last-100-errors-from-the-rest-api" aria-hidden="true">#</a> List the last 100 errors from the REST API</h2>
<p>Pipedream provides a REST API endpoint to <a href="/api/rest/#get-workflow-errors" target="_blank" rel="noopener noreferrer">list the most recent 100 workflow errors<ExternalLinkIcon/></a> for any given workflow. For example, to list the errors from workflow <code>p_abc123</code>, run:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token string">'https://api.pipedream.com/v1/workflows/p_abc123/$errors/event_summaries?expand=event'</span> <span class="token punctuation">\</span>
  -H <span class="token string">'Authorization: Bearer &lt;api_key>'</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>By including the <code>expand=event</code> query string param, Pipedream will return the full error data, along with the original event that triggered your workflow:</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"page_info"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"total_count"</span><span class="token operator">:</span> <span class="token number">100</span><span class="token punctuation">,</span>
    <span class="token property">"start_cursor"</span><span class="token operator">:</span> <span class="token string">"1606370816223-0"</span><span class="token punctuation">,</span>
    <span class="token property">"end_cursor"</span><span class="token operator">:</span> <span class="token string">"1606370816223-0"</span><span class="token punctuation">,</span>
    <span class="token property">"count"</span><span class="token operator">:</span> <span class="token number">1</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"1606370816223-0"</span><span class="token punctuation">,</span>
      <span class="token property">"indexed_at_ms"</span><span class="token operator">:</span> <span class="token number">1606370816223</span><span class="token punctuation">,</span>
      <span class="token property">"event"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">"original_event"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"Luke"</span><span class="token punctuation">,</span>
          <span class="token property">"title"</span><span class="token operator">:</span> <span class="token string">"Jedi"</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token property">"original_context"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"1kodJIW7jVnKfvB2yp1OoPrtbFk"</span><span class="token punctuation">,</span>
          <span class="token property">"ts"</span><span class="token operator">:</span> <span class="token string">"2020-11-26T06:06:44.652Z"</span><span class="token punctuation">,</span>
          <span class="token property">"workflow_id"</span><span class="token operator">:</span> <span class="token string">"p_abc123"</span><span class="token punctuation">,</span>
          <span class="token property">"deployment_id"</span><span class="token operator">:</span> <span class="token string">"d_abc123"</span><span class="token punctuation">,</span>
          <span class="token property">"source_type"</span><span class="token operator">:</span> <span class="token string">"SDK"</span><span class="token punctuation">,</span>
          <span class="token property">"verified"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
          <span class="token property">"owner_id"</span><span class="token operator">:</span> <span class="token string">"u_abc123"</span><span class="token punctuation">,</span>
          <span class="token property">"platform_version"</span><span class="token operator">:</span> <span class="token string">"3.1.20"</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token property">"error"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token property">"code"</span><span class="token operator">:</span> <span class="token string">"InternalFailure"</span><span class="token punctuation">,</span>
          <span class="token property">"cellId"</span><span class="token operator">:</span> <span class="token string">"c_abc123"</span><span class="token punctuation">,</span>
          <span class="token property">"ts"</span><span class="token operator">:</span> <span class="token string">"2020-11-26T06:06:56.077Z"</span><span class="token punctuation">,</span>
          <span class="token property">"stack"</span><span class="token operator">:</span> <span class="token string">"    at Request.extractError ..."</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token property">"metadata"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">"emitter_id"</span><span class="token operator">:</span> <span class="token string">"p_abc123"</span><span class="token punctuation">,</span>
        <span class="token property">"emit_id"</span><span class="token operator">:</span> <span class="token string">"1kodKnAdWGeJyhqYbqyW6lEXVAo"</span><span class="token punctuation">,</span>
        <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"$errors"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br></div></div><p>By listing these errors, you may be able to replay them against your workflow programmatically. For example, if your workflow is triggered by HTTP requests, you can send an HTTP request with the data found in <code>event.original_event</code> (see the example above) for every event that errored.</p>
<h2 id="forward-errors-for-one-workflow-to-another-workflow" tabindex="-1"><a class="header-anchor" href="#forward-errors-for-one-workflow-to-another-workflow" aria-hidden="true">#</a> Forward errors for one workflow to another workflow</h2>
<p>Forwarding errors for a workflow to another workflow can be helpful in two situations:</p>
<ul>
<li>You want to run code to handle errors <em>for a specific workflow</em>, distinct from the default code that runs in the <a href="/workflows/error-handling/global-error-workflow/" target="_blank" rel="noopener noreferrer">global error workflow<ExternalLinkIcon/></a>.</li>
<li>You need access to more than the last 100 errors for a workflow. Sending each error to a workflow allows you to archive them (so you can replay the original event later, if necessary).</li>
</ul>
<p>Let's walk through an end-to-end example:</p>
<ol>
<li>Pick the workflow whose errors you'd like to manage and note its workflow ID. You can retrieve the ID of your workflow in your workflow's URL - it's the string <code>p_abc123</code> in <code>https://pipedream.com/@dylan/example-workflow-p_abc123/edit</code>.</li>
<li><a href="https://pipedream.com/new" target="_blank" rel="noopener noreferrer">Create a new workflow<ExternalLinkIcon/></a> with an <a href="/workflows/steps/triggers/#http" target="_blank" rel="noopener noreferrer">HTTP trigger<ExternalLinkIcon/></a>. This workflow will receive errors from the workflow in step #1. Note the ID for this workflow, as well.</li>
<li>A workflow can have multiple triggers. Here, you're going to add the errors from the workflow in step #1 as an additional trigger for the workflow you created in step #2. In other words, errors from workflow #1 will trigger workflow #2.</li>
</ol>
<p>Make the following request to the Pipedream API, replacing the <code>emitter_id</code> with the ID of workflow #1, and the <code>listener_id</code> with the ID of workflow #2.</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token string">'https://api.pipedream.com/v1/subscriptions?emitter_id=p_workflow1&amp;listener_id=p_workflow2&amp;event_name=$errors'</span> <span class="token punctuation">\</span>
  -X POST <span class="token punctuation">\</span>
  -H <span class="token string">"Authorization: Bearer &lt;api_key>"</span> <span class="token punctuation">\</span>
  -H <span class="token string">"Content-Type: application/json"</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><p><strong>You will not see this second, error trigger appear in the Pipedream UI for workflow #2</strong>. The Pipedream UI only lists the original, HTTP trigger, but you can <a href="/api/rest/#get-current-user-s-subscriptions" target="_blank" rel="noopener noreferrer">list your subscriptions<ExternalLinkIcon/></a> using the REST API.</p>
<ol start="4">
<li>Trigger an error from workflow #1. You can do this manually by adding a new Node.js code step and running:</li>
</ol>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">"test"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>You'll see an event arrive in workflow #2 with the <code>error</code>, the <code>original_event</code>, and <code>original_context</code>.</p>
<p><strong>You can handle errors in any way you'd like within this workflow</strong>. For example, you can save the error payload to a Google Sheet, or another data store, to store all errors for your workflow beyond the 100 returned by the Pipedream REST API.</p>
<Footer />
</template>
