<template><h1 id="managing-your-organization" tabindex="-1"><a class="header-anchor" href="#managing-your-organization" aria-hidden="true">#</a> Managing your Organization</h1>
<p>Organizations (&quot;orgs&quot;) provide your team a way to manage resources in a shared workspace. Any resources created by the org are owned by the org and accessible to its members.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#creating-an-org">Creating an org</RouterLink></li><li><RouterLink to="#inviting-users-to-an-org">Inviting users to an org</RouterLink></li><li><RouterLink to="#removing-members-from-an-org">Removing members from an org</RouterLink></li><li><RouterLink to="#switching-context">Switching context</RouterLink></li><li><RouterLink to="#migrating-workflows-from-your-user-to-your-org">Migrating workflows from your user to your org</RouterLink></li><li><RouterLink to="#org-admins">Org admins</RouterLink></li><li><RouterLink to="#adding-new-org-admins">Adding new org admins</RouterLink></li><li><RouterLink to="#finding-your-organization-s-id">Finding your organization&#39;s ID</RouterLink></li><li><RouterLink to="#configuring-single-sign-on-ss0">Configuring Single-sign on (SS0)</RouterLink></li></ul></nav>
<h2 id="creating-an-org" tabindex="-1"><a class="header-anchor" href="#creating-an-org" aria-hidden="true">#</a> Creating an org</h2>
<p>Click the <a href="#switching-context">context switcher</a> in the top-left of the page and select the button labeled <strong>New Organization</strong>:</p>
<div>
<img alt="Create a new org" src="@source/orgs/images/create-an-org.gif" width="400px">
</div>
<p>You'll be asked to enter the org's name, which functions as its <a href="/user-settings/#account" target="_blank" rel="noopener noreferrer">username<ExternalLinkIcon/></a>, and an email address. This email address will receive system notifications (like error and usage emails). We recommend using a group email address so everyone can monitor team resources.</p>
<h2 id="inviting-users-to-an-org" tabindex="-1"><a class="header-anchor" href="#inviting-users-to-an-org" aria-hidden="true">#</a> Inviting users to an org</h2>
<p>Once you've <a href="#creating-an-org">created an org</a>, visit <a href="https://pipedream.com/settings/users" target="_blank" rel="noopener noreferrer">https://pipedream.com/settings/users<ExternalLinkIcon/></a> to invite new members to it.</p>
<h2 id="removing-members-from-an-org" tabindex="-1"><a class="header-anchor" href="#removing-members-from-an-org" aria-hidden="true">#</a> Removing members from an org</h2>
<p>Visit <a href="https://pipedream.com/settings/users" target="_blank" rel="noopener noreferrer">https://pipedream.com/settings/users<ExternalLinkIcon/></a> and click the <strong>...</strong> to the right of any user. Choose the option to <strong>Remove User</strong>.</p>
<h2 id="switching-context" tabindex="-1"><a class="header-anchor" href="#switching-context" aria-hidden="true">#</a> Switching context</h2>
<p>At the top-left of the Pipedream app, you'll see a drop-down menu titled with your username. When you click that, you'll see a list of any orgs you're a member of:</p>
<div>
<img alt="Context switcher" src="@source/orgs/images/context-switcher.png" width="300px">
</div>
<p>This is called the <strong>context switcher</strong>, and sets the context for creating resources in the Pipedream app.</p>
<p>By default, you operate within your <strong>user context</strong>. All resources (workflows, event sources, connected accounts, etc.) you create within this context are owned by your core Pipedream user: the username you created when you signed up for Pipedream.</p>
<p>When you <a href="#creating-an-org">create an org</a>, you'll see that org listed in the context switcher. When you select that org from the context switcher, you'll switch your context to that org. You'll see resources owned by the org here. Any resources you create in this context are owned by the org, not your personal user.</p>
<h2 id="migrating-workflows-from-your-user-to-your-org" tabindex="-1"><a class="header-anchor" href="#migrating-workflows-from-your-user-to-your-org" aria-hidden="true">#</a> Migrating workflows from your user to your org</h2>
<p>If you are running resources in your user account, but want to move those to your organization, <a href="https://pipedream.com/support" target="_blank" rel="noopener noreferrer">reach out to the Pipedream team<ExternalLinkIcon/></a>.</p>
<h2 id="org-admins" tabindex="-1"><a class="header-anchor" href="#org-admins" aria-hidden="true">#</a> Org admins</h2>
<p>Org admins have permission to:</p>
<ul>
<li>Remove users from orgs</li>
<li>Manage the org's billing details</li>
</ul>
<h2 id="adding-new-org-admins" tabindex="-1"><a class="header-anchor" href="#adding-new-org-admins" aria-hidden="true">#</a> Adding new org admins</h2>
<p>By default, the user who created the org is the org admin. To change ownership or assign new admins, <a href="https://pipedream.com/support" target="_blank" rel="noopener noreferrer">reach out to the Pipedream team<ExternalLinkIcon/></a>.</p>
<h2 id="finding-your-organization-s-id" tabindex="-1"><a class="header-anchor" href="#finding-your-organization-s-id" aria-hidden="true">#</a> Finding your organization's ID</h2>
<ol>
<li>Visit <a href="https://pipedream.com" target="_blank" rel="noopener noreferrer">pipedream.com<ExternalLinkIcon/></a> and <a href="#switching-context">switch your context</a> to your organization.</li>
<li>Visit <a href="https://pipedream.com/settings/account" target="_blank" rel="noopener noreferrer">https://pipedream.com/settings/account<ExternalLinkIcon/></a>, and expand the <strong>Programmatic Access</strong> section. You'll see your org ID here.</li>
</ol>
<h2 id="configuring-single-sign-on-ss0" tabindex="-1"><a class="header-anchor" href="#configuring-single-sign-on-ss0" aria-hidden="true">#</a> Configuring Single-sign on (SS0)</h2>
<p>Organizations on the <a href="/pricing/#enterprise-plan" target="_blank" rel="noopener noreferrer">Enterprise Plan<ExternalLinkIcon/></a> can configure Single-sign on in their account, so that your users can login to Pipedream using your identity provider.</p>
<p>Pipedream supports SSO with GSuite, Okta, and other SAML providers. See the guides below to configure SSO for your identity provider:</p>
<ul>
<li><a href="/orgs/sso/okta/" target="_blank" rel="noopener noreferrer">Okta<ExternalLinkIcon/></a></li>
</ul>
</template>
