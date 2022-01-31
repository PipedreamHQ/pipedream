<template><h1 id="user-settings" tabindex="-1"><a class="header-anchor" href="#user-settings" aria-hidden="true">#</a> User Settings</h1>
<p>You can find important account details, text editor configuration, and more in your <a href="https://pipedream.com/settings" target="_blank" rel="noopener noreferrer">Settings<ExternalLinkIcon/></a>.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#account">Account</RouterLink><ul><li><RouterLink to="#username">Username</RouterLink></li><li><RouterLink to="#changing-your-username">Changing your username</RouterLink></li><li><RouterLink to="#changing-your-email">Changing your email</RouterLink></li><li><RouterLink to="#pipedream-api-key">Pipedream API Key</RouterLink></li><li><RouterLink to="#delete-account">Delete Account</RouterLink></li></ul></li><li><RouterLink to="#application">Application</RouterLink></li><li><RouterLink to="#environment-variables">Environment Variables</RouterLink></li><li><RouterLink to="#billing-and-usage">Billing and Usage</RouterLink><ul><li><RouterLink to="#subscription">Subscription</RouterLink></li><li><RouterLink to="#usage">Usage</RouterLink></li><li><RouterLink to="#limits">Limits</RouterLink></li></ul></li></ul></nav>
<h2 id="account" tabindex="-1"><a class="header-anchor" href="#account" aria-hidden="true">#</a> Account</h2>
<p>You'll find your Pipedream username, email, and other basic account details in your <a href="https://pipedream.com/settings/account" target="_blank" rel="noopener noreferrer">Account Settings<ExternalLinkIcon/></a>.</p>
<h3 id="username" tabindex="-1"><a class="header-anchor" href="#username" aria-hidden="true">#</a> Username</h3>
<p>Your Pipedream username functions as your user or org identity. If you've made any resources <a href="/public-workflows/" target="_blank" rel="noopener noreferrer">public<ExternalLinkIcon/></a>, these resources will appear on your public profile at:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>https://pipedream.com/@username
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>You can change your username at any time (see below).</p>
<h3 id="changing-your-username" tabindex="-1"><a class="header-anchor" href="#changing-your-username" aria-hidden="true">#</a> Changing your username</h3>
<p>You can change your Pipedream username by editing the <strong>Username</strong> field in your Account Settings.</p>
<p>Existing workflow URLs that contain your old username will continue to resolve to the correct workflow. However, links to your public profile with your old username (for example, <a href="https://pipedream.com/@old-username" target="_blank" rel="noopener noreferrer">https://pipedream.com/@old-username<ExternalLinkIcon/></a>) will no longer resolve.</p>
<h3 id="changing-your-email" tabindex="-1"><a class="header-anchor" href="#changing-your-email" aria-hidden="true">#</a> Changing your email</h3>
<p>Pipedream sends system emails to the email address tied to your Pipedream login - for example, <a href="/workflows/error-handling/global-error-workflow/" target="_blank" rel="noopener noreferrer">error notifications<ExternalLinkIcon/></a> and emails sent using <a href="/destinations/email/" target="_blank" rel="noopener noreferrer"><code>$send.email()</code><ExternalLinkIcon/></a>.</p>
<p>You can change the email address to which these emails are delivered by modifying the <strong>Email</strong> in your Account Settings. Once changed, an email will be delivered to the new address requesting you verify it.</p>
<p>Pipedream marketing emails may still be sent to the original email address you used when signing up for Pipedream. To change the email address tied to marketing emails, please <a href="https://pipedream.com/support" target="_blank" rel="noopener noreferrer">reach out to our team<ExternalLinkIcon/></a>.</p>
<h3 id="pipedream-api-key" tabindex="-1"><a class="header-anchor" href="#pipedream-api-key" aria-hidden="true">#</a> Pipedream API Key</h3>
<p>Pipedream provides a <a href="/api/overview/" target="_blank" rel="noopener noreferrer">REST API<ExternalLinkIcon/></a> for interacting with Pipedream programmatically. You'll find your API key here, which you use to <a href="/api/auth/" target="_blank" rel="noopener noreferrer">authorize requests to the API<ExternalLinkIcon/></a>.</p>
<p>You can revoke and regenerate your API key from here at any time.</p>
<h3 id="delete-account" tabindex="-1"><a class="header-anchor" href="#delete-account" aria-hidden="true">#</a> Delete Account</h3>
<p>You can delete your Pipedream account at any time by visiting your Account Settings and pressing the <strong>Delete your Account</strong> button. Account deletion is immediately and irreversible.</p>
<h2 id="application" tabindex="-1"><a class="header-anchor" href="#application" aria-hidden="true">#</a> Application</h2>
<p>You can change how the Pipedream app displays data, and basic text editor config, in your <a href="https://pipedream.com/settings/app" target="_blank" rel="noopener noreferrer">Application Settings<ExternalLinkIcon/></a>.</p>
<p>For example, you can:</p>
<ul>
<li>Change the clock format to 12-hour or 24-hour mode</li>
<li>Enable Vim keyboard shortcuts in the Pipedream text editor, or enable word wrap</li>
<li>Set the number of spaces that will be added in the editor when pressing <code>Tab</code></li>
</ul>
<h2 id="environment-variables" tabindex="-1"><a class="header-anchor" href="#environment-variables" aria-hidden="true">#</a> Environment Variables</h2>
<p>Environment variables allow you to securely store secrets or other config values that you can access in Pipedream workflows via <code>process.env</code>. <a href="/environment-variables/" target="_blank" rel="noopener noreferrer">Read more about environment variables here<ExternalLinkIcon/></a>.</p>
<h2 id="billing-and-usage" tabindex="-1"><a class="header-anchor" href="#billing-and-usage" aria-hidden="true">#</a> Billing and Usage</h2>
<p>You'll find information on your usage data (for specific <a href="/limits/" target="_blank" rel="noopener noreferrer">Pipedream limits<ExternalLinkIcon/></a>) in your <a href="https://pipedream.com/settings/billing" target="_blank" rel="noopener noreferrer">Billing Settings<ExternalLinkIcon/></a>. You can also upgrade to <a href="https://pipedream.com/pricing" target="_blank" rel="noopener noreferrer">paid plans<ExternalLinkIcon/></a> from this page.</p>
<h3 id="subscription" tabindex="-1"><a class="header-anchor" href="#subscription" aria-hidden="true">#</a> Subscription</h3>
<p>You can upgrade to <a href="https://pipedream.com/pricing" target="_blank" rel="noopener noreferrer">paid plans<ExternalLinkIcon/></a> from this section.</p>
<p>If you've already upgraded, you'll see an option to <strong>Manage Subscription</strong> here, which directs you to your personal Stripe portal. Here, you can change your payment method, review the details of previous invoices, and more.</p>
<h3 id="usage" tabindex="-1"><a class="header-anchor" href="#usage" aria-hidden="true">#</a> Usage</h3>
<p><a href="/pricing/#invocations" target="_blank" rel="noopener noreferrer">Invocations<ExternalLinkIcon/></a> are Pipedream's billable unit, and <a href="/pricing/#developer-tier" target="_blank" rel="noopener noreferrer">free users<ExternalLinkIcon/></a> are limited on the number of daily invocations they can run. The <strong>Usage</strong> section displays a chart of the daily invocations across a historical range of time to provide insight into your usage patterns.</p>
<p>Hover over a specific column in the chart to see the number of invocations run for that specific day:</p>
<div>
<img width="333" alt="Daily invocations tooltip" src="@source/user-settings/images/daily-invocations-tooltip.png">
</div>
<p><em>Click</em> on a specific column to see invocations for that day, broken out by workflow / source:</p>
<div>
<img alt="Invocations broken out by workflow / source" src="@source/user-settings/images/usage-by-resource.png">
</div>
<p><a href="/pricing/#developer-tier" target="_blank" rel="noopener noreferrer">Developer (free) tier<ExternalLinkIcon/></a> users will see the last 30 days of usage in this chart. Users on <a href="https://pipedream.com/pricing" target="_blank" rel="noopener noreferrer">paid plans<ExternalLinkIcon/></a> will see the cumulative usage tied to their current billing period.</p>
<h3 id="limits" tabindex="-1"><a class="header-anchor" href="#limits" aria-hidden="true">#</a> Limits</h3>
<p>For users on the <a href="/pricing/#developer-tier" target="_blank" rel="noopener noreferrer">Developer (free) tier<ExternalLinkIcon/></a>, this section displays your usage towards your <a href="/limits/#daily-invocations" target="_blank" rel="noopener noreferrer">invocations<ExternalLinkIcon/></a> and <a href="/limits/#compute-time-per-day" target="_blank" rel="noopener noreferrer">compute time<ExternalLinkIcon/></a> quota for the current UTC day.</p>
<Footer />
</template>
