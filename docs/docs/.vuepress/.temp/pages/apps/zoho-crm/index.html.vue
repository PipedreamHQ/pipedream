<template><h1 id="zoho-crm" tabindex="-1"><a class="header-anchor" href="#zoho-crm" aria-hidden="true">#</a> Zoho CRM</h1>
<p>Pipedream allows you to connect to the <a href="https://www.zoho.com/crm/developer/docs/api/v2/" target="_blank" rel="noopener noreferrer">Zoho CRM API<ExternalLinkIcon/></a> from any workflow.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#connecting-to-the-zoho-crm-api-from-pipedream">Connecting to the Zoho CRM API from Pipedream</RouterLink></li><li><RouterLink to="#example-workflows">Example Workflows</RouterLink></li></ul></nav>
<h2 id="connecting-to-the-zoho-crm-api-from-pipedream" tabindex="-1"><a class="header-anchor" href="#connecting-to-the-zoho-crm-api-from-pipedream" aria-hidden="true">#</a> Connecting to the Zoho CRM API from Pipedream</h2>
<ol>
<li>First, sign up for Pipedream at <a href="https://pipedream.com" target="_blank" rel="noopener noreferrer">https://pipedream.com<ExternalLinkIcon/></a>.</li>
<li><a href="https://pipedream.com/new" target="_blank" rel="noopener noreferrer">Create a new workflow<ExternalLinkIcon/></a>.</li>
<li>Select a <a href="/workflows/steps/triggers/" target="_blank" rel="noopener noreferrer">trigger<ExternalLinkIcon/></a> for your workflow (for example, HTTP or Cron).</li>
<li><a href="/workflows/steps/" target="_blank" rel="noopener noreferrer">Add a new step<ExternalLinkIcon/></a> and search for &quot;Zoho CRM&quot;. This will display <a href="/components/actions/" target="_blank" rel="noopener noreferrer">actions<ExternalLinkIcon/></a> associated with the Zoho CRM app. You can choose to either &quot;Run Node.js code with Zoho CRM&quot; or select one of the prebuilt actions for performing common API operations.</li>
<li>Once you've added a step, press the <strong>Connect Zoho CRM</strong> button near the top. If this is your first time authorizing Pipedream's access to your Zoho CRM account, you'll be prompted to accept that access, and Pipedream will store the authorization grant to enable the workflow to access the API. If you've already linked a Zoho CRM account via Pipedream, pressing <strong>Connect Zoho CRM</strong> will list any existing accounts you've linked.</li>
</ol>
<p>Once you've connected your account, you can run your workflow and fetch data from the API. You can change any of the code associated with this step, changing the API endpoint you'd like to retrieve data from, or modifying the results in any way.</p>
<h2 id="example-workflows" tabindex="-1"><a class="header-anchor" href="#example-workflows" aria-hidden="true">#</a> Example Workflows</h2>
<ol>
<li>Here is example of how you can trigger an API call to Zoho CRM using a Cron Schedule: <a href="https://pipedream.com/@dylburger/zoho-crm-integration-example-2-p_n1CKQLK/edit" target="_blank" rel="noopener noreferrer">https://pipedream.com/@dylburger/zoho-crm-integration-example-2-p_n1CKQLK/edit<ExternalLinkIcon/></a></li>
<li>Here is an example of how you can trigger an API call to Zoho CRM using an HTTP request: <a href="https://pipedream.com/@dylburger/zoho-crm-integration-example-1-p_LQCnPWP/edit" target="_blank" rel="noopener noreferrer">https://pipedream.com/@dylburger/zoho-crm-integration-example-1-p_LQCnPWP/edit<ExternalLinkIcon/></a></li>
</ol>
<Footer />
</template>
