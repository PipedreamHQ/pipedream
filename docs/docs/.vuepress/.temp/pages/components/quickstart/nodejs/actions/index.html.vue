<template><h1 id="quickstart-action-development" tabindex="-1"><a class="header-anchor" href="#quickstart-action-development" aria-hidden="true">#</a> Quickstart: Action Development</h1>
<nav class="table-of-contents"><ul><li><RouterLink to="#overview">Overview</RouterLink></li><li><RouterLink to="#prerequisites">Prerequisites</RouterLink></li><li><RouterLink to="#walkthrough">Walkthrough</RouterLink><ul><li><RouterLink to="#hello-world">hello world!</RouterLink></li><li><RouterLink to="#hello-name">hello [name]!</RouterLink></li><li><RouterLink to="#use-an-npm-package">Use an npm Package</RouterLink></li><li><RouterLink to="#use-managed-auth">Use Managed Auth</RouterLink></li></ul></li><li><RouterLink to="#what-s-next">What&#39;s Next?</RouterLink></li></ul></nav>
<h2 id="overview" tabindex="-1"><a class="header-anchor" href="#overview" aria-hidden="true">#</a> Overview</h2>
<p>This document is intended for developers who want to author and edit <a href="/components/#actions" target="_blank" rel="noopener noreferrer">Pipedream Actions<ExternalLinkIcon/></a>. After completing this quickstart, you'll understand how to:</p>
<ul>
<li>Develop Pipedream components</li>
<li>Publish private actions and use them in workflows</li>
<li>Use props to capture user input</li>
<li>Update an action</li>
<li>Use npm packages</li>
<li>Use Pipedream managed auth for a 3rd party app</li>
</ul>
<div class="custom-container tip"><p class="custom-container-title">TIP</p>
<p>If you previously developed actions using Pipedream's UI, we recommend reviewing our <a href="/components/migrating/" target="_blank" rel="noopener noreferrer">migration guide<ExternalLinkIcon/></a> after completing this quickstart.</p>
</div>
<h2 id="prerequisites" tabindex="-1"><a class="header-anchor" href="#prerequisites" aria-hidden="true">#</a> Prerequisites</h2>
<ul>
<li>Create a free account at <a href="https://pipedream.com" target="_blank" rel="noopener noreferrer">https://pipedream.com<ExternalLinkIcon/></a></li>
<li>Download and install the <a href="/cli/install/" target="_blank" rel="noopener noreferrer">Pipedream CLI<ExternalLinkIcon/></a></li>
<li>Once the CLI is installed, <a href="/cli/login/#existing-pipedream-account" target="_blank" rel="noopener noreferrer">link your Pipedream account<ExternalLinkIcon/></a> to the CLI by running <code>pd login</code> in your terminal</li>
</ul>
<blockquote>
<p><strong>NOTE:</strong> See the <a href="/cli/reference/" target="_blank" rel="noopener noreferrer">CLI reference<ExternalLinkIcon/></a> for detailed usage and examples beyond those covered below.</p>
</blockquote>
<h2 id="walkthrough" tabindex="-1"><a class="header-anchor" href="#walkthrough" aria-hidden="true">#</a> Walkthrough</h2>
<p>We recommend that you complete the examples below in order.</p>
<p><strong>hello world! (~5 minutes)</strong></p>
<ul>
<li>Develop a <code>hello world!</code> action</li>
<li>Publish it (private to your account) using the Pipedream CLI</li>
<li>Add it to a workflow and run it</li>
</ul>
<p><strong>hello [name]! (~5 minutes)</strong></p>
<ul>
<li>Capture user input using a <code>string</code> prop</li>
<li>Publish a new version of your action</li>
<li>Update the action in your workflow</li>
</ul>
<p><strong>Use an npm Package (~5 mins)</strong></p>
<ul>
<li>Require the <code>axios</code> npm package</li>
<li>Make a simple API request</li>
<li>Export data returned by the API from your action</li>
</ul>
<p><strong>Use Managed Auth (~10 mins)</strong></p>
<ul>
<li>Use Pipedream managed OAuth for Github with the <code>octokit</code> npm package</li>
<li>Connect your Github account to the action in a Pipedream workflow</li>
<li>Retrieve details for a repo and return them from the action</li>
</ul>
<h3 id="hello-world" tabindex="-1"><a class="header-anchor" href="#hello-world" aria-hidden="true">#</a> hello world!</h3>
<p>The following code represents a simple component that can be published as an action (<a href="/components/api" target="_blank" rel="noopener noreferrer">learn more<ExternalLinkIcon/></a> about the component structure). When used in a workflow, it will export <code>hello world!</code> as the return value for the step.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Action Demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">"This is a demo action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"action_demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">"0.0.1"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">hello world!</span><span class="token template-punctuation string">`</span></span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>To get started, save the code to a local <code>.js</code> file (e.g., <code>action.js</code>) and run the following CLI command:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pd publish action.js
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>The CLI will publish the component as an action in your account with the key <code>action_demo</code>. <strong>The key must be unique across all components in your account (sources and actions). If it's not unique, the existing component with the matching key will be updated.</strong></p>
<p>The CLI output should look similar to this:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>sc_v4iaWB  Action Demo                             <span class="token number">0.0</span>.1    just now             action_demo
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>To test the action:</p>
<ol>
<li>
<p>Open Pipedream in your browser</p>
</li>
<li>
<p>Create a new workflow with a <strong>Schedule</strong> trigger</p>
</li>
<li>
<p>Click the <strong>+</strong> button to add a step to your workflow</p>
</li>
<li>
<p>Click on <strong>My Actions</strong> and then select the <strong>Action Demo</strong> action to add it to your workflow.
<img src="https://res.cloudinary.com/pipedreamin/image/upload/v1618550730/docs/components/image-20210411165325045_ia5sd5.png" alt="image-20210411165325045"></p>
</li>
<li>
<p>Deploy your workflow</p>
</li>
<li>
<p>Click <strong>RUN NOW</strong> to execute your workflow and action</p>
</li>
</ol>
<p>You should see <code>hello world!</code> returned as the value for <code>steps.action_demo.$return_value</code>.</p>
<p><img src="https://res.cloudinary.com/pipedreamin/image/upload/v1618550730/docs/components/image-20210411165443563_d6drvo.png" alt="image-20210411165443563"></p>
<p>Keep the browser tab open. We'll return to this workflow in the rest of the examples as we update the action.</p>
<h3 id="hello-name" tabindex="-1"><a class="header-anchor" href="#hello-name" aria-hidden="true">#</a> hello [name]!</h3>
<p>Next, let's update the component to capture some user input. First, add a <code>string</code> <a href="/components/api/#props" target="_blank" rel="noopener noreferrer">prop<ExternalLinkIcon/></a> called <code>name</code> to the component.</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code>export <span class="token keyword">default</span> <span class="token punctuation">{</span>
  name<span class="token operator">:</span> <span class="token string">"Action Demo"</span><span class="token punctuation">,</span>
  description<span class="token operator">:</span> <span class="token string">"This is a demo action"</span><span class="token punctuation">,</span>
  key<span class="token operator">:</span> <span class="token string">"action_demo"</span><span class="token punctuation">,</span>
  version<span class="token operator">:</span> <span class="token string">"0.0.1"</span><span class="token punctuation">,</span>
  type<span class="token operator">:</span> <span class="token string">"action"</span><span class="token punctuation">,</span>
  props<span class="token operator">:</span> <span class="token punctuation">{</span>
    name<span class="token operator">:</span> <span class="token punctuation">{</span>
      type<span class="token operator">:</span> <span class="token string">"string"</span><span class="token punctuation">,</span>
      label<span class="token operator">:</span> <span class="token string">"Name"</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  async <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> `hello world<span class="token operator">!</span>`
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><p>Next, update the <code>run()</code> function to reference <code>this.name</code> in the return value.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Action Demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">"This is a demo action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"action_demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">"0.0.1"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"string"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">label</span><span class="token operator">:</span> <span class="token string">"Name"</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">hello </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token keyword">this</span><span class="token punctuation">.</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">!</span><span class="token template-punctuation string">`</span></span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><p>Finally, update the component version to <code>0.0.2</code>. If you fail to update the version, the CLI will throw an error.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Action Demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">"This is a demo action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"action_demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">"0.0.2"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"string"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">label</span><span class="token operator">:</span> <span class="token string">"Name"</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">hello </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token keyword">this</span><span class="token punctuation">.</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">!</span><span class="token template-punctuation string">`</span></span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><p>Save the file and run the <code>pd publish</code> command again to update the action in your account.</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pd publish action.js
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>The CLI will update the component in your account with the key <code>action_demo</code>. You should see something like this:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>sc_Egip04  Action Demo                             <span class="token number">0.0</span>.2    just now             action_demo
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>Next, let's update the action in the workflow from the previous example and run it.</p>
<ol>
<li>
<p>Hover over the action in your workflow — you should see an update icon at the top right. Click the icon to update the action to the latest version and then save the workflow. If you don't see the icon, verify that the CLI successfully published the update or try refreshing the page.</p>
<p><img src="https://res.cloudinary.com/pipedreamin/image/upload/v1618550730/docs/components/image-20210411164514490_qghbzf.png" alt="image-20210411164514490"></p>
</li>
<li>
<p>After saving the workflow, you should see an input field appear. Enter a value for the <code>Name</code> input (e.g., <code>foo</code>).
<img src="https://res.cloudinary.com/pipedreamin/image/upload/v1618550730/docs/components/image-20210411165053922_pckn5y.png" alt="image-20210411165053922"></p>
</li>
<li>
<p>Deploy the workflow and click <strong>RUN NOW</strong></p>
</li>
</ol>
<p>You should see <code>hello foo!</code> (or the value you entered for <code>Name</code>) as the value returned by the step.</p>
<h3 id="use-an-npm-package" tabindex="-1"><a class="header-anchor" href="#use-an-npm-package" aria-hidden="true">#</a> Use an npm Package</h3>
<p>Next, we'll update the component to get data from the Star Wars API using the <code>axios</code> npm package. To use the <code>axios</code> package, just <code>import</code> it.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> axios <span class="token keyword">from</span> <span class="token string">"axios"</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Action Demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">"This is a demo action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"action_demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">"0.0.2"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"string"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">label</span><span class="token operator">:</span> <span class="token string">"Name"</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">hello </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token keyword">this</span><span class="token punctuation">.</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">!</span><span class="token template-punctuation string">`</span></span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p>
<p>To use most npm packages on Pipedream, just <code>import</code> or <code>require</code> them — there is no <code>package.json</code> or <code>npm install</code> required.</p>
</div>
<p>Then, update the <code>run()</code> method to:</p>
<ul>
<li>Make a request to the following endpoint for the Star Wars API: <code>https://swapi.dev/api/people/1/</code></li>
<li>Reference the <code>name</code> field of the payload returned by the API</li>
</ul>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> axios <span class="token keyword">from</span> <span class="token string">"axios"</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Action Demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">"This is a demo action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"action_demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">"0.0.2"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"string"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">label</span><span class="token operator">:</span> <span class="token string">"Name"</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> response <span class="token operator">=</span> <span class="token keyword">await</span> axios<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">"https://swapi.dev/api/people/1/"</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">hello </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>response<span class="token punctuation">.</span>data<span class="token punctuation">.</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">!</span><span class="token template-punctuation string">`</span></span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><p>Next, remove the <code>name</code> prop since we're no longer using it.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> axios <span class="token keyword">from</span> <span class="token string">"axios"</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Action Demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">"This is a demo action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"action_demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">"0.0.2"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> response <span class="token operator">=</span> <span class="token keyword">await</span> axios<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">"https://swapi.dev/api/people/1/"</span><span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">hello </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>response<span class="token punctuation">.</span>data<span class="token punctuation">.</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">!</span><span class="token template-punctuation string">`</span></span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p>Finally, update the version to <code>0.0.3</code>. If you fail to update the version, the CLI will throw an error.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> axios <span class="token keyword">from</span> <span class="token string">"axios"</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Action Demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">"This is a demo action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"action_demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">"0.0.3"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> response <span class="token operator">=</span> <span class="token keyword">await</span> axios<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">"https://swapi.dev/api/people/1/"</span><span class="token punctuation">)</span>
		<span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">hello </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>response<span class="token punctuation">.</span>data<span class="token punctuation">.</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">!</span><span class="token template-punctuation string">`</span></span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p>Save the file and run the <code>pd publish</code> command again to update the action in your account.</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pd publish action.js
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>The CLI will update the component in your account with the key <code>action_demo</code>. You should see something like this:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>sc_ZriKEn  Action Demo                             <span class="token number">0.0</span>.3    <span class="token number">1</span> second ago         action_demo
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>Follow the steps in the previous example to update and run the action in your workflow. You should see <code>hello Luke Skywalker!</code> as the return value for the step.</p>
<h3 id="use-managed-auth" tabindex="-1"><a class="header-anchor" href="#use-managed-auth" aria-hidden="true">#</a> Use Managed Auth</h3>
<p>For the last example, we'll use Pipedream managed auth to retrieve and emit data from the Github API (which uses OAuth for authentication). First, remove the line that imports <code>axios</code> and clear the <code>run()</code> function from the last example. Your code should look like this:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Action Demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">"This is a demo action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"action_demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">"0.0.3"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"action"</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>Next, import Github's <code>octokit</code> npm package</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Octokit <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@octokit/rest'</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Action Demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">"This is a demo action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"action_demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">"0.0.3"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"action"</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><p>Then add an <a href="/components/api/#app-props" target="_blank" rel="noopener noreferrer">app prop<ExternalLinkIcon/></a> to use Pipedream managed auth with this component. For this example, we'll add an app prop for Github:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Octokit <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@octokit/rest'</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Action Demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">"This is a demo action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"action_demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">"0.0.3"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">github</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"app"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">app</span><span class="token operator">:</span> <span class="token string">"github"</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p>
<p>The value for the <code>app</code> property is the name slug for the app in Pipedream. This is not currently discoverable, but it will be in the near future on app pages in the <a href="https://pipedream.com/explore" target="_blank" rel="noopener noreferrer">Pipedream Marketplace<ExternalLinkIcon/></a>. For the time being, if you want to know how to reference an app, please please <a href="https://pipedream.com/community" target="_blank" rel="noopener noreferrer">reach out<ExternalLinkIcon/></a>.</p>
</div>
<p>Next, update the <code>run()</code> method to get a repo from Github and return it. For this example, we'll pass static values to get the <code>pipedreamhq/pipedream</code> repo. Notice that we're passing the <code>oauth_access_token</code> in the authorization header by referencing the <code>$auth</code> property of the app prop — <code>this.github.$auth.oauth_access_token</code>. You can discover how to reference auth tokens in the <strong>Authentication Strategy</strong> section for each app in the <a href="https://pipedream.com/explore" target="_blank" rel="noopener noreferrer">Pipedream Marketplace<ExternalLinkIcon/></a>.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Octokit <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@octokit/rest'</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Action Demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">"This is a demo action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"action_demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">"0.0.3"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">github</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"app"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">app</span><span class="token operator">:</span> <span class="token string">"github"</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> octokit <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Octokit</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">auth</span><span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>github<span class="token punctuation">.</span>$auth<span class="token punctuation">.</span>oauth_access_token
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    
    <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token keyword">await</span> octokit<span class="token punctuation">.</span>repos<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">owner</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">pipedreamhq</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>
      <span class="token literal-property property">repo</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">pipedream</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span>data
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br></div></div><p>In order to help users understand what's happening with each action step, we recommend surfacing a brief summary with <code>$summary</code> (<a href="/components/api/#actions" target="_blank" rel="noopener noreferrer">read more<ExternalLinkIcon/></a> about exporting data using <code>$.export</code>).</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Octokit <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@octokit/rest'</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Action Demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">"This is a demo action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"action_demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">"0.0.3"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">github</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"app"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">app</span><span class="token operator">:</span> <span class="token string">"github"</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> octokit <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Octokit</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">auth</span><span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>github<span class="token punctuation">.</span>$auth<span class="token punctuation">.</span>oauth_access_token
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    
    <span class="token keyword">const</span> <span class="token punctuation">{</span> data <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">await</span> octokit<span class="token punctuation">.</span>repos<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">owner</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">pipedreamhq</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>
      <span class="token literal-property property">repo</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">pipedream</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    $<span class="token punctuation">.</span><span class="token function">export</span><span class="token punctuation">(</span><span class="token string">"$summary"</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Successfully fetched info for \`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>data<span class="token punctuation">.</span>full_name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\`</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>
    
    <span class="token keyword">return</span> data<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br></div></div><p>Finally, update the version to <code>0.0.4</code>. If you fail to update the version, the CLI will throw an error.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> Octokit <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@octokit/rest'</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Action Demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">"This is a demo action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"action_demo"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">"0.0.4"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"action"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">github</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"app"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">app</span><span class="token operator">:</span> <span class="token string">"github"</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> octokit <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Octokit</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">auth</span><span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>github<span class="token punctuation">.</span>$auth<span class="token punctuation">.</span>oauth_access_token
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
    
    <span class="token keyword">const</span> <span class="token punctuation">{</span> data <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">await</span> octokit<span class="token punctuation">.</span>repos<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">owner</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">pipedreamhq</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>
      <span class="token literal-property property">repo</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">pipedream</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>

    $<span class="token punctuation">.</span><span class="token function">export</span><span class="token punctuation">(</span><span class="token string">"$summary"</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Successfully fetched info for \`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>data<span class="token punctuation">.</span>full_name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\`</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>
    
    <span class="token keyword">return</span> data<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br></div></div><p>Save the file and run the <code>pd publish</code> command again to update the action in your account.</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd publish action.js
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>The CLI will update the component in your account with the key <code>action_demo</code>. You should see something like this:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>sc_k3ia53  Action Demo                            0.0.4    just now             action_demo
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>Follow the steps in the earlier example to update the action in your workflow (you may need to save your workflow after refreshing the action). You should now see a prompt to connect your Github account to the step:
<img src="https://res.cloudinary.com/pipedreamin/image/upload/v1618550730/docs/components/image-20210411114410883_cngxm4.png" alt="image-20210411114410883"></p>
<p>Select an existing account or connect a new one, and then deploy your workflow and click <strong>RUN NOW</strong>. You should see the results returned by the action:</p>
<p><img src="https://res.cloudinary.com/pipedreamin/image/upload/v1618550730/docs/components/image-20210411114522610_dokk3b.png" alt="image-20210411114522610"></p>
<h2 id="what-s-next" tabindex="-1"><a class="header-anchor" href="#what-s-next" aria-hidden="true">#</a> What's Next?</h2>
<p>You're ready to start authoring and publishing actions on Pipedream! You can also check out the <a href="/components/api/#component-api" target="_blank" rel="noopener noreferrer">detailed component reference<ExternalLinkIcon/></a> at any time!</p>
<p>If you have any questions or feedback, please <a href="https://pipedream.com/community" target="_blank" rel="noopener noreferrer">reach out<ExternalLinkIcon/></a>!</p>
</template>
