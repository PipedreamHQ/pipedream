<template><h1 id="actions-legacy" tabindex="-1"><a class="header-anchor" href="#actions-legacy" aria-hidden="true">#</a> Actions (legacy)</h1>
<div class="custom-container danger"><p class="custom-container-title">DANGER</p>
<p>There is a <a href="https://pipedream.com/community/t/actions-improved-open-source-now-in-beta/606" target="_blank" rel="noopener noreferrer">new version<ExternalLinkIcon/></a> of Pipedream Actions available.  Legacy Actions will be deprecated.  Get started with our <a href="/components/quickstart/nodejs/actions/" target="_blank" rel="noopener noreferrer">quickstart<ExternalLinkIcon/></a> for new actions or learn how to <a href="/components/migrating/" target="_blank" rel="noopener noreferrer">migrate<ExternalLinkIcon/></a> legacy actions.</p>
</div>
<p>Actions are reusable <a href="/workflows/steps/code/" target="_blank" rel="noopener noreferrer">code<ExternalLinkIcon/></a> steps that integrate your apps, data and APIs. For example, you can send HTTP requests to an external service using the <a href="/destinations/http/" target="_blank" rel="noopener noreferrer">HTTP action<ExternalLinkIcon/></a>, or use actions to send data to Slack, <a href="/destinations/s3/" target="_blank" rel="noopener noreferrer">Amazon S3<ExternalLinkIcon/></a>, and more. You can use thousands of actions across 100+ apps today.</p>
<p>Typically, integrating with these services requires a lot of code to manage connection logic, error handling, etc. Actions handle that for you. You only need to specify the parameters required for the Action — for example, for the <a href="/destinations/http/" target="_blank" rel="noopener noreferrer">HTTP action<ExternalLinkIcon/></a>, what data you want to send and the URL you want to send it to.</p>
<p><strong>You can also create your own actions that can be shared across your own workflows, or published to all Pipedream users</strong>.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#using-existing-actions">Using Existing Actions</RouterLink></li><li><RouterLink to="#creating-your-own-actions">Creating your own actions</RouterLink><ul><li><RouterLink to="#converting-existing-code-steps-to-actions">Converting existing code steps to actions</RouterLink></li><li><RouterLink to="#save-vs-publish">Save vs. Publish</RouterLink></li><li><RouterLink to="#how-actions-are-associated-with-apps">How actions are associated with apps</RouterLink></li><li><RouterLink to="#versioning">Versioning</RouterLink></li><li><RouterLink to="#limitations">Limitations</RouterLink></li></ul></li></ul></nav>
<h2 id="using-existing-actions" tabindex="-1"><a class="header-anchor" href="#using-existing-actions" aria-hidden="true">#</a> Using Existing Actions</h2>
<ul>
<li>
<p>Actions are executed in the order they appear in your workflow.</p>
</li>
<li>
<p>You can reference the <a href="/workflows/events/" target="_blank" rel="noopener noreferrer"><code>event</code><ExternalLinkIcon/></a>, <a href="/workflows/steps/#step-exports" target="_blank" rel="noopener noreferrer"><code>steps</code><ExternalLinkIcon/></a>, and <a href="/environment-variables/#referencing-environment-variables-in-code" target="_blank" rel="noopener noreferrer"><code>process.env</code><ExternalLinkIcon/></a> variables when passing <a href="/workflows/steps/#passing-data-to-steps-step-parameters" target="_blank" rel="noopener noreferrer">params<ExternalLinkIcon/></a> to an action.</p>
</li>
<li>
<p>Action return values and <a href="/workflows/steps/#step-exports" target="_blank" rel="noopener noreferrer">exports<ExternalLinkIcon/></a> may be referenced in later steps via the <code>steps</code> object.</p>
</li>
<li>
<p>You can add multiple Actions within a single workflow (for example to send data to multiple S3 buckets <em>and</em> an HTTP endpoint). Actions can be added at any point in your workflow.</p>
</li>
</ul>
<p>Let's use the <a href="/destinations/http/" target="_blank" rel="noopener noreferrer">Send HTTP Request<ExternalLinkIcon/></a> action to send an HTTP request from a workflow. First, <strong>add a new Action to your workflow by clicking on the + button between any two steps</strong>.</p>
<p>Choose the <strong>Send HTTP Request</strong> action:</p>
<div>
<img alt="Send HTTP request action" width="600" src="@source/workflows/steps/actions/images/send-http-request.png">
</div>
<p>This action has one required parameter: the <strong>URL</strong> where you want to send the HTTP request.</p>
<p>This action defaults to sending an HTTP <code>POST</code> request. If you'd like to change the HTTP method, add an HTTP payload, query string parameters or headers, you can click the <strong>add individual property</strong> field above the form fields and select the appropriate parameter:</p>
<div>
<img alt="Adding optional params" width="600" src="@source/workflows/steps/actions/images/http-example.png">
</div>
<h2 id="creating-your-own-actions" tabindex="-1"><a class="header-anchor" href="#creating-your-own-actions" aria-hidden="true">#</a> Creating your own actions</h2>
<p>You can author and publish your own actions at <a href="https://pipedream.com/actions" target="_blank" rel="noopener noreferrer">https://pipedream.com/actions<ExternalLinkIcon/></a>, accessible from the <strong>Actions</strong> link in the header.</p>
<p>This video describes how to create an action end-to-end, including how to pass <a href="/workflows/steps/#passing-data-to-steps-step-parameters" target="_blank" rel="noopener noreferrer">params<ExternalLinkIcon/></a> to that action, how to associate actions with apps, and more:</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/bTchIr3HYQg" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<p>For example, let's say I wanted to publish my own <strong>Send a Slack Message</strong> action, using Slack's <code>@slack/web-api</code> npm package instead of the HTTP API.</p>
<p>I'd go to the <strong>Action</strong> header, click <strong>New</strong>, and start writing code:</p>
<div>
<img alt="Send a Slack message" src="@source/workflows/steps/actions/images/send-slack-message.png">
</div>
<p>Actions have a title, a default <a href="/workflows/steps/#step-names" target="_blank" rel="noopener noreferrer">step name<ExternalLinkIcon/></a>, a description, and code.</p>
<p>Actions are just code steps: you can write any Node.js code, <a href="https://docs.pipedream.com/connected-accounts/#connecting-accounts" target="_blank" rel="noopener noreferrer">connect apps<ExternalLinkIcon/></a>, <a href="https://docs.pipedream.com/workflows/steps/#passing-data-to-steps-step-parameters" target="_blank" rel="noopener noreferrer">define params<ExternalLinkIcon/></a>, and more. <strong>Unlike normal code steps, actions can be used across workflows and shared with other users</strong>. This reusability is powerful, and others benefit in huge ways from the actions you share.</p>
<h3 id="converting-existing-code-steps-to-actions" tabindex="-1"><a class="header-anchor" href="#converting-existing-code-steps-to-actions" aria-hidden="true">#</a> Converting existing code steps to actions</h3>
<p>Often you'll have an existing code step that you want to convert to an action to reuse in other workflows. <strong>There are a few restrictions Pipedream imposes on actions to promote reusability</strong>.</p>
<h4 id="replace-references-to-event-and-steps-with-params" tabindex="-1"><a class="header-anchor" href="#replace-references-to-event-and-steps-with-params" aria-hidden="true">#</a> Replace references to <code>event</code> and <code>steps</code> with <code>params</code></h4>
<p>When you convert a step to an action, you lose access to the variables <code>event</code> and <code>steps</code> within your code. Actions must receive all input from <a href="/workflows/steps/params/" target="_blank" rel="noopener noreferrer"><code>params</code><ExternalLinkIcon/></a> or <a href="/workflows/steps/code/auth/" target="_blank" rel="noopener noreferrer"><code>auths</code><ExternalLinkIcon/></a>.</p>
<p>Since actions can be used in any workflow, access to specific <code>event</code> data isn't guaranteed: for example, the shape of the <code>event</code> variable for the Cron and HTTP trigger is different. And since an action can be placed anywhere in a workflow, you can't ensure the action will have access to specific steps in the <code>steps</code> variable. Any user can rename a step, which would also break references to the <code>steps</code> variable in the action.</p>
<p>For example, if you've written a code step that references the variable <code>event.body.name</code>:</p>
<div>
<img alt="Normal code step with reference to event" width="400px" src="@source/workflows/steps/actions/images/normal-code-step.png">
</div>
<p>you'll need to reference <code>params.name</code> when you convert your step to an action, instead. This will expose a <a href="/workflows/steps/params/" target="_blank" rel="noopener noreferrer">param<ExternalLinkIcon/></a> where the user can enter <em>their</em> specific reference to the variable that contains the name, which would be <code>event.body.name</code> or another variable entirely:</p>
<div>
<img alt="action with reference to param" width="400px" src="@source/workflows/steps/actions/images/code-step-converted-to-action.png">
</div>
<h4 id="replace-references-to-checkpoint-with-this-checkpoint" tabindex="-1"><a class="header-anchor" href="#replace-references-to-checkpoint-with-this-checkpoint" aria-hidden="true">#</a> Replace references to <code>$checkpoint</code> with <code>this.$checkpoint</code></h4>
<p>Code steps normally have access to <a href="/workflows/steps/code/state/#workflow-level-state-checkpoint" target="_blank" rel="noopener noreferrer">workflow state<ExternalLinkIcon/></a> using the variable <code>$checkpoint</code>. But since actions run in different workflows, you don't know whether a user is referencing their own data in <code>$checkpoint</code>. References like this could delete a user's existing <code>$checkpoint</code> data:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code>$checkpoint <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">newData</span><span class="token operator">:</span> <span class="token string">"newValue"</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>Instead, replace <code>$checkpoint</code> references with <a href="/workflows/steps/code/state/#step-level-state-this-checkpoint" target="_blank" rel="noopener noreferrer"><code>this.$checkpoint</code><ExternalLinkIcon/></a>. <code>this.$checkpoint</code> sets state <strong>within a step</strong>, so it's safe to use in actions.</p>
<h3 id="save-vs-publish" tabindex="-1"><a class="header-anchor" href="#save-vs-publish" aria-hidden="true">#</a> Save vs. Publish</h3>
<p><strong>Saving</strong> an action makes the action available within any workflow in your account. Saving <em>does not</em> make the action available to anyone else.</p>
<p>When you press the <strong>Publish</strong> button, this makes the action available to everyone.</p>
<h3 id="how-actions-are-associated-with-apps" tabindex="-1"><a class="header-anchor" href="#how-actions-are-associated-with-apps" aria-hidden="true">#</a> How actions are associated with apps</h3>
<p>If you've linked one or more apps (click the <strong>+</strong> sign to the left of the code), the action will be associated with that app, so when you search for the action when adding a new step, it'll show up under Github, Slack, etc.</p>
<p>Otherwise, if you haven't linked an app to the action, it'll show up under the <strong>Non-app actions</strong>:</p>
<h3 id="versioning" tabindex="-1"><a class="header-anchor" href="#versioning" aria-hidden="true">#</a> Versioning</h3>
<p>Actions are versioned: each time you publish a change, it increments the minor version number (actions have semantic versions of the form <code>[major].[minor]</code>).</p>
<p>For example, publishing an action for the first time cuts a <code>0.1</code> version of that action. All users will have access to version <code>0.1</code> of your action.</p>
<p>If you want to make a change, you can edit and save your action, and those changes will be available only to your account. Once you're ready to ship the new version, click <strong>Publish</strong> again. Now,</p>
<ul>
<li>Any workflows that are using version <code>0.1</code> of the action will continue using that version.</li>
<li>Any time a user searches for your action in a <em>new</em> step, they'll see the most recent version of the action (<code>0.2</code>).</li>
</ul>
<p>You can change the version in any manner you'd like before publishing that new version. For example, you can increment the major version of the action if you're introducing a breaking change.</p>
<h3 id="limitations" tabindex="-1"><a class="header-anchor" href="#limitations" aria-hidden="true">#</a> Limitations</h3>
<p>Action code cannot reference environment variables (for example, using <code>process.env</code>). Since actions can be used by anyone, it's not guaranteed that a user would have a specific variable set in their environment. Therefore, actions that use environment variables are unlikely to work for someone else.</p>
<p>Instead, write your action to accept inputs via <a href="/workflows/steps/#passing-data-to-steps-step-parameters" target="_blank" rel="noopener noreferrer">step params<ExternalLinkIcon/></a>.</p>
<Footer />
</template>
