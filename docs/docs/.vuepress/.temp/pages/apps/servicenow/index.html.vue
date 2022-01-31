<template><h1 id="servicenow" tabindex="-1"><a class="header-anchor" href="#servicenow" aria-hidden="true">#</a> ServiceNow</h1>
<p>Pipedream lets you interact with the <a href="https://docs.servicenow.com/bundle/orlando-application-development/page/build/applications/concept/api-rest.html" target="_blank" rel="noopener noreferrer">ServiceNow REST API<ExternalLinkIcon/></a> in workflows. You can use Pipedream's <a href="/components/actions/" target="_blank" rel="noopener noreferrer">prebuilt actions<ExternalLinkIcon/></a> (or write your own) to perform common operations, or <a href="/workflows/steps/code/" target="_blank" rel="noopener noreferrer">run any Node code<ExternalLinkIcon/></a> to talk to their API.</p>
<h2 id="setting-up-an-app-in-your-servicenow-instance" tabindex="-1"><a class="header-anchor" href="#setting-up-an-app-in-your-servicenow-instance" aria-hidden="true">#</a> Setting up an app in your ServiceNow instance</h2>
<p>Before you can use the ServiceNow REST API from a workflow, you need to configure an OAuth app in your ServiceNow instance that will grant access tokens to your users and authenticate requests to its REST API.</p>
<ol>
<li>In your ServiceNow instance, visit the <strong>Application Registry</strong> and create a new app, choosing the <strong>Create an OAuth API endpoint for external clients</strong> option.</li>
<li>Name it something memorable, then leave every other field blank or keep the defaults, except for the <strong>Redirect URL</strong>, which should be: <code>https://api.pipedream.com/connect/oauth/oa_g2oiqA/callback</code>. Your app should look something like this:</li>
</ol>
<div>
<img alt="ServiceNow OAuth app config" src="@source/apps/servicenow/images/oauth-app-config.png">
</div>
<ol start="3">
<li>Next, you'll need to copy the client ID and secret generated in <strong>Step 2</strong>, and add another app. This time, select the option to <strong>Connect to a third party OAuth Provider</strong>.</li>
<li>Name this app something like <strong>Pipedream OAuth Validator</strong>, and add the client ID / secret from <strong>Step 2</strong>. Change the grant type to <strong>Authorization Code</strong>, and set the <strong>Token URL</strong> to <code>oauth_token.do</code> (without any hostname, this refers to the current instance). Finally, add the same <strong>Redirect URL</strong> as you did above: <code>https://api.pipedream.com/connect/oauth/oa_g2oiqA/callback</code>. This app's configuration should look something like this when complete:</li>
</ol>
<div>
<img alt="ServiceNow OAuth validator app config" src="@source/apps/servicenow/images/oauth-validator-config.png">
</div>
<ol start="5">
<li>Visit <a href="https://pipedream.com/accounts" target="_blank" rel="noopener noreferrer">https://pipedream.com/accounts<ExternalLinkIcon/></a>, and click the button labeled <strong>Click Here to Connect An App</strong> in the top-right. In the modal that appears, search for <strong>ServiceNow</strong> and select it. You'll be prompted to enter the client ID and client secret from <strong>Step 2</strong> above, as well as the name of your instance. The instance name is the <em>host</em> portion of your instance's URL: that is, the <code>dev98042</code> in <code>https://dev98042.service-now.com/</code>.</li>
</ol>
<div>
<img alt="Pipedream app config" width="600" src="@source/apps/servicenow/images/pipedream-app-config.png">
</div>
<ol start="6">
<li>Press <strong>Connect</strong> in the bottom-right of the modal. This should open up a new window asking you to login to your ServiceNow instance. This authorizes Pipedream's access to your ServiceNow account, and you should be ready to connect to your instance's REST API!</li>
</ol>
<p>Collectively, the two apps you configured in your ServiceNow instance allow your instance to issue new OAuth access tokens for the user who authenticated in <strong>Step 6</strong>. This allows Pipedream to retrieve a fresh access token before it makes requests to the ServiceNow REST API.</p>
<h2 id="servicenow-authorization-reference" tabindex="-1"><a class="header-anchor" href="#servicenow-authorization-reference" aria-hidden="true">#</a> ServiceNow Authorization Reference</h2>
<p><a href="https://docs.servicenow.com/bundle/orlando-platform-administration/page/administer/security/concept/c_OAuthAuthorizationCodeFlow.html" target="_blank" rel="noopener noreferrer">This ServiceNow doc<ExternalLinkIcon/></a> describes the general flow we ask you to implement above. In that doc, the app you create in <strong>Step 2</strong> is referred to as the <strong>client application</strong>, and the app in <strong>Step 4</strong> is referred to as the <strong>OAuth provider application registry record</strong>.</p>
</template>
