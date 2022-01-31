<template><h1 id="logging-into-the-cli" tabindex="-1"><a class="header-anchor" href="#logging-into-the-cli" aria-hidden="true">#</a> Logging into the CLI</h1>
<p>To start using the Pipedream CLI, you'll need to link it to your Pipedream account. If you don't have a Pipedream account, you can sign up from the CLI.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#existing-pipedream-account">Existing Pipedream account</RouterLink></li><li><RouterLink to="#signing-up-for-pipedream-via-the-cli">Signing up for Pipedream via the CLI</RouterLink></li><li><RouterLink to="#logging-out-of-the-cli">Logging out of the CLI</RouterLink></li><li><RouterLink to="#using-the-cli-to-manage-multiple-accounts">Using the CLI to manage multiple accounts</RouterLink></li></ul></nav>
<h2 id="existing-pipedream-account" tabindex="-1"><a class="header-anchor" href="#existing-pipedream-account" aria-hidden="true">#</a> Existing Pipedream account</h2>
<p>If you already have a Pipedream account, run</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd login
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>This will open up a new window in your default browser. If you're already logged into your Pipedream account in this browser, this will immediately link the CLI to your account, writing your API key for that account to your <a href="/cli/reference/#cli-config-file" target="_blank" rel="noopener noreferrer"><code>pd</code> config file<ExternalLinkIcon/></a>.</p>
<p>Otherwise, you'll be asked to login.</p>
<p>Once you're done, go back to your shell and you should see confirmation that your account is linked:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>> pd login
Logged in as dylburger (dylan@pipedream.com)
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h2 id="signing-up-for-pipedream-via-the-cli" tabindex="-1"><a class="header-anchor" href="#signing-up-for-pipedream-via-the-cli" aria-hidden="true">#</a> Signing up for Pipedream via the CLI</h2>
<p>If you haven't signed up for a Pipedream account, you can create an account using the CLI:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd signup
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>This will open up a new window in your default browser. You'll be asked to sign up for Pipedream here. Once you do, your account will be linked to the CLI, writing your API key for that account to your <a href="/cli/reference/#cli-config-file" target="_blank" rel="noopener noreferrer"><code>pd</code> config file<ExternalLinkIcon/></a>.</p>
<p>Once you're done, go back to your shell and you should see confirmation that your account is linked:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>> pd signup
Logged in as dylburger (dylan@pipedream.com)
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h2 id="logging-out-of-the-cli" tabindex="-1"><a class="header-anchor" href="#logging-out-of-the-cli" aria-hidden="true">#</a> Logging out of the CLI</h2>
<p>You can log out of the CLI by running:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>pd logout
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>This will remove your API key from the <a href="/cli/reference/#cli-config-file" target="_blank" rel="noopener noreferrer"><code>pd</code> config file<ExternalLinkIcon/></a>.</p>
<h2 id="using-the-cli-to-manage-multiple-accounts" tabindex="-1"><a class="header-anchor" href="#using-the-cli-to-manage-multiple-accounts" aria-hidden="true">#</a> Using the CLI to manage multiple accounts</h2>
<p>If you have multiple Pipedream accounts, you can use <a href="/cli/reference/#profiles" target="_blank" rel="noopener noreferrer">profiles<ExternalLinkIcon/></a> to ensure the CLI can manage resources for each.</p>
<Footer />
</template>
