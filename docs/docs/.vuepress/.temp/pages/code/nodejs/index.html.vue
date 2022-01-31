<template><h1 id="writing-node-js-in-steps" tabindex="-1"><a class="header-anchor" href="#writing-node-js-in-steps" aria-hidden="true">#</a> Writing Node.js in Steps</h1>
<p>Pipedream supports <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">Node.js v{{$site.themeConfig.NODE_VERSION}}<ExternalLinkIcon/></a>.</p>
<p><strong>Anything you can do with Node.js, you can do in a workflow</strong>. This includes using most of <a href="#using-npm-packages">npm's 400,000+ packages</a>.</p>
<p>JavaScript is one of the <a href="https://insights.stackoverflow.com/survey/2019#technology-_-programming-scripting-and-markup-languages" target="_blank" rel="noopener noreferrer">most used<ExternalLinkIcon/></a> <a href="https://github.blog/2018-11-15-state-of-the-octoverse-top-programming-languages/" target="_blank" rel="noopener noreferrer">languages<ExternalLinkIcon/></a> in the world, with a thriving community and <a href="https://www.npmjs.com" target="_blank" rel="noopener noreferrer">extensive package ecosystem<ExternalLinkIcon/></a>. If you work on websites and know JavaScript well, Pipedream makes you a full stack engineer. If you've never used JavaScript, see the <a href="#new-to-javascript">resources below</a>.</p>
<div class="custom-container tip"><p class="custom-container-title">TIP</p>
<p>It's important to understand the core difference between Node.js and the JavaScript that runs in your web browser: <strong>Node doesn't have access to some of the things a browser expects, like the HTML on the page, or its URL</strong>. If you haven't used Node before, be aware of this limitation as you search for JavaScript examples on the web.</p>
</div>
<h2 id="adding-a-code-step" tabindex="-1"><a class="header-anchor" href="#adding-a-code-step" aria-hidden="true">#</a> Adding a code step</h2>
<ol>
<li>Click the <strong>+</strong> button below any step of your workflow.</li>
<li>Select the option to <strong>Run custom code</strong>.</li>
<li>Select the <code>nodejs14.x</code> runtime.</li>
</ol>
<p>You can add any Node.js code in the editor that appears. For example, try:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> steps<span class="token punctuation">,</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">'This is Node.js code'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    $<span class="token punctuation">.</span><span class="token function">export</span><span class="token punctuation">(</span><span class="token string">'test'</span><span class="token punctuation">,</span> <span class="token string">'Some test data'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token string">'Test data'</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>Code steps use the same editor (<a href="https://microsoft.github.io/monaco-editor/" target="_blank" rel="noopener noreferrer">Monaco<ExternalLinkIcon/></a>) used in Microsoft's <a href="https://code.visualstudio.com/" target="_blank" rel="noopener noreferrer">VS Code<ExternalLinkIcon/></a>, which supports syntax highlighting, automatic indentation, and more.</p>
<h2 id="passing-props-to-code-steps" tabindex="-1"><a class="header-anchor" href="#passing-props-to-code-steps" aria-hidden="true">#</a> Passing props to code steps</h2>
<p>You can make code steps reusable by allowing them to accept props. Instead of hard-coding the values of variables within the code itself, you can pass them to the code step as arguments or parameters <em>entered in the workflow builder</em>.</p>
<p>For example, let's define a <code>firstName</code> prop. This will allow us to freely enter text from the workflow builder.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">firstName</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">'string'</span><span class="token punctuation">,</span>
      <span class="token literal-property property">label</span><span class="token operator">:</span> <span class="token string">'Your first name'</span><span class="token punctuation">,</span>
      <span class="token keyword">default</span><span class="token operator">:</span> <span class="token string">'Dylan'</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> steps<span class="token punctuation">,</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Hello </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token keyword">this</span><span class="token punctuation">.</span>firstName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">, congrats on crafting your first prop!</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><p>The workflow builder now can accept text input to populate the <code>firstName</code> to this particular step only:</p>
<div>
  <img alt="Workflow builder displaying the input visually as a text input field" src="@source/code/nodejs/images/user-input-props-example.png" width="740px" />
