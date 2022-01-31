<template><h1 id="connected-accounts" tabindex="-1"><a class="header-anchor" href="#connected-accounts" aria-hidden="true">#</a> Connected Accounts</h1>
<p>Pipedream allows you to connect accounts for various apps and services within our UI. Once you connect an account, you can link that account to any step of a workflow, and use the OAuth access tokens, API key, or other auth info to make API requests to the desired service.</p>
<p>For example, you can connect to Slack from Pipedream (via their OAuth integration), and use the access token Pipedream generates to authorize requests:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> WebClient <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">'@slack/web-api'</span><span class="token punctuation">;</span>

<span class="token function">defineComponent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">slack</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">'app'</span><span class="token punctuation">,</span>
      <span class="token literal-property property">app</span><span class="token operator">:</span> <span class="token string">'slack'</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> steps<span class="token punctuation">,</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> web <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">WebClient</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>slack<span class="token punctuation">.</span>$auths<span class="token punctuation">.</span>oauth_access_token<span class="token punctuation">)</span>
    <span class="token keyword">return</span> <span class="token keyword">await</span> web<span class="token punctuation">.</span>chat<span class="token punctuation">.</span><span class="token function">postMessage</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">text</span><span class="token operator">:</span> <span class="token string">"Hello, world!"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">channel</span><span class="token operator">:</span> <span class="token string">"#general"</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br></div></div><nav class="table-of-contents"><ul><li><RouterLink to="#supported-apps">Supported Apps</RouterLink></li><li><RouterLink to="#connecting-accounts">Connecting accounts</RouterLink><ul><li><RouterLink to="#from-an-action">From an action</RouterLink></li><li><RouterLink to="#from-a-code-step">From a code step</RouterLink></li></ul></li><li><RouterLink to="#managing-connected-accounts-from-apps">Managing Connected Accounts from Apps</RouterLink></li><li><RouterLink to="#reconnect-an-account">Reconnect an account</RouterLink></li><li><RouterLink to="#types-of-integrations">Types of Integrations</RouterLink><ul><li><RouterLink to="#oauth">OAuth</RouterLink></li><li><RouterLink to="#key-based">Key-based</RouterLink></li></ul></li><li><RouterLink to="#account-security">Account Security</RouterLink></li><li><RouterLink to="#requesting-a-new-app-or-service">Requesting a new app or service</RouterLink></li></ul></nav>
