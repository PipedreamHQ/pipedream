<template><h1 id="actions" tabindex="-1"><a class="header-anchor" href="#actions" aria-hidden="true">#</a> Actions</h1>
<p>Actions are reusable code steps that integrate your apps, data and APIs. For example, you can send HTTP requests to an external service using our HTTP actions, or use our Google Sheets actions to add new data. You can use thousands of actions across 400+ apps today.</p>
<p>Typically, integrating with these services requires custom code to manage connection logic, error handling, and more. Actions handle that for you. You only need to specify the parameters required for the action. For example, the HTTP <code>GET</code> Request action requires you enter the URL whose data you want to retrieve.</p>
<p><strong>You can also create your own actions that can be shared across your own workflows, or published to all Pipedream users</strong>.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#using-existing-actions">Using Existing Actions</RouterLink></li><li><RouterLink to="#updating-actions-to-the-latest-version">Updating actions to the latest version</RouterLink></li><li><RouterLink to="#creating-your-own-actions">Creating your own actions</RouterLink></li><li><RouterLink to="#reporting-a-bug-feature-request">Reporting a bug / feature request</RouterLink></li></ul></nav>
<h2 id="using-existing-actions" tabindex="-1"><a class="header-anchor" href="#using-existing-actions" aria-hidden="true">#</a> Using Existing Actions</h2>
<p>Adding existing actions to your workflow is easy:</p>
<ol>
<li>Click the <strong>+</strong> button below any step.</li>
<li>Search for the app you're looking for and select it from the list.</li>
<li>Search for the action and select it to add it to your workflow.</li>
</ol>
<p>For example, here's how to add the HTTP <code>GET</code> Request action:</p>
<div>
<img alt="Adding HTTP GET request action" src="@source/components/actions/images/adding-http-get-request-action.gif">
</div>
<h2 id="updating-actions-to-the-latest-version" tabindex="-1"><a class="header-anchor" href="#updating-actions-to-the-latest-version" aria-hidden="true">#</a> Updating actions to the latest version</h2>
<p>When you use existing actions or create your own, you'll often want to update an action you added to a workflow to the newest version. For example, the community might publish a new feature or bug fix that you want to use.</p>
<p>To update your action to the latest version, hover over the step in your workflow and click the icon with two arrows in a circle:</p>
<div>
<img alt="Update action" src="@source/components/actions/images/update-action.png">
</div>
<h2 id="creating-your-own-actions" tabindex="-1"><a class="header-anchor" href="#creating-your-own-actions" aria-hidden="true">#</a> Creating your own actions</h2>
<p>You can author your own actions on Pipedream, too. Anytime you need to reuse the same code across steps, consider making that an action.</p>
<p>Start with our <a href="/components/quickstart/nodejs/actions/" target="_blank" rel="noopener noreferrer">action development quickstart<ExternalLinkIcon/></a>. You can read more about all the capabilities of actions in <a href="/components/api/" target="_blank" rel="noopener noreferrer">our API docs<ExternalLinkIcon/></a>, and review <a href="/components/api/#example-components" target="_blank" rel="noopener noreferrer">example actions here<ExternalLinkIcon/></a>.</p>
<p>You can also publish actions to <a href="/components/guidelines/#pipedream-registry" target="_blank" rel="noopener noreferrer">the Pipedream registry<ExternalLinkIcon/></a>, which makes them available for anyone on Pipedream to use.</p>
<h2 id="reporting-a-bug-feature-request" tabindex="-1"><a class="header-anchor" href="#reporting-a-bug-feature-request" aria-hidden="true">#</a> Reporting a bug / feature request</h2>
<p>If you'd like to report a bug, request a new action, or submit a feature request for an existing action, <a href="https://github.com/pipedreamhq/pipedream" target="_blank" rel="noopener noreferrer">open an issue in our GitHub repo<ExternalLinkIcon/></a>.</p>
</template>