</div>
<p>Accepting a single string is just one example, you can build a step to accept arrays of strings through a dropdown presented in the workflow builder.</p>
<p><a href="/components/api/#props" target="_blank" rel="noopener noreferrer">Read the props reference for the full list of options<ExternalLinkIcon/></a>.</p>
<h2 id="how-pipedream-node-js-components-work" tabindex="-1"><a class="header-anchor" href="#how-pipedream-node-js-components-work" aria-hidden="true">#</a> How Pipedream Node.js components work</h2>
<p>When you add a new Node.js code step or use the examples in this doc, you'll notice a common structure to the code:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> steps<span class="token punctuation">,</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// this Node.js code will execute when the step runs</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>This defines <a href="/components/api/" target="_blank" rel="noopener noreferrer">a Node.js component<ExternalLinkIcon/></a>. Components let you:</p>
<ul>
<li>Pass input to steps using <a href="/code/nodejs/#passing-props-to-code-steps" target="_blank" rel="noopener noreferrer">props<ExternalLinkIcon/></a></li>
<li><a href="/connected-accounts/#from-a-code-step" target="_blank" rel="noopener noreferrer">Connect an account to a step<ExternalLinkIcon/></a></li>
<li><a href="/workflows/steps/triggers/#customizing-the-http-response" target="_blank" rel="noopener noreferrer">Issue HTTP responses<ExternalLinkIcon/></a></li>
<li>Perform workflow-level flow control, like <a href="#ending-a-workflow-early">ending a workflow early</a></li>
</ul>
<p>When the step runs, Pipedream executes the <code>run</code> method:</p>
<ul>
<li>Any asynchronous code within a code step <a href="/workflows/steps/code/async/" target="_blank" rel="noopener noreferrer"><strong>must</strong> be run synchronously<ExternalLinkIcon/></a>, using the <code>await</code> keyword or with a Promise chain, using <code>.then()</code>, <code>.catch()</code>, and related methods.</li>
<li>Pipedream passes the <code>steps</code> variable to the run method. <code>steps</code> is also an object, and contains the <a href="/workflows/steps/#step-exports" target="_blank" rel="noopener noreferrer">data exported from previous steps<ExternalLinkIcon/></a> in your workflow.</li>
<li>You also have access to the <code>$</code> variable, which gives you access to methods like <code>$.respond</code>, <code>$.export</code>, <a href="/components/api/#actions" target="_blank" rel="noopener noreferrer">and more<ExternalLinkIcon/></a>.</li>
</ul>
<p>If you're using <a href="/code/nodejs/#passing-props-to-code-steps" target="_blank" rel="noopener noreferrer">props<ExternalLinkIcon/></a> or <a href="/connected-accounts/#from-a-code-step" target="_blank" rel="noopener noreferrer">connect an account to a step<ExternalLinkIcon/></a>, the component exposes them in the variable <code>this</code>, which refers to the current step:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> steps<span class="token punctuation">,</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// `this` refers to the running component. Props, connected accounts, etc. are exposed here</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>When you <a href="/connected-accounts/#from-a-code-step" target="_blank" rel="noopener noreferrer">connect an account to a step<ExternalLinkIcon/></a>, Pipedream exposes the auth info in the variable <a href="/workflows/steps/code/auth/#the-auths-object" target="_blank" rel="noopener noreferrer"><code>this.appName.$auth</code><ExternalLinkIcon/></a>.</p>
<h2 id="logs" tabindex="-1"><a class="header-anchor" href="#logs" aria-hidden="true">#</a> Logs</h2>
<p>You can call <code>console.log</code> or <code>console.error</code> to add logs to the execution of a code step.</p>
<p>These logs will appear just below the associated step. <code>console.log</code> messages appear in black, <code>console.error</code> in red.</p>
<h3 id="console-dir" tabindex="-1"><a class="header-anchor" href="#console-dir" aria-hidden="true">#</a> <code>console.dir</code></h3>
<p>If you need to print the contents of JavaScript objects, use <code>console.dir</code>:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> steps<span class="token punctuation">,</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">dir</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Luke"</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h2 id="syntax-errors" tabindex="-1"><a class="header-anchor" href="#syntax-errors" aria-hidden="true">#</a> Syntax errors</h2>
<p>Pipedream will attempt to catch syntax errors when you're writing code, highlighting the lines where the error occurred in red.</p>
<div class="custom-container warning"><p class="custom-container-title">WARNING</p>
<p>While you can save a workflow with syntax errors, it's unlikely to run correctly on new events. Make sure to fix syntax errors before running your workflow.</p>
</div>
<h2 id="using-npm-packages" tabindex="-1"><a class="header-anchor" href="#using-npm-packages" aria-hidden="true">#</a> Using <code>npm</code> packages</h2>
<p><a href="https://www.npmjs.com/" target="_blank" rel="noopener noreferrer">npm<ExternalLinkIcon/></a> hosts JavaScript packages: bits of code someone else has written and packaged for others to use. npm has over 400,000 packages and counting. You can use most of those on Pipedream.</p>
<h3 id="just-import-it" tabindex="-1"><a class="header-anchor" href="#just-import-it" aria-hidden="true">#</a> Just <code>import</code> it</h3>
<p>To use an npm package in a code step, simply <code>import</code> it:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> axios <span class="token keyword">from</span> <span class="token string">"axios"</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>If a package only supports the <a href="https://nodejs.org/api/modules.html" target="_blank" rel="noopener noreferrer">CommonJS module format<ExternalLinkIcon/></a>, you may have to <code>require</code> it:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">const</span> axios <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"axios"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p><strong>Within a single step, you can only use <code>import</code> or <code>require</code> statements, not both</strong>. See <a href="#require-is-not-defined">this section</a> for more details.</p>
<p>When Pipedream runs your workflow, we download the associated npm package for you before running your code steps.</p>
<p>If you've used Node before, you'll notice there's no <code>package.json</code> file to upload or edit. We want to make package management simple, so just <code>import</code> or <code>require</code> the module like you would in your code, after package installation, and get to work.</p>
<p>The core limitation of packages is one we described above: some packages require access to a web browser to run, and don't work with Node. Often this limitation is documented on the package <code>README</code>, but often it's not. If you're not sure and need to use it, we recommend just trying to <code>import</code> or <code>require</code> it.</p>
<p>Moreover, packages that require access to large binaries — for example, how <a href="https://pptr.dev" target="_blank" rel="noopener noreferrer">Puppeteer<ExternalLinkIcon/></a> requires Chromium — may not work on Pipedream. If you're seeing any issues with a specific package, please <a href="https://pipedream.com/support/" target="_blank" rel="noopener noreferrer">let us know<ExternalLinkIcon/></a>.</p>
<h3 id="commonjs-vs-esm-imports" tabindex="-1"><a class="header-anchor" href="#commonjs-vs-esm-imports" aria-hidden="true">#</a> CommonJS vs. ESM imports</h3>
<p>In Node.js, you may be used to importing third-party packages using the <code>require</code> statement:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">const</span> axios <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"axios"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>In this example, we're including the <code>axios</code> <a href="https://nodejs.org/api/modules.html" target="_blank" rel="noopener noreferrer">CommonJS module<ExternalLinkIcon/></a> published to npm. You import CommonJS modules using the <code>require</code> statement.</p>
<p>But you may encounter this error in workflows:</p>
<p><code>Error Must use import to load ES Module</code></p>
<p>This means that the package you're trying to <code>require</code> uses a different format to export their code, called <a href="https://nodejs.org/api/esm.html#esm_modules_ecmascript_modules" target="_blank" rel="noopener noreferrer">ECMAScript modules<ExternalLinkIcon/></a> (<strong>ESM</strong>, or <strong>ES modules</strong>, for short). With ES modules, you instead need to <code>import</code> the package:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> got <span class="token keyword">from</span> <span class="token string">'got'</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>Most package publish both CommonJS and ESM versions, so <strong>if you always use <code>import</code>, you're less likely to have problems</strong>. In general, refer to the documentation for your package for instructions on importing it correctly.</p>
<h3 id="require-is-not-defined" tabindex="-1"><a class="header-anchor" href="#require-is-not-defined" aria-hidden="true">#</a> <code>require</code> is not defined</h3>
<p>This error means that you cannot use CommonJS and ESM imports in the same step. For example, if you run code like this:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> fetch <span class="token keyword">from</span> <span class="token string">'node-fetch'</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> axios <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"axios"</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>your workflow will throw a <code>require is not defined</code> error. There are two solutions:</p>
<ol>
<li>Try converting your CommonJS <code>require</code> statement into an ESM <code>import</code> statement. For example, convert this:</li>
</ol>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">const</span> axios <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"axios"</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>to this:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> axios <span class="token keyword">from</span> <span class="token string">"axios"</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><ol start="2">
<li>If the <code>import</code> syntax fails to work, separate your imports into different steps, using only CommonJS requires in one step, and only ESM imports in another.</li>
</ol>
<h2 id="variable-scope" tabindex="-1"><a class="header-anchor" href="#variable-scope" aria-hidden="true">#</a> Variable scope</h2>
<p>Any variables you create within a step are scoped to that step. That is, they cannot be referenced in any other step.</p>
<p>Within a step, the <a href="https://developer.mozilla.org/en-US/docs/Glossary/Scope" target="_blank" rel="noopener noreferrer">normal rules of JavaScript variable scope<ExternalLinkIcon/></a> apply.</p>
<p><strong>When you need to share data across steps, use <a href="/workflows/steps/" target="_blank" rel="noopener noreferrer">step exports<ExternalLinkIcon/></a>.</strong></p>
<h2 id="making-http-requests-from-your-workflow" tabindex="-1"><a class="header-anchor" href="#making-http-requests-from-your-workflow" aria-hidden="true">#</a> Making HTTP requests from your workflow</h2>
<p>There are two ways to make HTTP requests in code steps:</p>
<ul>
<li>Use any HTTP client that works with Node.js. <a href="/workflows/steps/code/nodejs/http-requests/" target="_blank" rel="noopener noreferrer">See this example guide for how to use <code>axios</code> to make HTTP requests<ExternalLinkIcon/></a>.</li>
<li><a href="/destinations/http/#using-send-http-in-workflows" target="_blank" rel="noopener noreferrer">Use <code>$send.http()</code><ExternalLinkIcon/></a>, a Pipedream-provided method for making asynchronous HTTP requests.</li>
</ul>
<p>In general, if you just need to make an HTTP request but don't care about the response, <a href="/destinations/http/#using-send-http-in-workflows" target="_blank" rel="noopener noreferrer">use <code>$send.http()</code><ExternalLinkIcon/></a>. If you need to operate on the data in the HTTP response in the rest of your workflow, <a href="/workflows/steps/code/nodejs/http-requests/" target="_blank" rel="noopener noreferrer">use <code>axios</code><ExternalLinkIcon/></a>.</p>
<h2 id="returning-http-responses" tabindex="-1"><a class="header-anchor" href="#returning-http-responses" aria-hidden="true">#</a> Returning HTTP responses</h2>
<p>You can return HTTP responses from <a href="/workflows/steps/triggers/#http" target="_blank" rel="noopener noreferrer">HTTP-triggered workflows<ExternalLinkIcon/></a> using the <a href="/workflows/steps/triggers/#customizing-the-http-response" target="_blank" rel="noopener noreferrer"><code>$.respond()</code> function<ExternalLinkIcon/></a>.</p>
<h2 id="managing-state" tabindex="-1"><a class="header-anchor" href="#managing-state" aria-hidden="true">#</a> Managing state</h2>
<p>In Node.js (Javascript) code steps, you can also store and retrieve data in code steps.</p>
<p>This is very useful for tracking data between runs of a particular workflow.</p>
<div class="custom-container warning"><p class="custom-container-title">WARNING</p>
<p>This functionality (<code>$.service.db</code>) is limited to only Node.js code steps at this time.</p>
<p>Other step languages like <a href="/code/python" target="_blank" rel="noopener noreferrer">Python<ExternalLinkIcon/></a>, <a href="/code/bash" target="_blank" rel="noopener noreferrer">bash<ExternalLinkIcon/></a> and <a href="/code/go" target="_blank" rel="noopener noreferrer">Go<ExternalLinkIcon/></a> do not have this feature available yet.</p>
<p>For more information on what functionality is available for those languages, please refer to their documentation.</p>
</div>
<h3 id="injecting-the-database" tabindex="-1"><a class="header-anchor" href="#injecting-the-database" aria-hidden="true">#</a> Injecting the database</h3>
<p>By default, Node.js steps don't have access to the database service. It needs to be injected by defining it as a <code>prop</code>.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token comment">// Define that the "db" variable in our component is a database</span>
    <span class="token literal-property property">db</span><span class="token operator">:</span> <span class="token string">"$.service.db"</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> steps<span class="token punctuation">,</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// Now we can access the database at "this.db"</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>db<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token string">"name"</span><span class="token punctuation">,</span> <span class="token string">"Dylan"</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><div class="custom-container tip"><p class="custom-container-title">TIP</p>
