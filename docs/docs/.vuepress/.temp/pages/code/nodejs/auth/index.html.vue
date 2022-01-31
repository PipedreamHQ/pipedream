<template><h1 id="connecting-apps-in-node-js" tabindex="-1"><a class="header-anchor" href="#connecting-apps-in-node-js" aria-hidden="true">#</a> Connecting apps in Node.js</h1>
<p>When you use <a href="/components/actions/" target="_blank" rel="noopener noreferrer">prebuilt actions<ExternalLinkIcon/></a> tied to apps, you don't need to write the code to authorize API requests. Just <a href="/connected-accounts/#connecting-accounts" target="_blank" rel="noopener noreferrer">connect your account<ExternalLinkIcon/></a> for that app and run your workflow.</p>
<p>But sometimes you'll need to <a href="/code/nodejs" target="_blank" rel="noopener noreferrer">write your own code<ExternalLinkIcon/></a>. You can also connect apps to custom code steps, using the auth information to authorize requests to that app.</p>
<p>For example, you may want to send a Slack message from a step. We use Slack's OAuth integration to authorize sending messages from your workflows.</p>
<p>To wire up a Slack account to a workflow, define it as a <code>prop</code> to the workflow.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> WebClient <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@slack/web-api'</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token comment">// This creates a connection called "slack" that connects a Slack account.</span>
    <span class="token literal-property property">slack</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">'app'</span><span class="token punctuation">,</span>
      <span class="token literal-property property">app</span><span class="token operator">:</span> <span class="token string">'slack'</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> steps<span class="token punctuation">,</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> web <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">WebClient</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>slack<span class="token punctuation">.</span>$auth<span class="token punctuation">.</span>oauth_access_token<span class="token punctuation">)</span>

    <span class="token keyword">return</span> <span class="token keyword">await</span> web<span class="token punctuation">.</span>chat<span class="token punctuation">.</span><span class="token function">postMessage</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">"Hello, world!"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">channel</span><span class="token operator">:</span> <span class="token string">"#general"</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><p>Now the step in the workflow builder will allow you to connect your Slack account:</p>
<div>
  <img src="@source/code/nodejs/auth/images/slack-auth-prop-example.png" alt="Connect a Slack account to a Node.js code step using a prop" width="100%"/>
</div>
<nav class="table-of-contents"><ul><li><RouterLink to="#accessing-connected-account-data-with-this-appname-auth">Accessing connected account data with this.appName.$auth</RouterLink></li><li><RouterLink to="#writing-custom-steps-to-use-this-appname-auths">Writing custom steps to use this.appName.$auths</RouterLink><ul><li><RouterLink to="#using-the-code-templates-tied-to-apps">Using the code templates tied to apps</RouterLink></li><li><RouterLink to="#manually-connecting-apps-to-steps">Manually connecting apps to steps</RouterLink></li></ul></li><li><RouterLink to="#custom-auth-tokens-secrets">Custom auth tokens / secrets</RouterLink></li><li><RouterLink to="#learn-more-about-props">Learn more about props</RouterLink></li></ul></nav>
<h2 id="accessing-connected-account-data-with-this-appname-auth" tabindex="-1"><a class="header-anchor" href="#accessing-connected-account-data-with-this-appname-auth" aria-hidden="true">#</a> Accessing connected account data with <code>this.appName.$auth</code></h2>
<p>In our Slack example above, we created a Slack <code>WebClient</code> using the Slack OAuth access token:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">const</span> web <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">WebClient</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>slack<span class="token punctuation">.</span>$auth<span class="token punctuation">.</span>oauth_access_token<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>Where did <code>this.slack</code> come from? Good question. It was generated by the definition we made in <code>props</code>:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token comment">// the name of the app from the key of the prop, in this case it's "slack"</span>
    <span class="token literal-property property">slack</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token comment">// define that this prop is an app</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">'app'</span><span class="token punctuation">,</span>
      <span class="token comment">// define that this app connects to Slack </span>
      <span class="token literal-property property">app</span><span class="token operator">:</span> <span class="token string">'slack'</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// ... rest of the Node.js step </span>
