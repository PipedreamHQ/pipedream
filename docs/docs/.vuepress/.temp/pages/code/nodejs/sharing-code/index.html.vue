<template><h1 id="sharing-code-across-workflows" tabindex="-1"><a class="header-anchor" href="#sharing-code-across-workflows" aria-hidden="true">#</a> Sharing code across workflows</h1>
<p>Pipedream provides two ways to share code across workflows:</p>
<ul>
<li><strong>Create an action</strong>. <a href="/components/actions/" target="_blank" rel="noopener noreferrer">Actions<ExternalLinkIcon/></a> are reusable steps. When you author an action, you can add it to your workflow like you would other actions, by clicking the <strong>+</strong> button below any step. <a href="/components/quickstart/nodejs/actions/" target="_blank" rel="noopener noreferrer">Learn how to build your first action here<ExternalLinkIcon/></a>.</li>
<li><strong>Create your own npm package</strong>. If you need to run the same Node.js code in multiple workflows, you can publish that code as an npm package. We'll walk you through that process below.</li>
</ul>
<nav class="table-of-contents"><ul><li><RouterLink to="#publishing-your-own-npm-package">Publishing your own npm package</RouterLink><ul><li><RouterLink to="#the-short-version">The short version</RouterLink></li><li><RouterLink to="#step-by-step">Step by step</RouterLink></li></ul></li></ul></nav>
<h2 id="publishing-your-own-npm-package" tabindex="-1"><a class="header-anchor" href="#publishing-your-own-npm-package" aria-hidden="true">#</a> Publishing your own npm package</h2>
<h3 id="the-short-version" tabindex="-1"><a class="header-anchor" href="#the-short-version" aria-hidden="true">#</a> The short version</h3>
<ol>
<li><a href="https://docs.npmjs.com/creating-and-publishing-scoped-public-packages" target="_blank" rel="noopener noreferrer">Follow this guide<ExternalLinkIcon/></a> to publish your code as an npm package. You can see <a href="https://github.com/dylburger/pd" target="_blank" rel="noopener noreferrer">the code for an example package here<ExternalLinkIcon/></a>, <code>@dylburger/pd</code>.</li>
<li>In any workflow, you can <code>import</code> code provided by your package.</li>
</ol>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token comment">// import the random function from this example package</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> random <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@dylburger/pd"</span><span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h3 id="step-by-step" tabindex="-1"><a class="header-anchor" href="#step-by-step" aria-hidden="true">#</a> Step by step</h3>
<p>This guide will walk you through how to create and publish an npm package. You can <code>import</code> the code from this package in any Pipedream workflow.</p>
<ol>
<li>Open the <a href="https://docs.npmjs.com/creating-and-publishing-scoped-public-packages" target="_blank" rel="noopener noreferrer">publishing guide<ExternalLinkIcon/></a> from npm. Follow steps 1 - 7.</li>
<li>Create an <code>index.js</code> file within your package's directory with the following contents:</li>
</ol>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> Math<span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// Read https://www.sitepoint.com/understanding-module-exports-exports-node-js/</span>
<span class="token comment">// for more information on this syntax</span>
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  random<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><p>The <code>random</code> function is just an example - you can keep this code or replace it with any function or code you'd like to use on Pipedream.</p>
<ol start="3">
<li>You'll need to publish a <strong>public</strong> package to use it on Pipedream. Make sure to <a href="https://docs.npmjs.com/creating-and-publishing-scoped-public-packages#reviewing-package-contents-for-sensitive-or-unnecessary-information" target="_blank" rel="noopener noreferrer">review your code for any sensitive information<ExternalLinkIcon/></a>.</li>
<li>Follow the instructions in the <a href="https://docs.npmjs.com/creating-and-publishing-scoped-public-packages#publishing-scoped-public-packages" target="_blank" rel="noopener noreferrer">Publishing scoped public packages section<ExternalLinkIcon/></a> of the npm guide to publish your package to npm's registry.</li>
<li>In a Pipedream workflow, <code>import</code> the <code>random</code> function from the example, or run the other code provided by your package:</li>
</ol>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token comment">// import the random function</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> random <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"@your-username/your-package"</span><span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><ol start="6">
<li>If you need to add more code to your package, add it to your <code>index.js</code> file, increment the <code>version</code> in your <code>package.json</code> file, and publish your package again.</li>
</ol>
<Footer />
</template>
