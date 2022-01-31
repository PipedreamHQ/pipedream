<template><h1 id="overview" tabindex="-1"><a class="header-anchor" href="#overview" aria-hidden="true">#</a> Overview</h1>
<nav class="table-of-contents"><ul><li><RouterLink to="#what-are-components">What are Components?</RouterLink></li><li><RouterLink to="#component-types">Component Types</RouterLink><ul><li><RouterLink to="#sources">Sources</RouterLink></li><li><RouterLink to="#actions">Actions</RouterLink></li></ul></li><li><RouterLink to="#using-components">Using Components</RouterLink></li><li><RouterLink to="#developing-components">Developing Components</RouterLink><ul><li><RouterLink to="#prerequisites">Prerequisites</RouterLink></li><li><RouterLink to="#quickstart-guides">Quickstart Guides</RouterLink></li><li><RouterLink to="#component-api-reference">Component API Reference</RouterLink></li></ul></li><li><RouterLink to="#sharing-components">Sharing Components</RouterLink><ul><li><RouterLink to="#verified-components">Verified Components</RouterLink></li><li><RouterLink to="#community-components">Community Components</RouterLink></li></ul></li></ul></nav>
<h2 id="what-are-components" tabindex="-1"><a class="header-anchor" href="#what-are-components" aria-hidden="true">#</a> What are Components?</h2>
<p>Components are <RouterLink to="/components/api/#component-structure">Node.js modules</RouterLink> that run on Pipedream's serverless infrastructure. They can use Pipedream managed auth for <a href="https://pipedream.com/explore" target="_blank" rel="noopener noreferrer">300+ apps<ExternalLinkIcon/></a> (for both OAuth and key-based APIs) and <RouterLink to="/components/api/#using-npm-packages">use most npm packages</RouterLink> with no <code>npm install</code> or <code>package.json</code> required.</p>
<p>Components are most commonly used as the building blocks of Pipedream workflows, but they can also be used like typical serverless functions. You can explore curated components for popular apps in Pipedream's <a href="https://pipedream.com/explore" target="_blank" rel="noopener noreferrer">Marketplace<ExternalLinkIcon/></a> and <a href="https://github.com/pipedreamhq/pipedream/tree/master/components" target="_blank" rel="noopener noreferrer">GitHub repo<ExternalLinkIcon/></a> or you can author and share your own.</p>
<h2 id="component-types" tabindex="-1"><a class="header-anchor" href="#component-types" aria-hidden="true">#</a> Component Types</h2>
<p>Pipedream supports two types of components — <a href="#sources">sources</a> and <a href="#actions">actions</a>.</p>
<h3 id="sources" tabindex="-1"><a class="header-anchor" href="#sources" aria-hidden="true">#</a> Sources</h3>
<p><a href="/event-sources/" target="_blank" rel="noopener noreferrer">Sources<ExternalLinkIcon/></a> must be instantiated and they run as independent resources on Pipedream. They are commonly used as workflow triggers (but can also be used as standalone serverless functions).</p>
<p><strong>Capabilities</strong></p>
<ul>
<li>Accept user input on deploy via <code>props</code></li>
<li><RouterLink to="/components/api/#interface-props">Trigger</RouterLink> on HTTP requests, timers, cron schedules, or manually</li>
<li>Emit events that can be inspected, trigger Pipedream <a href="/workflows/" target="_blank" rel="noopener noreferrer">workflows<ExternalLinkIcon/></a> and that can be consumed in your own app via <a href="/api/overview/" target="_blank" rel="noopener noreferrer">API<ExternalLinkIcon/></a></li>
<li>Store and retrieve state using the <RouterLink to="/components/api/#db">built-in key-value store</RouterLink></li>
<li>Use any of Pipedream's built-in <RouterLink to="/components/api/#dedupe-strategies">deduping strategies</RouterLink></li>
<li>Deploy via Pipedream's UI, CLI or API</li>
</ul>
<p><strong>Example</strong></p>
<p>The <a href="https://github.com/PipedreamHQ/pipedream/blob/master/components/twitter/sources/search-mentions/search-mentions.js" target="_blank" rel="noopener noreferrer">Search Mentions<ExternalLinkIcon/></a> source for Twitter is a prebuilt component in Pipedream's registry that can be deployed in seconds and emits new Tweets that match a search query. After a user configures and deploys it, the deployed component polls the Twitter API for new results. When new results are found, each new result is emitted as an event that may be inspected and used to trigger a workflow.</p>
<h3 id="actions" tabindex="-1"><a class="header-anchor" href="#actions" aria-hidden="true">#</a> Actions</h3>
<p>Actions are components that may be used as steps in a workflow. Unlike sources, actions cannot run independently (outside of a workflow).</p>
<p><strong>Capabilities</strong></p>
<ul>
<li>Accept user input via <code>props</code></li>
<li>May <code>return</code> JSON serializable data</li>
</ul>
<p><strong>Example</strong></p>
<p>The Add Single Row action for Google Sheets is a prebuilt component in Pipedream's registry that can be added to a workflow and configured in seconds. Users can configure it in seconds and send workflow data to Google Sheets without having to learn the Google Sheets API.</p>
<h2 id="using-components" tabindex="-1"><a class="header-anchor" href="#using-components" aria-hidden="true">#</a> Using Components</h2>
<p>Components may be instantiated or added to workflows via Pipedream's UI.</p>
<ul>
<li>Sources may be instantiated and consumed via <a href="https://pipedream.com/sources/new" target="_blank" rel="noopener noreferrer">UI<ExternalLinkIcon/></a>, CLI or API</li>
<li>Actions may be added to <a href="https://pipedream.com/new" target="_blank" rel="noopener noreferrer">workflows<ExternalLinkIcon/></a></li>
</ul>
<h2 id="developing-components" tabindex="-1"><a class="header-anchor" href="#developing-components" aria-hidden="true">#</a> Developing Components</h2>
<p>Develop components locally using your preferred code editor (and maintain your code in your own GitHub repo) and deploy or publish using Pipedream's <a href="/cli/reference/#pd-deploy" target="_blank" rel="noopener noreferrer">CLI<ExternalLinkIcon/></a>.</p>
<ul>
<li>Sources may be deployed directly from local code or published to your account and instantiated via Pipedream's UI</li>
<li>Actions may only be published — published actions may be added to workflows via Pipedream's UI</li>
</ul>
<p>Published components are only available to your own account by default. If published to a team account, the component (source or action) may be discovered and selected by any member of the team.</p>
<h3 id="prerequisites" tabindex="-1"><a class="header-anchor" href="#prerequisites" aria-hidden="true">#</a> Prerequisites</h3>
<ul>
<li>A free <a href="https://pipedream.com" target="_blank" rel="noopener noreferrer">Pipedream<ExternalLinkIcon/></a> account</li>
<li>A free <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub<ExternalLinkIcon/></a> account</li>
<li>Basic proficiency with Node.js or Javascript</li>
<li>Pipedream <a href="/cli/reference/" target="_blank" rel="noopener noreferrer">CLI<ExternalLinkIcon/></a></li>
</ul>
<p>Finally, the target app must be integrated with Pipedream. You can explore all apps supported by Pipedream in the <a href="https://pipedream.com/explore" target="_blank" rel="noopener noreferrer">marketplace<ExternalLinkIcon/></a>. If your app is not listed, please <a href="https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&amp;labels=app%2C+enhancement&amp;template=app---service-integration.md&amp;title=%5BAPP%5D" target="_blank" rel="noopener noreferrer">create a GitHub issue<ExternalLinkIcon/></a> to request it and <a href="https://pipedream.com/community/c/dev/11" target="_blank" rel="noopener noreferrer">reach out<ExternalLinkIcon/></a> to our team to let us know that you're blocked on source or action development.</p>
<h3 id="quickstart-guides" tabindex="-1"><a class="header-anchor" href="#quickstart-guides" aria-hidden="true">#</a> Quickstart Guides</h3>
<ul>
<li><RouterLink to="/components/quickstart/nodejs/sources/">Sources</RouterLink></li>
<li><RouterLink to="/components/quickstart/nodejs/actions/">Actions</RouterLink></li>
</ul>
<h3 id="component-api-reference" tabindex="-1"><a class="header-anchor" href="#component-api-reference" aria-hidden="true">#</a> Component API Reference</h3>
<p>After getting familiar with source/action development using the quickstart guides, check out <a href="/components/api" target="_blank" rel="noopener noreferrer">the Component API Reference<ExternalLinkIcon/></a> and <a href="https://github.com/pipedreamhq/pipedream/tree/master/components" target="_blank" rel="noopener noreferrer">examples on GitHub<ExternalLinkIcon/></a> to learn more.</p>
<h2 id="sharing-components" tabindex="-1"><a class="header-anchor" href="#sharing-components" aria-hidden="true">#</a> Sharing Components</h2>
<p>Contribute to the Pipedream community by publishing and sharing new components, and contributing to the maintenance of existing components.</p>
<h3 id="verified-components" tabindex="-1"><a class="header-anchor" href="#verified-components" aria-hidden="true">#</a> Verified Components</h3>
<p>Pipedream maintains an open source registry of components (sources and actions) that have been curated for the community. Registered components are verified by Pipedream through the <a href="/components/guidelines/#process" target="_blank" rel="noopener noreferrer">GitHub PR process<ExternalLinkIcon/></a> and:</p>
<ul>
<li>Can be trusted by end users</li>
<li>Follow consistent patterns for usability</li>
<li>Are supported by Pipedream if issues arise</li>
</ul>
<p>Registered components also appear in the Pipedream marketplace and are listed in Pipedream's UI when building workflows.</p>
<h3 id="community-components" tabindex="-1"><a class="header-anchor" href="#community-components" aria-hidden="true">#</a> Community Components</h3>
<p>Developers may create, deploy and share components that do not conform to these guidelines, but they will not be eligible to be listed in the curated registry (e.g., they may be hosted in a Github repo). If you develop a component that does not adhere to these guidelines, but you believe there is value to the broader community, please <a href="https://pipedream.com/community/c/dev/11" target="_blank" rel="noopener noreferrer">reach out in our community forum<ExternalLinkIcon/></a>.</p>
</template>