<h2 id="supported-apps" tabindex="-1"><a class="header-anchor" href="#supported-apps" aria-hidden="true">#</a> Supported Apps</h2>
<p>Pipedream supports <a href="https://pipedream.com/apps" target="_blank" rel="noopener noreferrer">400+ apps<ExternalLinkIcon/></a>, with more added every day.</p>
<p>If we don't support a service you need, please <a href="#requesting-a-new-app-or-service">request an app here</a>.</p>
<h2 id="connecting-accounts" tabindex="-1"><a class="header-anchor" href="#connecting-accounts" aria-hidden="true">#</a> Connecting accounts</h2>
<h3 id="from-an-action" tabindex="-1"><a class="header-anchor" href="#from-an-action" aria-hidden="true">#</a> From an action</h3>
<p>Prebuilt actions that connect to a specific service require you connect your account for that service before you run your workflow. Click the <strong>Connect [APP]</strong> button to get started.</p>
<p>Depending on the integration, this will either:</p>
<ul>
<li>Open the OAuth flow for the target service, prompting you to authorize Pipedream to access your account, or</li>
<li>Open a modal asking for your API credentials for key-based services</li>
</ul>
<p>If you've already connected an account for this app, you'll also see a list of existing accounts to select from.</p>
<h3 id="from-a-code-step" tabindex="-1"><a class="header-anchor" href="#from-a-code-step" aria-hidden="true">#</a> From a code step</h3>
<p>You can connect accounts to code steps, too:</p>
<ol>
<li>Click the <strong>+</strong> button to the left of any step.</li>
<li>Search for your app from the list.</li>
</ol>
<p>Selecting an app will present the same <strong>Connect Account</strong> button you'll see for actions.</p>
<h2 id="managing-connected-accounts-from-apps" tabindex="-1"><a class="header-anchor" href="#managing-connected-accounts-from-apps" aria-hidden="true">#</a> Managing Connected Accounts from Apps</h2>
<p>Visit <a href="https://pipedream.com/accounts" target="_blank" rel="noopener noreferrer">https://pipedream.com/accounts<ExternalLinkIcon/></a> to see the list of your connected accounts.</p>
<p>You can perform the following operations on accounts:</p>
<ul>
<li>Add a new account</li>
<li>Delete an account</li>
<li>Reconnect an account</li>
<li>Change the nickname associated with an account</li>
</ul>
<p>You'll also see some data associated with these accounts:</p>
<ul>
<li>For OAuth apps, the scopes you've granted Pipedream access to</li>
<li>The workflows where you're using the account.</li>
</ul>
<h2 id="reconnect-an-account" tabindex="-1"><a class="header-anchor" href="#reconnect-an-account" aria-hidden="true">#</a> Reconnect an account</h2>
<p>If you encounter errors in a step that appear to be related to credentials / authorization, you can reconnect your account:</p>
<ol>
<li>Visit <a href="https://pipedream.com/accounts" target="_blank" rel="noopener noreferrer">https://pipedream.com/accounts<ExternalLinkIcon/></a></li>
<li>Search for your account</li>
<li>Click on the <em>...</em> next to your account, on the right side of the page</li>
<li>Select the option to <strong>Reconnect</strong> your account</li>
</ol>
<h2 id="types-of-integrations" tabindex="-1"><a class="header-anchor" href="#types-of-integrations" aria-hidden="true">#</a> Types of Integrations</h2>
<h3 id="oauth" tabindex="-1"><a class="header-anchor" href="#oauth" aria-hidden="true">#</a> OAuth</h3>
<p>For services that support OAuth, Pipedream operates an OAuth application that mediates access to the service so you don't have to maintain your own app, store refresh and access tokens, and more.</p>
<p>When you connect an account, you'll see a new window open where you authorize the Pipedream application to access data in your account. Pipedream stores the OAuth refresh token tied to your authorization grant, automatically generating access tokens you can use to authorized requests to the service's API. You can access these tokens <a href="/workflows/steps/code/auth/" target="_blank" rel="noopener noreferrer">in code steps<ExternalLinkIcon/></a>.</p>
<h3 id="key-based" tabindex="-1"><a class="header-anchor" href="#key-based" aria-hidden="true">#</a> Key-based</h3>
<p>We also support services that use API keys or other long-lived tokens to authorize requests.</p>
<p>For those services, you'll have to create your keys in the service itself, then add them to your connected accounts in Pipedream.</p>
<p>For example, if you add a new connected account for <strong>Sendgrid</strong>, you'll be asked to add your Sendgrid API key.</p>
<h2 id="account-security" tabindex="-1"><a class="header-anchor" href="#account-security" aria-hidden="true">#</a> Account Security</h2>
<p><a href="/privacy-and-security/#third-party-oauth-grants-api-keys-and-environment-variables" target="_blank" rel="noopener noreferrer">See our security docs<ExternalLinkIcon/></a> for details on how Pipedream secures your connected accounts.</p>
<h2 id="requesting-a-new-app-or-service" tabindex="-1"><a class="header-anchor" href="#requesting-a-new-app-or-service" aria-hidden="true">#</a> Requesting a new app or service</h2>
<p>Please request new apps by <a href="https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&amp;labels=app%2C+enhancement&amp;template=app---service-integration.md&amp;title=%5BAPP%5D" target="_blank" rel="noopener noreferrer">opening an issue on GitHub<ExternalLinkIcon/></a>.</p>
<Footer />
</template>
