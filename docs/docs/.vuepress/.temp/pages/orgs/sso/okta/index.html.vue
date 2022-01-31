<template><h1 id="sso-okta" tabindex="-1"><a class="header-anchor" href="#sso-okta" aria-hidden="true">#</a> SSO - Okta</h1>
<p>Pipedream supports Single-sign on (SSO) with Okta. This guide shows you how to configure SSO in Pipedream to authenticate with your Okta org.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#requirements">Requirements</RouterLink></li><li><RouterLink to="#configuration">Configuration</RouterLink></li><li><RouterLink to="#important-details">Important details</RouterLink></li></ul></nav>
<h2 id="requirements" tabindex="-1"><a class="header-anchor" href="#requirements" aria-hidden="true">#</a> Requirements</h2>
<ul>
<li>SSO is only supported for <a href="/orgs/" target="_blank" rel="noopener noreferrer">organizations<ExternalLinkIcon/></a> on the <a href="/pricing/#enterprise-plan" target="_blank" rel="noopener noreferrer">Enterprise plan<ExternalLinkIcon/></a>. Visit the <a href="https://pipedream.com/pricing" target="_blank" rel="noopener noreferrer">Pipedream pricing page<ExternalLinkIcon/></a> to upgrade.</li>
<li>You must be an administrator of your Pipedream organization</li>
<li>You must have an Okta account</li>
</ul>
<h2 id="configuration" tabindex="-1"><a class="header-anchor" href="#configuration" aria-hidden="true">#</a> Configuration</h2>
<ol>
<li>In your Okta <strong>Admin</strong> dashboard, select the <strong>Applications</strong> section and click <strong>Applications</strong> below that:</li>
</ol>
<div>
<img alt="Okta - application list" src="@source/orgs/sso/okta/images/step-1.png" width="250px">
</div>
<ol start="2">
<li>Click <strong>Browse App Catalog</strong>:</li>
</ol>
<div>
<img alt="Okta - browse app catalog" src="@source/orgs/sso/okta/images/step-2.png" width="400px">
</div>
<ol start="3">
<li>Search for &quot;Pipedream&quot; and select the Pipedream app:</li>
</ol>
<div>
<img alt="Okta - Pipedream app" src="@source/orgs/sso/okta/images/step-3.png">
</div>
<ol start="4">
<li>Click <strong>Add</strong>:</li>
</ol>
<div>
<img alt="Okta - Add Pipedream app" src="@source/orgs/sso/okta/images/step-4.png">
</div>
<ol start="5">
<li>Fill out the <strong>General Settings</strong> that Okta presents, and click <strong>Done</strong>:</li>
</ol>
<div>
<img alt="Okta - General Settings" src="@source/orgs/sso/okta/images/step-5.png" width="600px">
</div>
<ol start="6">
<li>Select the <strong>Sign On</strong> tab, and click <strong>Edit</strong> at the top right:</li>
</ol>
<div>
<img alt="Okta - Edit Sign In" src="@source/orgs/sso/okta/images/step-6.png" width="600px">
</div>
<ol start="7">
<li>Scroll down to the <strong>SAML 2.0</strong> settings. In the <strong>Default Relay State</strong> section, enter <code>organization_username</code>:</li>
</ol>
<div>
<img alt="Okta - Default Relay State" src="@source/orgs/sso/okta/images/step-7.png" width="500px">
</div>
<ol start="8">
<li>
<p>Set any other configuration options you need in that section or in the <strong>Credentials Details</strong> section, and click <strong>Save</strong>.</p>
</li>
<li>
<p>In the <strong>Sign On</strong> section, you'll see a section that includes the setup instructions for SAML:</p>
</li>
</ol>
<div>
<img alt="Okta - SAML" src="@source/orgs/sso/okta/images/step-9-1.png" width="500px">
</div>
<p>Click the <strong>Identity Provider metadata</strong> link and copy the URL from your browser's address bar:</p>
<div>
<img alt="Okta - Identity Metadata URL" src="@source/orgs/sso/okta/images/step-9-2.png">
</div>
<ol start="10">
<li>Visit your <a href="https://pipedream.com/settings/account" target="_blank" rel="noopener noreferrer">Pipedream organization settings<ExternalLinkIcon/></a>. Under the <strong>Auth</strong> section, add the metadata URL in the <strong>SAML</strong> section and click <strong>Confirm</strong>:</li>
</ol>
<div>
<img alt="Okta - Pipdeream Metadata URL" src="@source/orgs/sso/okta/images/step-10.png">
</div>
<ol start="11">
<li>Back in Okta, click on the <strong>Assignments</strong> tab of the Pipedream application. Click on the <strong>Assign</strong> dropdown and select <strong>Assign to People</strong>:</li>
</ol>
<div>
<img alt="Okta - Assign Users" src="@source/orgs/sso/okta/images/step-11.png">
</div>
<p>Assign the application to the relevant users in Okta, and Pipedream will configure the associated accounts on our end.</p>
<p>Users can log into Pipedream at <a href="https://pipedream.com/auth/sso" target="_blank" rel="noopener noreferrer">https://pipedream.com/auth/sso<ExternalLinkIcon/></a> by entering your organization's name (found in your <a href="https://pipedream.com/settings/account" target="_blank" rel="noopener noreferrer">Settings<ExternalLinkIcon/></a>). You can also access your SSO sign in URL directly by visiting <a href="https://pipedream.com/auth/sso" target="_blank" rel="noopener noreferrer">https://pipedream.com/auth/sso/your_org_name<ExternalLinkIcon/></a>, where <code>your_org_name</code> is the name of your org.</p>
<h2 id="important-details" tabindex="-1"><a class="header-anchor" href="#important-details" aria-hidden="true">#</a> Important details</h2>
<p>Before you configure the application in Okta, make sure all your users have matching email addresses for their Pipedream user profile and their Okta profile. Once SSO is enabled, they will not be able to change their Pipedream email address.</p>
<p>If a user's Pipedream email does not match the email in their IDP profile, they will not be able to log in.</p>
<p>If existing users signed up for Pipedream using an email and password, they will no longer be able to do so. They will only be able to sign in using SSO.</p>
</template>
