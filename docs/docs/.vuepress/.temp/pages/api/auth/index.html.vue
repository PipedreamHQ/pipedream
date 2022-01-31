<template><h1 id="authentication" tabindex="-1"><a class="header-anchor" href="#authentication" aria-hidden="true">#</a> Authentication</h1>
<nav class="table-of-contents"><ul><li><RouterLink to="#pipedream-api-key">Pipedream API Key</RouterLink></li><li><RouterLink to="#authorizing-api-requests">Authorizing API requests</RouterLink></li><li><RouterLink to="#using-the-pipedream-cli">Using the Pipedream CLI</RouterLink></li><li><RouterLink to="#revoking-your-api-key">Revoking your API key</RouterLink></li></ul></nav>
<h2 id="pipedream-api-key" tabindex="-1"><a class="header-anchor" href="#pipedream-api-key" aria-hidden="true">#</a> Pipedream API Key</h2>
<p>When you sign up for Pipedream, an API key is automatically generated for your account. You can use this key to authorize requests to the API.</p>
<p>You'll find this API key in your <a href="https://pipedream.com/settings/account" target="_blank" rel="noopener noreferrer">Account Settings<ExternalLinkIcon/></a> (<strong>Settings</strong> -&gt; <strong>Account</strong>).</p>
<h2 id="authorizing-api-requests" tabindex="-1"><a class="header-anchor" href="#authorizing-api-requests" aria-hidden="true">#</a> Authorizing API requests</h2>
<p>Pipedream uses <a href="https://oauth.net/2/bearer-tokens/" target="_blank" rel="noopener noreferrer">Bearer Authentication<ExternalLinkIcon/></a> to authorize your access to the API or SSE event streams. When you make API requests, pass an <code>Authorization</code> header of the following format:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>Authorization: Bearer &lt;api key>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>For example, here's how you can use <code>cURL</code> to fetch profile information for the authenticated user:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token string">'https://api.pipedream.com/v1/users/me'</span> <span class="token punctuation">\</span>
  -H <span class="token string">'Authorization: Bearer &lt;api_key>'</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h2 id="using-the-pipedream-cli" tabindex="-1"><a class="header-anchor" href="#using-the-pipedream-cli" aria-hidden="true">#</a> Using the Pipedream CLI</h2>
<p>You can <a href="/cli/login/" target="_blank" rel="noopener noreferrer">link the CLI to your Pipedream account<ExternalLinkIcon/></a>, which will automatically pass your API key in the <code>Authorization</code> header with every API request.</p>
<h2 id="revoking-your-api-key" tabindex="-1"><a class="header-anchor" href="#revoking-your-api-key" aria-hidden="true">#</a> Revoking your API key</h2>
<p>You can revoke your API key in your <a href="https://pipedream.com/settings/account" target="_blank" rel="noopener noreferrer">Account Settings<ExternalLinkIcon/></a> (<strong>Settings</strong> -&gt; <strong>Account</strong>). Click on the <strong>REVOKE</strong> button directly to the right of your API key.</p>
<p>This will revoke your original API key, generating a new one. Any API requests made with the original token will yield a <code>401 Unauthorized</code> error.</p>
<Footer />
</template>
