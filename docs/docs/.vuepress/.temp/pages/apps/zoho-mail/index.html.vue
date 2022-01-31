<template><h1 id="zoho-mail" tabindex="-1"><a class="header-anchor" href="#zoho-mail" aria-hidden="true">#</a> Zoho Mail</h1>
<p>Pipedream allows you to connect to the <a href="https://www.zoho.com/mail/help/api/" target="_blank" rel="noopener noreferrer">Zoho Mail API<ExternalLinkIcon/></a> from any workflow.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#connecting-to-the-zoho-mail-api-from-pipedream">Connecting to the Zoho Mail API from Pipedream</RouterLink></li></ul></nav>
<h2 id="connecting-to-the-zoho-mail-api-from-pipedream" tabindex="-1"><a class="header-anchor" href="#connecting-to-the-zoho-mail-api-from-pipedream" aria-hidden="true">#</a> Connecting to the Zoho Mail API from Pipedream</h2>
<ol>
<li>First, sign up for Pipedream at <a href="https://pipedream.com" target="_blank" rel="noopener noreferrer">https://pipedream.com<ExternalLinkIcon/></a>.</li>
<li><a href="https://pipedream.com/new" target="_blank" rel="noopener noreferrer">Create a new workflow<ExternalLinkIcon/></a>.</li>
<li>Select a <a href="/workflows/steps/triggers/" target="_blank" rel="noopener noreferrer">trigger<ExternalLinkIcon/></a> for your workflow (for example, HTTP or Cron).</li>
<li><a href="/workflows/steps/" target="_blank" rel="noopener noreferrer">Add a new step<ExternalLinkIcon/></a> and search for &quot;Zoho Mail&quot;. This will display <a href="/components/actions/" target="_blank" rel="noopener noreferrer">actions<ExternalLinkIcon/></a> associated with the Zoho Mail app. You can choose to either &quot;Run Node.js code with Zoho Mail&quot; or select one of the prebuilt actions for performing common API operations.</li>
<li>Once you've added a step, press the <strong>Connect Zoho Mail</strong> button near the top. If this is your first time authorizing Pipedream's access to your Zoho Mail account, you'll be prompted to accept that access, and Pipedream will store the authorization grant to enable the workflow to access the API. If you've already linked a Zoho Mail account via Pipedream, pressing <strong>Connect Zoho Mail</strong> will list any existing accounts you've linked.</li>
</ol>
<p>Once you've connected your account, you can run your workflow and fetch data from the API. You can change any of the code associated with this step, changing the API endpoint you'd like to retrieve data from, or modifying the results in any way.</p>
<Footer />
</template>