<p><code>props</code> injects variables under <code>this</code> scope in components.</p>
<p>In the above example we essentially instructed that this step needs the database injected into the <code>this.db</code> prop.</p>
</div>
<h3 id="using-the-database" tabindex="-1"><a class="header-anchor" href="#using-the-database" aria-hidden="true">#</a> Using the database</h3>
<p>Once you inject the database into the component, you can use it to both store (<code>set</code>) and retrieve (<code>get</code>) data.</p>
<h3 id="saving-data" tabindex="-1"><a class="header-anchor" href="#saving-data" aria-hidden="true">#</a> Saving data</h3>
<p>You can save data with the in-step database using the <code>set</code> method.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token string-property property">"db"</span><span class="token operator">:</span> <span class="token string">"$.service.db"</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> steps<span class="token punctuation">,</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// Store a timestamp each time this step is executed in the workflow</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>db<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token string">'lastRanAt'</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><h3 id="retrieving-data" tabindex="-1"><a class="header-anchor" href="#retrieving-data" aria-hidden="true">#</a> Retrieving data</h3>
<p>You can retrieve data with the in-step database using the <code>get</code> method.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token string-property property">"db"</span><span class="token operator">:</span> <span class="token string">"$.service.db"</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> steps<span class="token punctuation">,</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// Retrieve the timestamp representing last time this step executed</span>
    <span class="token keyword">const</span> lastRanAt <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>db<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">'lastRanAt'</span><span class="token punctuation">)</span><span class="token punctuation">;</span> 
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><h3 id="workflow-counter-example" tabindex="-1"><a class="header-anchor" href="#workflow-counter-example" aria-hidden="true">#</a> Workflow counter example</h3>
<p>For example, if you'd like to set up a counter to count the number of times the workflow executes.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token string-property property">"db"</span><span class="token operator">:</span> <span class="token string">"$.service.db"</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> steps<span class="token punctuation">,</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// By default, all database entries are undefined.</span>
    <span class="token comment">// It's wise to set a default value so our code as an initial value to work with</span>
    <span class="token keyword">const</span> counter <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>db<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">'counter'</span><span class="token punctuation">)</span> <span class="token operator">??</span> <span class="token number">0</span><span class="token punctuation">;</span>
    
    <span class="token comment">// On the first run "counter" will be 0 and we'll increment it to 1</span>
    <span class="token comment">// The next run will increment the counter to 2, and so forth</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>db<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token string">'counter'</span><span class="token punctuation">,</span> counter <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><h3 id="dedupe-data-example" tabindex="-1"><a class="header-anchor" href="#dedupe-data-example" aria-hidden="true">#</a> Dedupe data example</h3>
