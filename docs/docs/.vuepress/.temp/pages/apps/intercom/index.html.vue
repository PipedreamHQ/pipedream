<template><h1 id="intercom" tabindex="-1"><a class="header-anchor" href="#intercom" aria-hidden="true">#</a> Intercom</h1>
<p>Pipedream allows you to connect to the <a href="https://developers.intercom.com/intercom-api-reference/reference" target="_blank" rel="noopener noreferrer">Intercom REST API<ExternalLinkIcon/></a> from any workflow.</p>
<h2 id="connecting-to-intercom-from-pipedream" tabindex="-1"><a class="header-anchor" href="#connecting-to-intercom-from-pipedream" aria-hidden="true">#</a> Connecting to Intercom from Pipedream</h2>
<ol>
<li>First, sign up for Pipedream at <a href="https://pipedream.com" target="_blank" rel="noopener noreferrer">https://pipedream.com<ExternalLinkIcon/></a>.</li>
<li><a href="https://pipedream.com/new" target="_blank" rel="noopener noreferrer">Create a new workflow<ExternalLinkIcon/></a>.</li>
<li>Select a <a href="/workflows/steps/triggers/" target="_blank" rel="noopener noreferrer">trigger<ExternalLinkIcon/></a> for your workflow (for example, HTTP or Cron).</li>
<li><a href="/workflows/steps/" target="_blank" rel="noopener noreferrer">Add a new step<ExternalLinkIcon/></a> and search for &quot;Intercom&quot;. This will display <a href="/components/actions/" target="_blank" rel="noopener noreferrer">actions<ExternalLinkIcon/></a> associated with the Intercom app. You can choose to either &quot;Run Node.js code with Intercom&quot; or select one of the prebuilt actions for performing common API operations.</li>
<li>Once you've added a step, press the <strong>Connect Account</strong> button near the top. If this is your first time authorizing Pipedream's access to your Intercom account, you'll be prompted to accept that access, and Pipedream will store the authorization grant to enable the workflow to access the Intercom API. If you've already linked an Intercom account via Pipedream, pressing <strong>Connect Account</strong> will list any existing accounts you've linked.</li>
</ol>
<h2 id="removing-pipedream-s-access-to-your-intercom-account" tabindex="-1"><a class="header-anchor" href="#removing-pipedream-s-access-to-your-intercom-account" aria-hidden="true">#</a> Removing Pipedream's access to your Intercom account</h2>
<p>You can revoke Pipedream's access to your Intercom account by uninstalling the app from your list of Intercom apps in your account.</p>
<p>As soon as you do, any Pipedream workflows that connect to Intercom will immediately fail to work.</p>
<p>You can delete any Intercom connected accounts in <a href="https://pipedream.com/accounts" target="_blank" rel="noopener noreferrer">your list of Pipedream Accounts<ExternalLinkIcon/></a>, as well.</p>
<Footer />
</template>