</code></pre><div class="highlight-lines"><br><br><br><div class="highlight-line">&nbsp;</div><br><div class="highlight-line">&nbsp;</div><br><div class="highlight-line">&nbsp;</div><br><br><br></div><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br></div></div><p>The Slack access token is generated by Pipedream, and is available to this step in the <code>this.slack.$auth</code> object:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">slack</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">'app'</span><span class="token punctuation">,</span>
      <span class="token literal-property property">app</span><span class="token operator">:</span> <span class="token string">'slack'</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> steps<span class="token punctuation">,</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter">steps<span class="token punctuation">,</span> $</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token comment">// Authentication details for all of your apps are accessible under the special $ variable:</span>
      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>slack<span class="token punctuation">.</span>$auths<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p><code>this.appName.$auths</code> contains named properties for each account you connect to the associated step. Here, we connected Slack, so <code>this.slack.$auths</code> contains the Slack auth info (the <code>oauth_access_token</code>).</p>
<p>The names of the properties for each connected account will differ with the account. Pipedream typically exposes OAuth access tokens as <code>oauth_access_token</code>, and API keys under the property <code>api_key</code>. But if there's a service-specific name for the tokens (for example, if the service calls it <code>server_token</code>), we prefer that name, instead.</p>
<p>To list the <code>this.[app name].$auths</code> properties available to you for a given app, run <code>Object.keys</code> on the app:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code>console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>Object<span class="token punctuation">.</span><span class="token function">keys</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>slack<span class="token punctuation">.</span>$auth<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token comment">// Replace this.slack with your app's name</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>and run your workflow. You'll see the property names in the logs below your step.</p>
<h2 id="writing-custom-steps-to-use-this-appname-auths" tabindex="-1"><a class="header-anchor" href="#writing-custom-steps-to-use-this-appname-auths" aria-hidden="true">#</a> Writing custom steps to use <code>this.appName.$auths</code></h2>
<p>You can write code that utilizes connected accounts in a few different ways:</p>
<h3 id="using-the-code-templates-tied-to-apps" tabindex="-1"><a class="header-anchor" href="#using-the-code-templates-tied-to-apps" aria-hidden="true">#</a> Using the code templates tied to apps</h3>
<p>When you write custom code that connects to an app, you can start with a code snippet Pipedream provides for each app. This is called the <strong>test request</strong>.</p>
<p>When you search for an app in a step:</p>
<ol>
<li>Click the <strong>+</strong> button below any step.</li>
<li>Search for the app you're looking for and select it from the list.</li>
<li>Select the option to <strong>Use any [app] API</strong>.</li>
</ol>
<p>This code operates as a template you can extend, and comes preconfigured with the connection to the target app and the code for authorizing requests to the API. You can modify this code however you'd like.</p>
<h3 id="manually-connecting-apps-to-steps" tabindex="-1"><a class="header-anchor" href="#manually-connecting-apps-to-steps" aria-hidden="true">#</a> Manually connecting apps to steps</h3>
<p>See the Connected Accounts docs for <a href="/connected-accounts/#from-a-code-step" target="_blank" rel="noopener noreferrer">connecting an account to a code step<ExternalLinkIcon/></a>.</p>
<h2 id="custom-auth-tokens-secrets" tabindex="-1"><a class="header-anchor" href="#custom-auth-tokens-secrets" aria-hidden="true">#</a> Custom auth tokens / secrets</h2>
<p>When you want to connect to a 3rd party service that isn't supported by Pipedream, you can store those secrets in <a href="/environment-variables/" target="_blank" rel="noopener noreferrer">Environment Variables<ExternalLinkIcon/></a>.</p>
<h2 id="learn-more-about-props" tabindex="-1"><a class="header-anchor" href="#learn-more-about-props" aria-hidden="true">#</a> Learn more about <code>props</code></h2>
<p>Not only can <code>props</code> be used to connect apps to workflow steps, but they can also be used to <a href="/code/nodejs/#passing-props-to-code-steps" target="_blank" rel="noopener noreferrer">collect properties collected from user input<ExternalLinkIcon/></a> and <a href="/code/nodejs/#managing-state" target="_blank" rel="noopener noreferrer">save data between workflow runs<ExternalLinkIcon/></a>.</p>
<Footer />
</template>