<p>This database is also useful for storing data from prior runs to prevent acting on duplicate data, or data that's been seen before.</p>
<p>For example, this workflow's trigger contains an email address from a potential new customer. But we want to track all emails collected so we don't send a welcome email twice:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token string-property property">"db"</span><span class="token operator">:</span> <span class="token string">"$.service.db"</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> steps<span class="token punctuation">,</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> email <span class="token operator">=</span> steps<span class="token punctuation">.</span>trigger<span class="token punctuation">.</span>body<span class="token punctuation">.</span>new_customer_email<span class="token punctuation">;</span>
    <span class="token comment">// Retrieve the past recorded emails from other runs</span>
    <span class="token keyword">const</span> emails <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>db<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">'emails'</span><span class="token punctuation">)</span> <span class="token operator">??</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

    <span class="token comment">// If the current email being passed from our webhook is already in our list, exit early</span>
    <span class="token keyword">if</span><span class="token punctuation">(</span>emails<span class="token punctuation">.</span><span class="token function">includes</span><span class="token punctuation">(</span>email<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> $<span class="token punctuation">.</span>flow<span class="token punctuation">.</span><span class="token function">exit</span><span class="token punctuation">(</span><span class="token string">'Already welcomed this user'</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// Add the current email to the list of past emails so we can detect it in the future runs</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>db<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token string">'emails'</span><span class="token punctuation">,</span> <span class="token punctuation">[</span><span class="token operator">...</span>emails<span class="token punctuation">,</span> email<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><h3 id="service-db-limitations" tabindex="-1"><a class="header-anchor" href="#service-db-limitations" aria-hidden="true">#</a> <code>$.service.db</code> limitations</h3>
<p>The <code>$.service.db</code> is only currently available in Node.js code steps. It is not yet available in other languages like Go, bash or Python.</p>
<p>In addition, <code>$.service.db</code> can hold up to {{ $site.themeConfig.SERVICE_DB_SIZE_LIMIT }} per step.</p>
<h2 id="ending-a-workflow-early" tabindex="-1"><a class="header-anchor" href="#ending-a-workflow-early" aria-hidden="true">#</a> Ending a workflow early</h2>
<p>Sometimes you want to end your workflow early, or otherwise stop or cancel the execution or a workflow under certain conditions. For example:</p>
<ul>
<li>You may want to end your workflow early if you don't receive all the fields you expect in the event data.</li>
<li>You only want to run your workflow for 5% of all events sent to your source.</li>
<li>You only want to run your workflow for users in the United States. If you receive a request from outside the U.S., you don't want the rest of the code in your workflow to run.</li>
<li>You may use the <code>user_id</code> contained in the event to look up information in an external API. If you can't find data in the API tied to that user, you don't want to proceed.</li>
</ul>
<p><strong>In any code step, calling <code>return $.flow.exit()</code> will end the execution of the workflow immediately.</strong> No remaining code in that step, and no code or destination steps below, will run for the current event.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> steps<span class="token punctuation">,</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> $<span class="token punctuation">.</span>flow<span class="token punctuation">.</span><span class="token function">exit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"This code will not run, since $.flow.exit() was called above it"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p>You can pass any string as an argument to <code>$.flow.exit()</code>:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> steps<span class="token punctuation">,</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> $<span class="token punctuation">.</span>flow<span class="token punctuation">.</span><span class="token function">exit</span><span class="token punctuation">(</span><span class="token string">"End message"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> steps<span class="token punctuation">,</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// Flip a coin, running $.flow.exit() for 50% of events</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>Math<span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">></span> <span class="token number">0.5</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> $<span class="token punctuation">.</span>flow<span class="token punctuation">.</span><span class="token function">exit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"This code will only run 50% of the time"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><h2 id="errors" tabindex="-1"><a class="header-anchor" href="#errors" aria-hidden="true">#</a> Errors</h2>
<p><a href="https://nodejs.org/dist/latest-v10.x/docs/api/errors.html#errors_errors" target="_blank" rel="noopener noreferrer">Errors<ExternalLinkIcon/></a> raised in a code step will stop the execution of code or destinations that follow.</p>
<h2 id="using-secrets-in-code" tabindex="-1"><a class="header-anchor" href="#using-secrets-in-code" aria-hidden="true">#</a> Using secrets in code</h2>
<p>Workflow code is private. Still, we recommend you don't include secrets — API keys, tokens, or other sensitive values — directly in code steps.</p>
<p>Pipedream supports <a href="/environment-variables/" target="_blank" rel="noopener noreferrer">environment variables<ExternalLinkIcon/></a> for keeping secrets separate from code. Once you create an environment variable in Pipedream, you can reference it in any workflow using <code>process.env.VARIABLE_NAME</code>. The values of environment variables are private.</p>
<p>See the <a href="/environment-variables/" target="_blank" rel="noopener noreferrer">Environment Variables<ExternalLinkIcon/></a> docs for more information.</p>
<h2 id="limitations-of-code-steps" tabindex="-1"><a class="header-anchor" href="#limitations-of-code-steps" aria-hidden="true">#</a> Limitations of code steps</h2>
<p>Code steps operate within the <a href="/limits/#workflows" target="_blank" rel="noopener noreferrer">general constraints on workflows<ExternalLinkIcon/></a>. As long as you stay within those limits and abide by our <a href="/limits/#acceptable-use" target="_blank" rel="noopener noreferrer">acceptable use policy<ExternalLinkIcon/></a>, you can add any number of code steps in a workflow to do virtually anything you'd be able to do in Node.js.</p>
<p>If you're trying to run code that doesn't work or you have questions about any limits on code steps, <a href="https://pipedream.com/support/" target="_blank" rel="noopener noreferrer">please reach out<ExternalLinkIcon/></a>.</p>
<h2 id="editor-settings" tabindex="-1"><a class="header-anchor" href="#editor-settings" aria-hidden="true">#</a> Editor settings</h2>
<p>We use the <a href="https://microsoft.github.io/monaco-editor/" target="_blank" rel="noopener noreferrer">Monaco Editor<ExternalLinkIcon/></a>, which powers VS Code and other web-based editors.</p>
<p>We also let you customize the editor. For example, you can enable Vim mode, and change the default tab size for indented code. Visit your <a href="https://pipedream.com/settings" target="_blank" rel="noopener noreferrer"><strong>Settings</strong><ExternalLinkIcon/></a> to modify these settings.</p>
<h2 id="keyboard-shortcuts" tabindex="-1"><a class="header-anchor" href="#keyboard-shortcuts" aria-hidden="true">#</a> Keyboard Shortcuts</h2>
<p>We use the <a href="https://microsoft.github.io/monaco-editor/" target="_blank" rel="noopener noreferrer">Monaco Editor<ExternalLinkIcon/></a>, which powers VS Code. As a result, many of the VS Code <a href="https://code.visualstudio.com/docs/getstarted/keybindings" target="_blank" rel="noopener noreferrer">keyboard shortcuts<ExternalLinkIcon/></a> should work in the context of the editor.</p>
<p>For example, you can use shortcuts to search for text, format code, and more.</p>
<h2 id="new-to-javascript" tabindex="-1"><a class="header-anchor" href="#new-to-javascript" aria-hidden="true">#</a> New to JavaScript?</h2>
<p>We understand many of you might be new to JavaScript, and provide resources for you to learn the language below.</p>
<p>When you're searching for how to do something in JavaScript, some of the code you try might not work in Pipedream. This could be because the code expects to run in a browser, not a Node.js environment. The same goes for <a href="#using-npm-packages">npm packages</a>.</p>
<h3 id="i-m-new-to-programming" tabindex="-1"><a class="header-anchor" href="#i-m-new-to-programming" aria-hidden="true">#</a> I'm new to programming</h3>
<p>Many of the most basic JavaScript tutorials are geared towards writing code for a web browser to run. This is great for learning — a webpage is one of the coolest things you can build with code. We recommend starting with these general JavaScript tutorials and trying the code you learn on Pipedream:</p>
<ul>
<li><a href="http://jsforcats.com/" target="_blank" rel="noopener noreferrer">JavaScript For Cats<ExternalLinkIcon/></a></li>
<li><a href="https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps" target="_blank" rel="noopener noreferrer">Mozilla - JavaScript First Steps<ExternalLinkIcon/></a></li>
<li><a href="https://stackoverflow.com/" target="_blank" rel="noopener noreferrer">StackOverflow<ExternalLinkIcon/></a> operates a programming Q&amp;A site that typically has the first Google result when you're searching for something specific. It's a great place to find answers to common questions.</li>
</ul>
<h3 id="i-know-how-to-code-but-don-t-know-javascript" tabindex="-1"><a class="header-anchor" href="#i-know-how-to-code-but-don-t-know-javascript" aria-hidden="true">#</a> I know how to code, but don't know JavaScript</h3>
<ul>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript" target="_blank" rel="noopener noreferrer">A re-introduction to JavaScript (JS tutorial)<ExternalLinkIcon/></a></li>
<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noopener noreferrer">MDN language overview<ExternalLinkIcon/></a></li>
<li><a href="https://eloquentjavascript.net/" target="_blank" rel="noopener noreferrer">Eloquent Javascript<ExternalLinkIcon/></a></li>
<li><a href="https://nodeschool.io/" target="_blank" rel="noopener noreferrer">Node School<ExternalLinkIcon/></a></li>
<li><a href="https://github.com/getify/You-Dont-Know-JS" target="_blank" rel="noopener noreferrer">You Don't Know JS<ExternalLinkIcon/></a></li>
</ul>
</template>
