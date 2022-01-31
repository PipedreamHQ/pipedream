<template><h1 id="contributing-to-the-pipedream-registry" tabindex="-1"><a class="header-anchor" href="#contributing-to-the-pipedream-registry" aria-hidden="true">#</a> Contributing to the Pipedream Registry</h1>
<p>This document is intended for a technical audience (including those interested
in learning how to author and edit components). It defines guidelines and
patterns developers should follow when building components for the Pipedream
registry.</p>
<p>Developers may create, deploy and share <a href="#components">components</a> that do not
conform to these guidelines, but they will not be eligible to be listed in the
curated registry (e.g., they may be hosted in a Github repo). If you develop a
component that does not adhere to these guidelines, but you believe there is
value to the broader community, please <a href="https://pipedream.com/community/c/dev/11" target="_blank" rel="noopener noreferrer">reach out in our community
forum<ExternalLinkIcon/></a>.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#overview">Overview</RouterLink><ul><li><RouterLink to="#components">Components</RouterLink></li><li><RouterLink to="#pipedream-registry">Pipedream Registry</RouterLink></li></ul></li><li><RouterLink to="#getting-started">Getting Started</RouterLink><ul><li><RouterLink to="#prerequisites">Prerequisites</RouterLink></li><li><RouterLink to="#process">Process</RouterLink></li></ul></li><li><RouterLink to="#reference-components">Reference Components</RouterLink><ul><li><RouterLink to="#reference-sources">Reference Sources</RouterLink></li><li><RouterLink to="#reference-actions">Reference Actions</RouterLink></li></ul></li><li><RouterLink to="#guidelines-patterns">Guidelines &amp; Patterns</RouterLink><ul><li><RouterLink to="#general">General</RouterLink></li><li><RouterLink to="#promoting-reusability">Promoting Reusability</RouterLink></li><li><RouterLink to="#props">Props</RouterLink></li><li><RouterLink to="#source-guidelines">Source Guidelines</RouterLink></li><li><RouterLink to="#action-guidelines">Action Guidelines</RouterLink></li></ul></li></ul></nav>
<h2 id="overview" tabindex="-1"><a class="header-anchor" href="#overview" aria-hidden="true">#</a> Overview</h2>
<p><a href="https://pipedream.com" target="_blank" rel="noopener noreferrer">Pipedream<ExternalLinkIcon/></a> is a low code integration platform that makes
it easy to connect APIs remarkably fast. Users can select from thousands of
customizable, open source components for hundreds of apps and orchestrate their
execution in workflows. Developers can
<a href="https://pipedream.com/contributing" target="_blank" rel="noopener noreferrer">contribute<ExternalLinkIcon/></a> to these open source components
on <a href="https://github.com/pipedreamhq/pipedream" target="_blank" rel="noopener noreferrer">Github<ExternalLinkIcon/></a> by:</p>
<ul>
<li>Creating new components (sources and actions)</li>
<li>Updating existing components (e.g., fixing bugs, enhancing functionality)</li>
<li>Adding or updating metadata (e.g., descriptions, labels)</li>
</ul>
<p>Once a PR is merged to the <code>master</code> branch of the
<a href="https://github.com/PipedreamHQ/pipedream" target="_blank" rel="noopener noreferrer"><code>pipedreamhq/pipedream</code><ExternalLinkIcon/></a> repo, the
components are automatically registered and immediately become available to the
150k+ users of the Pipedream platform.</p>
<h3 id="components" tabindex="-1"><a class="header-anchor" href="#components" aria-hidden="true">#</a> Components</h3>
<p>Components are <RouterLink to="/components/api/#component-structure">Node.js modules</RouterLink> that run on
Pipedream's serverless infrastructure. They may use Pipedream managed auth for
<a href="https://pipedream.com/explore" target="_blank" rel="noopener noreferrer">300+ apps<ExternalLinkIcon/></a> and <RouterLink to="/components/api/#using-npm-packages">use most npm
packages</RouterLink> with no <code>npm install</code> or <code>package.json</code>
required. Pipedream currently supports two types of components — sources and
actions.</p>
<h4 id="sources" tabindex="-1"><a class="header-anchor" href="#sources" aria-hidden="true">#</a> Sources</h4>
<ul>
<li>Emit events that can trigger Pipedream <a href="/workflows/" target="_blank" rel="noopener noreferrer">workflows<ExternalLinkIcon/></a> (events may
also be consumed outside of Pipedream via <a href="/api/overview/" target="_blank" rel="noopener noreferrer">API<ExternalLinkIcon/></a>)</li>
<li>Emitted event data can be inspected and referenced by
<a href="/workflows/steps/" target="_blank" rel="noopener noreferrer">steps<ExternalLinkIcon/></a> in the target workflow</li>
<li>Can use any of Pipedream's built-in <RouterLink to="/components/api/#dedupe-strategies">deduping
strategies</RouterLink></li>
<li>Can be <RouterLink to="/components/api/#interface-props">triggered</RouterLink> on HTTP requests, timers, cron
schedules, or manually</li>
<li>May store and retrieve state using the <RouterLink to="/components/api/#db">built-in key-value store</RouterLink></li>
</ul>
<h4 id="actions" tabindex="-1"><a class="header-anchor" href="#actions" aria-hidden="true">#</a> Actions</h4>
<ul>
<li>May be used as <a href="/workflows/steps/" target="_blank" rel="noopener noreferrer">steps<ExternalLinkIcon/></a> in <a href="/workflows/" target="_blank" rel="noopener noreferrer">workflows<ExternalLinkIcon/></a> to
perform common functions (e.g., get or modify data in an app)</li>
<li><a href="/workflows/steps/#step-exports" target="_blank" rel="noopener noreferrer">Data returned by actions<ExternalLinkIcon/></a> may be inspected
and used in future workflow steps</li>
</ul>
<h3 id="pipedream-registry" tabindex="-1"><a class="header-anchor" href="#pipedream-registry" aria-hidden="true">#</a> Pipedream Registry</h3>
<p>The Pipedream registry consists of sources and actions that have been curated
for the community. Registered components are verified by Pipedream through the
<a href="#process">Github PR process</a> and:</p>
<ul>
<li>Can be trusted by end users</li>
<li>Follow consistent patterns for usability</li>
<li>Are supported by Pipedream if issues arise</li>
</ul>
<p>Registered components also appear in the Pipedream marketplace and are listed in
Pipedream's UI when building workflows.</p>
<h2 id="getting-started" tabindex="-1"><a class="header-anchor" href="#getting-started" aria-hidden="true">#</a> Getting Started</h2>
<p><strong>If you're new to Pipedream, we recommend watching this <a href="https://www.youtube.com/watch?v=hJ-KRbp6EO8" target="_blank" rel="noopener noreferrer">5 minute
demo<ExternalLinkIcon/></a>.</strong></p>
<p>If you're ready to build a component for the Pipedream registry, we recommend
starting with our Quickstart Guides for <RouterLink to="/components/quickstart/nodejs/sources/">source</RouterLink>
and <RouterLink to="/components/quickstart/nodejs/actions/">actions</RouterLink>. Then review the <RouterLink to="/components/api/">Component API
Reference</RouterLink>.</p>
<h3 id="prerequisites" tabindex="-1"><a class="header-anchor" href="#prerequisites" aria-hidden="true">#</a> Prerequisites</h3>
<ul>
<li>A free <a href="https://pipedream.com" target="_blank" rel="noopener noreferrer">Pipedream<ExternalLinkIcon/></a> account</li>
<li>A free <a href="https://github.com" target="_blank" rel="noopener noreferrer">Github<ExternalLinkIcon/></a> account</li>
<li>Basic proficiency with Node.js or Javascript</li>
<li>Pipedream <a href="/cli/reference/" target="_blank" rel="noopener noreferrer">CLI<ExternalLinkIcon/></a></li>
</ul>
<p>Finally, the target app must be integrated with Pipedream. You can explore all
apps supported by Pipedream in the <a href="https://pipedream.com/explore" target="_blank" rel="noopener noreferrer">marketplace<ExternalLinkIcon/></a>.
If your app is not listed, please <a href="https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&amp;labels=app%2C+enhancement&amp;template=app---service-integration.md&amp;title=%5BAPP%5D" target="_blank" rel="noopener noreferrer">create a Github
issue<ExternalLinkIcon/></a>
to request it and <a href="https://pipedream.com/community/c/dev/11" target="_blank" rel="noopener noreferrer">reach out<ExternalLinkIcon/></a> to our
team to let us know that you're blocked on source or action development.</p>
<h4 id="local-checks" tabindex="-1"><a class="header-anchor" href="#local-checks" aria-hidden="true">#</a> Local Checks</h4>
<p>When submitting pull requests, the new code will run through a series of
automated checks like linting the code. If you want to run those checks locally
for quicker feedback you must have <a href="https://www.npmjs.com/" target="_blank" rel="noopener noreferrer">NPM<ExternalLinkIcon/></a> installed and
run the following commands at the root of the project:</p>
<ol>
<li>
<p>To install all the project's dependencies (only needed once):</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">npm</span> ci
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div></li>
<li>
<p>To run the linter checks against your code (assuming that your changes are
located at <code>components/foo</code> for example):</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>npx eslint components/foo
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div></li>
<li>
<p>Optionally, you can automatically fix any linter issues by running the
following command:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>npx eslint --fix components/foo
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>Keep in mind that not all issues can be automatically fixed by the linter
since they could alter the behaviour of the code.</p>
</li>
</ol>
<h3 id="process" tabindex="-1"><a class="header-anchor" href="#process" aria-hidden="true">#</a> Process</h3>
<p>Anyone from the community can build <a href="/event-sources/" target="_blank" rel="noopener noreferrer">sources<ExternalLinkIcon/></a> and <a href="/components/actions/" target="_blank" rel="noopener noreferrer">actions<ExternalLinkIcon/></a> for integrated apps (we refer to these collectively as &quot;<a href="/components/#what-are-components" target="_blank" rel="noopener noreferrer">components<ExternalLinkIcon/></a>&quot;).</p>
<p>All development happens in <a href="https://github.com/PipedreamHQ/pipedream" target="_blank" rel="noopener noreferrer">this GitHub repo<ExternalLinkIcon/></a>. Fork the repo and refer to the <a href="/components/guidelines/#prerequisites" target="_blank" rel="noopener noreferrer">contribution docs<ExternalLinkIcon/></a> to get your development environment setup.</p>
<p>To submit new components:</p>
<ol>
<li>If you don't see the app listed in <a href="https://pipedream.com/apps" target="_blank" rel="noopener noreferrer">our marketplace<ExternalLinkIcon/></a>, you can <a href="https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&amp;labels=app%2C+enhancement&amp;template=app---service-integration.md&amp;title=%5BAPP%5D" target="_blank" rel="noopener noreferrer">request it here<ExternalLinkIcon/></a>.</li>
<li>Once the Pipedream team integrates the app, we'll create a directory for the app in the <code>components</code> directory of the GitHub repo. That directory will contain an &quot;<a href="/components/guidelines/#app-files" target="_blank" rel="noopener noreferrer">app file<ExternalLinkIcon/></a>&quot; that contains the basic code you'll need to get started developing components. App files should contain props, methods, and other code you're using across different components. <a href="https://github.com/PipedreamHQ/pipedream/blob/master/components/airtable/airtable.app.js" target="_blank" rel="noopener noreferrer">See this example for Airtable<ExternalLinkIcon/></a>).</li>
<li>Refer to the quickstarts for <a href="/components/quickstart/nodejs/sources/" target="_blank" rel="noopener noreferrer">sources<ExternalLinkIcon/></a> and <a href="/components/quickstart/nodejs/actions/" target="_blank" rel="noopener noreferrer">actions<ExternalLinkIcon/></a> to learn how to create components.</li>
<li>When you're ready to develop your own components, you can reference the <a href="/components/api/" target="_blank" rel="noopener noreferrer">component API docs<ExternalLinkIcon/></a> and our <a href="/components/guidelines/#guidelines-patterns" target="_blank" rel="noopener noreferrer">contribution guidelines<ExternalLinkIcon/></a>.</li>
<li>Create a PR for the Pipedream team to review and post a message in our <a href="https://pipedream.com/community/c/dev/11" target="_blank" rel="noopener noreferrer">community forum<ExternalLinkIcon/></a> or <a href="https://pipedream-users.slack.com/archives/C01E5KCTR16" target="_blank" rel="noopener noreferrer">public Slack<ExternalLinkIcon/></a>.</li>
<li>Address any feedback provided by Pipedream.</li>
<li>Once the review is complete and approved, Pipedream will merge the PR to the <code>master</code> branch! 🎉</li>
</ol>
<p>Have questions? Reach out in the <a href="https://pipedream-users.slack.com/archives/C01E5KCTR16" target="_blank" rel="noopener noreferrer">#contribute channel<ExternalLinkIcon/></a> in Slack or <a href="https://pipedream.com/community/c/dev/11" target="_blank" rel="noopener noreferrer">on Discourse<ExternalLinkIcon/></a>.</p>
<p>Looking for ideas? Check out <a href="https://github.com/PipedreamHQ/pipedream/issues?q=is%3Aissue+is%3Aopen+%5BSOURCE%5D+in%3Atitle" target="_blank" rel="noopener noreferrer">sources<ExternalLinkIcon/></a>
and <a href="https://github.com/PipedreamHQ/pipedream/issues?q=is%3Aissue+is%3Aopen+%5BACTION%5D+in%3Atitle+" target="_blank" rel="noopener noreferrer">actions<ExternalLinkIcon/></a> requested by the community!</p>
<h2 id="reference-components" tabindex="-1"><a class="header-anchor" href="#reference-components" aria-hidden="true">#</a> Reference Components</h2>
<p>The following components may be used as models for developing sources and
actions for Pipedream's registry.</p>
<h3 id="reference-sources" tabindex="-1"><a class="header-anchor" href="#reference-sources" aria-hidden="true">#</a> Reference Sources</h3>
<table>
<thead>
<tr>
<th>Name</th>
<th>App</th>
<th>Type</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="https://github.com/pipedreamhq/pipedream/blob/master/components/trello/sources/new-card/new-card.js" target="_blank" rel="noopener noreferrer">New Card<ExternalLinkIcon/></a></td>
<td>Trello</td>
<td>Webhook</td>
</tr>
<tr>
<td><a href="https://github.com/PipedreamHQ/pipedream/blob/master/components/twitter/sources/search-mentions/search-mentions.js" target="_blank" rel="noopener noreferrer">Search Mentions<ExternalLinkIcon/></a></td>
<td>Twitter</td>
<td>Polling</td>
</tr>
<tr>
<td><a href="https://github.com/pipedreamhq/pipedream/blob/master/components/google_drive/sources/new-or-modified-files/new-or-modified-files.js" target="_blank" rel="noopener noreferrer">New or Modified Files<ExternalLinkIcon/></a></td>
<td>Google Drive</td>
<td>Webhook + Polling</td>
</tr>
<tr>
<td><a href="https://github.com/pipedreamhq/pipedream/blob/master/components/jotform/sources/new-submission/new-submission.js" target="_blank" rel="noopener noreferrer">New Submission<ExternalLinkIcon/></a></td>
<td>Jotform</td>
<td>Webhook (with no unique hook ID)</td>
</tr>
<tr>
<td><a href="https://github.com/pipedreamhq/pipedream/blob/master/components/github/sources/new-star/new-star.js" target="_blank" rel="noopener noreferrer">New Stars<ExternalLinkIcon/></a></td>
<td>Github</td>
<td>Webhook (with extensive use of common files)</td>
</tr>
</tbody>
</table>
<h3 id="reference-actions" tabindex="-1"><a class="header-anchor" href="#reference-actions" aria-hidden="true">#</a> Reference Actions</h3>
<table>
<thead>
<tr>
<th>Name</th>
<th>App</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="https://github.com/PipedreamHQ/pipedream/blob/master/components/airtable/actions/create-single-record/create-single-record.js" target="_blank" rel="noopener noreferrer">Create Single Record<ExternalLinkIcon/></a></td>
<td>Airtable</td>
</tr>
<tr>
<td><a href="https://github.com/PipedreamHQ/pipedream/blob/master/components/google_sheets/actions/add-multiple-rows/add-multiple-rows.mjs" target="_blank" rel="noopener noreferrer">Add Multiple Rows<ExternalLinkIcon/></a></td>
<td>Google Sheets</td>
</tr>
<tr>
<td><a href="https://github.com/PipedreamHQ/pipedream/blob/master/components/discord_webhook/actions/send-message/send-message.js" target="_blank" rel="noopener noreferrer">Send Message<ExternalLinkIcon/></a></td>
<td>Discord</td>
</tr>
<tr>
<td><a href="https://github.com/PipedreamHQ/pipedream/blob/master/components/google_docs/actions/append-text/append-text.js" target="_blank" rel="noopener noreferrer">Append Text<ExternalLinkIcon/></a></td>
<td>Google Docs</td>
</tr>
<tr>
<td><a href="https://github.com/PipedreamHQ/pipedream/blob/master/components/http/actions/get-request/get-request.js" target="_blank" rel="noopener noreferrer"><code>GET</code> request<ExternalLinkIcon/></a></td>
<td>HTTP</td>
</tr>
</tbody>
</table>
<h2 id="guidelines-patterns" tabindex="-1"><a class="header-anchor" href="#guidelines-patterns" aria-hidden="true">#</a> Guidelines &amp; Patterns</h2>
<h3 id="general" tabindex="-1"><a class="header-anchor" href="#general" aria-hidden="true">#</a> General</h3>
<h4 id="components-should-be-es-modules" tabindex="-1"><a class="header-anchor" href="#components-should-be-es-modules" aria-hidden="true">#</a> Components should be ES modules</h4>
<p>The Node.js community has started publishing <a href="https://flaviocopes.com/es-modules/" target="_blank" rel="noopener noreferrer">ESM-only<ExternalLinkIcon/></a> packages that do not work with <a href="https://nodejs.org/docs/latest/api/modules.html#modules_modules_commonjs_modules" target="_blank" rel="noopener noreferrer">CommonJS modules<ExternalLinkIcon/></a>. This means you must <code>import</code> the package. You can't use <code>require</code>.</p>
<p>You also cannot mix ESM with CJS. This will <strong>not</strong> work:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token comment">// ESM</span>
<span class="token keyword">import</span> axios <span class="token keyword">from</span> <span class="token string">"axios"</span><span class="token punctuation">;</span>

<span class="token comment">// CommonJS - this should be `export default`</span>
module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token operator">...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><p>Therefore, all components should be written as ES modules:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> axios <span class="token keyword">from</span> <span class="token string">"axios"</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token operator">...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p><strong>You'll need to use <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#aside_%E2%80%94_.mjs_versus_.js" target="_blank" rel="noopener noreferrer">the <code>.mjs</code> file extension<ExternalLinkIcon/></a> for any components written as ES modules</strong>.</p>
<p>You'll notice that many of the existing components are written as CommonJS modules. Please fix these and submit a pull request as you refactor related code. For example, if you're developing new Spotify actions, and you notice the existing event sources use CommonJS, change them to ESM:</p>
<ol>
<li>Rename the file extension from <code>.js</code> to <code>.mjs</code> using <code>git mv</code> (e.g. <code>git mv source.js source.mjs</code>).</li>
<li>Change all <code>require</code> statements to <code>import</code>s.</li>
<li>Change instances of <code>module.exports</code> to <code>export default</code>.</li>
</ol>
<h4 id="component-scope" tabindex="-1"><a class="header-anchor" href="#component-scope" aria-hidden="true">#</a> Component Scope</h4>
<p>Create components to address specific use cases whenever possible. For example,
when a user subscribes to a Github webhook to listen for “star” activity, events
can be generated when users star or unstar a repository. The “New Star” source
filters events for only new star activity so the user doesn’t have to.</p>
<p>There may be cases where it's valuable to create a generic component that
provides users with broad latitude (e.g., see the <a href="https://github.com/pipedreamhq/pipedream/blob/master/components/github/sources/custom-webhook-events" target="_blank" rel="noopener noreferrer">custom
webhook<ExternalLinkIcon/></a>
event source for GitHub). However, as a general heuristic, we found that tightly
scoped components are easier for users to understand and use.</p>
<h4 id="required-metadata" tabindex="-1"><a class="header-anchor" href="#required-metadata" aria-hidden="true">#</a> Required Metadata</h4>
<p>Registry <RouterLink to="/components/api/#component-structure">components</RouterLink> require a unique <code>key</code> and
<code>version</code>, and a friendly <code>name</code> and <code>description</code>. Action components require a
<code>type</code> field to be set to <code>action</code> (sources will require a type to be set in the
future).</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">"google_drive-new-shared-drive"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"New Shared Drive"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">"Emits a new event any time a shared drive is created."</span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">"0.0.1"</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><h4 id="component-key-pattern" tabindex="-1"><a class="header-anchor" href="#component-key-pattern" aria-hidden="true">#</a> Component Key Pattern</h4>
<p>When publishing components to the Pipedream registry, the <code>key</code> must be unique
across registry components and should follow the pattern:</p>
<p><code>app_name_slug</code>-<code>slugified-component-name</code></p>
<h4 id="versioning" tabindex="-1"><a class="header-anchor" href="#versioning" aria-hidden="true">#</a> Versioning</h4>
<p>When you first publish a component to the registry, set its version to <code>0.0.1</code>.</p>
<p>Pipedream registry components try to follow <a href="https://semver.org/" target="_blank" rel="noopener noreferrer">semantic versioning<ExternalLinkIcon/></a>. From their site:</p>
<p>Given a version number <code>MAJOR.MINOR.PATCH</code>, increment the:</p>
<ol>
<li><code>MAJOR</code> version when you make incompatible API changes,</li>
<li><code>MINOR</code> version when you add functionality in a backwards compatible manner, and</li>
<li><code>PATCH</code> version when you make backwards compatible bug fixes.</li>
</ol>
<p>When you're developing actions locally, and you've incremented the version in your account multiple times, make sure to set it to the version it should be at in the registry prior to submitting your PR. For example, when you add an action to the registry, the version should be <code>0.0.1</code>. If the action was at version <code>0.1.0</code> and you've fixed a bug, change it to <code>0.1.1</code> when committing your final code.</p>
<h4 id="folder-structure" tabindex="-1"><a class="header-anchor" href="#folder-structure" aria-hidden="true">#</a> Folder Structure</h4>
<p>Registry components are organized by app in the <code>components</code> directory of the
<code>pipedreamhq/pipedream</code> repo.</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>/components
 /[app-name-slug]
  /[app-name-slug].app.js
  /actions
   /[action-name-slug]
    /[action-name-slug].js
  /sources
   /[source-name-slug]
    /[source-name-slug].js
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br></div></div><ul>
<li>The name of each app folder corresponds with the name slug for each app</li>
<li>The app file should be in the root of the app folder (e.g.,
<code>/components/[app_slug]/[app_slug].app.js</code>)</li>
<li>Components for each app are organized into <code>/sources</code> and <code>/actions</code>
subfolders</li>
<li>Each component should be placed in its own subfolder (with the name of the
folder and the name of the <code>js</code> file equivalent to the slugified component
name). For example, the path for the &quot;Search Mentions&quot; source for Twitter is
<code>/components/twitter/sources/search-mentions/search-mentions.js</code>.</li>
</ul>
<p>You can explore examples in the <a href="https://github.com/pipedreamhq/pipedream/tree/master/components" target="_blank" rel="noopener noreferrer">components
directory<ExternalLinkIcon/></a>.</p>
<h4 id="using-apis-vs-client-libraries" tabindex="-1"><a class="header-anchor" href="#using-apis-vs-client-libraries" aria-hidden="true">#</a> Using APIs vs Client Libraries</h4>
<p>If the app has a well-supported <RouterLink to="/components/api/#using-npm-packages">Node.js client
library</RouterLink>, that should be preferred to manually
constructed API requests to reduce code and improve maintenance.</p>
<h4 id="error-handling-and-input-validation" tabindex="-1"><a class="header-anchor" href="#error-handling-and-input-validation" aria-hidden="true">#</a> Error-handling and input validation</h4>
<p>When you use the SDK of a popular API, the SDK might raise clear errors to the user. For example, if the user is asked to pass an email address, and that email address doesn't validate, the library might raise that in the error message.</p>
<p>But other libraries will <em>not</em> raise clear errors. In these cases, you may need to <code>throw</code> your own custom error that wraps the error from the API / lib. <a href="https://github.com/PipedreamHQ/pipedream/blob/9e4e400cda62335dfabfae384d9224e04a585beb/components/airtable/airtable.app.js#L70" target="_blank" rel="noopener noreferrer">See the Airtable components<ExternalLinkIcon/></a> for an example of custom error-handling and input validation.</p>
<p>In general, <strong>imagine you are a user troubleshooting an issue. Is the error easy-to-understand? If not, <code>throw</code> a better error</strong>.</p>
<h4 id="pagination" tabindex="-1"><a class="header-anchor" href="#pagination" aria-hidden="true">#</a> Pagination</h4>
<p>When making API requests, handle pagination to ensure all data / events are processed.</p>
<h4 id="capturing-sensitive-data" tabindex="-1"><a class="header-anchor" href="#capturing-sensitive-data" aria-hidden="true">#</a> Capturing Sensitive Data</h4>
<p>If users are required to enter sensitive data, always use
<RouterLink to="/components/api/#general">secret</RouterLink> props.</p>
<h3 id="promoting-reusability" tabindex="-1"><a class="header-anchor" href="#promoting-reusability" aria-hidden="true">#</a> Promoting Reusability</h3>
<h4 id="app-files" tabindex="-1"><a class="header-anchor" href="#app-files" aria-hidden="true">#</a> App Files</h4>
<p>App files contain components that declare the app and include prop definitions
and methods that may be reused across components. App files should adhere to the
following naming convention:  <code>[app_name_slug].app.js</code>. If an app file does not
exist for your app, please <a href="https://pipedream.com/community/c/dev/11" target="_blank" rel="noopener noreferrer">reach
out<ExternalLinkIcon/></a>.</p>
<h5 id="prop-definitions" tabindex="-1"><a class="header-anchor" href="#prop-definitions" aria-hidden="true">#</a> Prop Definitions</h5>
<p>Whenever possible, reuse existing <a href="/components/api/#prop-definitions-example" target="_blank" rel="noopener noreferrer">prop definitions<ExternalLinkIcon/></a>.</p>
<p>If a prop definition does not exist and you are adding an app-specific prop that
may be reused in future components, add it as a prop definition to the app file.
Prop definitions will also be surfaced for apps the Pipedream marketplace.</p>
<h5 id="methods" tabindex="-1"><a class="header-anchor" href="#methods" aria-hidden="true">#</a> Methods</h5>
<p>Whenever possible, reuse
<a href="/components/api/#methods" target="_blank" rel="noopener noreferrer">methods<ExternalLinkIcon/></a>
defined in the app file. If you need to use an API for which a method is not
defined and it may be used in future components, define a new method in the app
file.</p>
<p>Use the <a href="https://jsdoc.app/about-getting-started.html" target="_blank" rel="noopener noreferrer">JS Docs<ExternalLinkIcon/></a> pattern for
lightweight documentation of each method in the app file. Provide a description
and define @params and @returns block tags (with default values if applicable —
e.g., <code>[foo=bar]</code>). This data will both help with reusability and will be
surfaced in documentation for apps in the Pipedream marketplace. For example:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token doc-comment comment">/**
     * Get the most recently liked Tweets for a user
     *
     * <span class="token keyword">@params</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span> opts - An object representing the configuration options
     * for this method
     * <span class="token keyword">@params</span> <span class="token class-name"><span class="token punctuation">{</span>String<span class="token punctuation">}</span></span> opts.screenName - The user's Twitter screen name (e.g.,
     * `pipedream`)
     * <span class="token keyword">@params</span> <span class="token class-name"><span class="token punctuation">{</span>String<span class="token punctuation">}</span></span> [opts.count=200] - The maximum number of Tweets to
     * return
     * <span class="token keyword">@params</span> <span class="token class-name"><span class="token punctuation">{</span>String<span class="token punctuation">}</span></span> [opts.tweetMode=extended] - Use the default of
     * `extended` to return non-truncated Tweets
     * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>Array<span class="token punctuation">}</span></span> Array of most recent Tweets liked by the specified user
     */</span>
    <span class="token keyword">async</span> <span class="token function">getLikedTweets</span><span class="token punctuation">(</span><span class="token parameter">opts <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span>
        screenName<span class="token punctuation">,</span>
        count <span class="token operator">=</span> <span class="token number">200</span><span class="token punctuation">,</span>
        tweetMode <span class="token operator">=</span> <span class="token string">"extended"</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span> <span class="token operator">=</span> opts<span class="token punctuation">;</span>
      <span class="token keyword">const</span> <span class="token punctuation">{</span> data <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">_makeRequest</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
        <span class="token literal-property property">url</span><span class="token operator">:</span> <span class="token string">"https://api.twitter.com/1.1/favorites/list.json"</span><span class="token punctuation">,</span>
        <span class="token literal-property property">params</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token literal-property property">screen_name</span><span class="token operator">:</span> screenName<span class="token punctuation">,</span>
          count<span class="token punctuation">,</span>
          <span class="token literal-property property">tweet_mode</span><span class="token operator">:</span> tweetMode<span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span> data<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br></div></div><h5 id="testing" tabindex="-1"><a class="header-anchor" href="#testing" aria-hidden="true">#</a> Testing</h5>
<p>Pipedream does not currently support unit tests to validate that changes to app
files are backwards compatible with existing components. Therefore, if you make
changes to an app file that may impact other sources, you must currently test
potentially impacted components to confirm their functionality is not negatively
affected. We expect to support a testing framework in the future.</p>
<h4 id="common-files-optional" tabindex="-1"><a class="header-anchor" href="#common-files-optional" aria-hidden="true">#</a> Common Files (optional)</h4>
<p>An optional pattern to improve reusability is to use a <code>common</code> module to
abstract elements that are used across to multiple components. The trade-off
with this approach is that it increases complexity for end-users who have the
option of customizing the code for components within Pipedream. When using this
approach, the general pattern is:</p>
<ul>
<li>The <code>.app.js</code> module contains the logic related to making the actual API calls
(e.g. calling <code>axios.get</code>, encapsulate the API URL and token, etc).</li>
<li>The <code>common.js</code> module contains logic and structure that is not specific to
any single component. Its structure is equivalent to a component, except that
it doesn't define attributes such as <code>version</code>, <code>dedupe</code>, <code>key</code>, <code>name</code>, etc
(those are specific to each component). It defines the main logic/flow and
relies on calling its methods (which might not be implemented by this
component) to get any necessary data that it needs. In OOP terms, it would be
the equivalent of a base abstract class.</li>
<li>The component module of each action would inherit/extend the <code>common.js</code>
component by setting additional attributes (e.g. <code>name</code>, <code>description</code>, <code>key</code>,
etc) and potentially redefining any inherited methods.</li>
</ul>
<p>See <a href="https://github.com/PipedreamHQ/pipedream/tree/master/components/google_drive" target="_blank" rel="noopener noreferrer">Google
Drive<ExternalLinkIcon/></a> for an
example of this pattern. When using this approach, prop definitions should still
be maintained in the app file.</p>
<h3 id="props" tabindex="-1"><a class="header-anchor" href="#props" aria-hidden="true">#</a> Props</h3>
<p>As a general rule of thumb, we should strive to only incorporate the 3-4 most relevant options from a given API as props. This is not a hard limit, but the goal is to optimize for usability. We should aim to solve specific use cases as simply as possible.</p>
<h4 id="labels" tabindex="-1"><a class="header-anchor" href="#labels" aria-hidden="true">#</a> Labels</h4>
<p>Use <RouterLink to="/components/api/#user-input-props">prop</RouterLink> labels to customize the name of a prop or
propDefinition (independent of the variable name in the code). The label should
mirror the name users of an app are familiar with; i.e., it should mirror the
equivalent label in the app’s UI. This applies to usage in labels, descriptions,
etc. E.g., the Twitter API property for search keywords is “q”, but but label is
set to “Search Term”.</p>
<h4 id="descriptions" tabindex="-1"><a class="header-anchor" href="#descriptions" aria-hidden="true">#</a> Descriptions</h4>
<p>Include a description for <RouterLink to="/components/api/#user-input-props">props</RouterLink> if it helps the
user understand what they need to do. Use Markdown as appropriate
to improve the clarity of the description or instructions. When using Markdown:</p>
<ul>
<li>Enclose sample input values in backticks (<code>`</code>)</li>
<li>Use Markdown links with descriptive text rather than displaying a full URL.</li>
<li>If the description isn't self-explanatory, link to the API docs of the relevant method to further clarify how the prop works. When the value of the prop is complex (for example, an object with many properties), link to the section of the API docs that include details on this format. Users may pass values from previous steps using <a href="/workflows/steps/params/#entering-expressions" target="_blank" rel="noopener noreferrer">expressions<ExternalLinkIcon/></a>, so they'll need to know how to structure that data.</li>
</ul>
<p>Examples:</p>
<ul>
<li>
<p>The async option to select an Airtable Base is self-explanatory so includes no
description:</p>
<p><img src="@source/components/guidelines/images/image-20210326151557417.png" alt="image-20210326151557417"></p>
</li>
<li>
<p>The “Search Term” prop for Twitter includes a description that helps the user
understand what values they can enter, with specific values highlighted using
backticks and links to external content.</p>
<p><img src="@source/components/guidelines/images/image-20210326151706682.png" alt="image-20210326151706682"></p>
</li>
</ul>
<h4 id="optional-vs-required-props" tabindex="-1"><a class="header-anchor" href="#optional-vs-required-props" aria-hidden="true">#</a> Optional vs Required Props</h4>
<p>Use optional <RouterLink to="/components/api/#user-input-props">props</RouterLink> whenever possible to minimize the
input fields required to use a component.</p>
<p>For example, the Twitter search mentions source only requires that a user
connect their account and enter a search term. The remaining fields are optional
for users who want to filter the results, but they do not require any action to
activate the source:</p>
<p><img src="@source/components/guidelines/images/image-20210326151930885.png" alt="image-20210326151930885"></p>
<h4 id="default-values" tabindex="-1"><a class="header-anchor" href="#default-values" aria-hidden="true">#</a> Default Values</h4>
<p>Provide <RouterLink to="/components/api/#user-input-props">default values</RouterLink> whenever possible. NOTE: the
best default for a source doesn’t always map to the default recommended by the
app. For example, Twitter defaults search results to an algorithm that balances
recency and popularity. However, the best default for the use case on Pipedream
is recency.</p>
<h4 id="async-options" tabindex="-1"><a class="header-anchor" href="#async-options" aria-hidden="true">#</a> Async Options</h4>
<p>Avoid asking users to enter ID values. Use <RouterLink to="/components/api/#async-options-example">async
options</RouterLink> (with label/value definitions) so users
can make selections from a drop down menu. For example, Todoist identifies
projects by numeric IDs (e.g., 12345). The async option to select a project
displays the name of the project as the label, so that’s the value the user sees
when interacting with the source (e.g., “My Project”). The code referencing the
selection receives the numeric ID (12345).</p>
<p>Async options should also support <RouterLink to="/components/api/#async-options-example">pagination</RouterLink>
(so users can navigate across multiple pages of options for long lists).</p>
<h4 id="interface-service-props" tabindex="-1"><a class="header-anchor" href="#interface-service-props" aria-hidden="true">#</a> Interface &amp; Service Props</h4>
<p>In the interest of consistency, use the following naming patterns when defining
<RouterLink to="/components/api/#interface-props">interface</RouterLink> and
<RouterLink to="/components/guidelines/COMPONENT-API.html#service-props">service</RouterLink> props in source components:</p>
<table>
<thead>
<tr>
<th>Prop</th>
<th><strong>Recommended Prop Variable Name</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td><code>$.interface.http</code></td>
<td><code>http</code></td>
</tr>
<tr>
<td><code>$.interface.timer</code></td>
<td><code>timer</code></td>
</tr>
<tr>
<td><code>$.service.db</code></td>
<td><code>db</code></td>
</tr>
</tbody>
</table>
<h3 id="source-guidelines" tabindex="-1"><a class="header-anchor" href="#source-guidelines" aria-hidden="true">#</a> Source Guidelines</h3>
<p>These guidelines are specific to <a href="/event-sources" target="_blank" rel="noopener noreferrer">source<ExternalLinkIcon/></a> development.</p>
<h4 id="webhook-vs-polling-sources" tabindex="-1"><a class="header-anchor" href="#webhook-vs-polling-sources" aria-hidden="true">#</a> Webhook vs Polling Sources</h4>
<p>Create subscription webhooks sources (vs polling sources) whenever possible.
Webhook sources receive/emit events in real-time and typically use less compute
time from the user’s account. Note: In some cases, it may be appropriate to
support webhook and polling sources for the same event. For example, Calendly
supports subscription webhooks for their premium users, but non-premium users
are limited to the REST API. A webhook source can be created to emit new
Calendly events for premium users, and a polling source can be created to
support similar functionality for non-premium users.</p>
<h4 id="source-name" tabindex="-1"><a class="header-anchor" href="#source-name" aria-hidden="true">#</a> Source Name</h4>
<p>Source name should be a singular, title-cased name and should start with &quot;New&quot;
(unless emits are not limited to new items). Name should not be slugified and
should not include the app name. NOTE: Pipedream does not currently distinguish
real-time event sources for end-users automatically. The current pattern to
identify a real-time event source is to include “(Instant)” in the source name.
E.g., “New Search Mention” or “New Submission (Instant)”.</p>
<h4 id="source-description" tabindex="-1"><a class="header-anchor" href="#source-description" aria-hidden="true">#</a> Source Description</h4>
<p>Enter a short description that provides more detail than the name alone.
Typically starts with &quot;Emit new&quot;. E.g., “Emit new Tweets that matches your
search criteria”.</p>
<h4 id="emit-a-summary" tabindex="-1"><a class="header-anchor" href="#emit-a-summary" aria-hidden="true">#</a> Emit a Summary</h4>
<p>Always <RouterLink to="/components/api/#emit">emit a summary</RouterLink> for each event. For example, the summary
for each new Tweet emitted by the Search Mentions source is the content of the
Tweet itself.</p>
<p>If no sensible summary can be identified, submit the event payload in string
format as the summary.</p>
<h4 id="deduping" tabindex="-1"><a class="header-anchor" href="#deduping" aria-hidden="true">#</a> Deduping</h4>
<p>Use built-in <RouterLink to="/components/api/#dedupe-strategies">deduping strategies</RouterLink> whenever possible
(<code>unique</code>, <code>greatest</code>, <code>last</code>) vs developing custom deduping code. Develop
custom deduping code if the existing strategies do not support the requirements
for a source.</p>
<h4 id="polling-sources" tabindex="-1"><a class="header-anchor" href="#polling-sources" aria-hidden="true">#</a> Polling Sources</h4>
<h5 id="default-timer-interval" tabindex="-1"><a class="header-anchor" href="#default-timer-interval" aria-hidden="true">#</a> Default Timer Interval</h5>
<p>As a general heuristic, set the default timer interval to 15 minutes. However,
you may set a custom interval (greater or less than 15 minutes) if appropriate
for the specific source. Users may also override the default value at any time.</p>
<h5 id="emit-events-on-first-run" tabindex="-1"><a class="header-anchor" href="#emit-events-on-first-run" aria-hidden="true">#</a> Emit Events on First Run</h5>
<p>Polling sources should emit events on the first run. This helps users to know
their source works when they activate it. This also provides users with events
they can immediately use to support workflow development. Do not emit multiple
pages of results or more than 100 events on the first run (as a general
heuristic, emit the first page of results returned by the API).</p>
<h5 id="rate-limit-optimization" tabindex="-1"><a class="header-anchor" href="#rate-limit-optimization" aria-hidden="true">#</a> Rate Limit Optimization</h5>
<p>When building a polling source, cache the most recently processed ID or
timestamp using <code>$.service.db</code> whenever the API accepts a <code>since_id</code> or &quot;since
timestamp&quot; (or equivalent). Some apps (e.g., Github) do not count requests that
do not return new results against a user’s API quota.</p>
<p>If the service has a well-supported Node.js client library, it'll often build in
retries for issues like rate limits, so using the client lib (when available)
should be preferred. In the absence of that,
<a href="https://www.npmjs.com/package/bottleneck" target="_blank" rel="noopener noreferrer">Bottleneck<ExternalLinkIcon/></a> can be useful for
managing rate limits. 429s should be handled with exponential backoff (instead
of just letting the error bubble up).</p>
<h4 id="webhook-sources" tabindex="-1"><a class="header-anchor" href="#webhook-sources" aria-hidden="true">#</a> Webhook Sources</h4>
<h5 id="hooks" tabindex="-1"><a class="header-anchor" href="#hooks" aria-hidden="true">#</a> Hooks</h5>
<p><RouterLink to="/components/api/#hooks">Hooks</RouterLink> are methods that are automatically invoked by Pipedream
at different stages of the <RouterLink to="/components/api/#component-lifecycle">component lifecycle</RouterLink>.
Webhook subscriptions are typically created when components are instantiated or
activated via the <code>activate()</code> hook, and deleted when components are deactivated
or deleted via the <code>deactivate()</code> hook.</p>
<h5 id="helper-methods" tabindex="-1"><a class="header-anchor" href="#helper-methods" aria-hidden="true">#</a> Helper Methods</h5>
<p>Whenever possible, create methods in the app file to manage <RouterLink to="/components/api/#hooks">creating and
deleting webhook subscriptions</RouterLink>.</p>
<table>
<thead>
<tr>
<th><strong>Description</strong></th>
<th><strong>Method Name</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td>Method to create a webhook subscription</td>
<td><code>createHook()</code></td>
</tr>
<tr>
<td>Method to delete a webhook subscription</td>
<td><code>deleteHook()</code></td>
</tr>
</tbody>
</table>
<h5 id="storing-the-3rd-party-webhook-id" tabindex="-1"><a class="header-anchor" href="#storing-the-3rd-party-webhook-id" aria-hidden="true">#</a> Storing the 3rd Party Webhook ID</h5>
<p>After subscribing to a webhook, save the ID for the hook returned by the 3rd
party service to the <code>$.service.db</code> for a source using the key <code>hookId</code>. This ID
will be referenced when managing or deleting the webhook. Note: some apps may
not return a unique ID for the registered webhook (e.g., Jotform).</p>
<h5 id="signature-validation" tabindex="-1"><a class="header-anchor" href="#signature-validation" aria-hidden="true">#</a> Signature Validation</h5>
<p>Subscription webhook components should always validate the incoming event
signature if the source app supports it.</p>
<h5 id="shared-secrets" tabindex="-1"><a class="header-anchor" href="#shared-secrets" aria-hidden="true">#</a> Shared Secrets</h5>
<p>If the source app supports shared secrets, implement support transparent to the
end user. Generate and use a GUID for the shared secret value, save it to a
<code>$.service.db</code> key, and use the saved value to validate incoming events.</p>
<h3 id="action-guidelines" tabindex="-1"><a class="header-anchor" href="#action-guidelines" aria-hidden="true">#</a> Action Guidelines</h3>
<h4 id="use-pipedream-platform-axios-for-all-http-requests" tabindex="-1"><a class="header-anchor" href="#use-pipedream-platform-axios-for-all-http-requests" aria-hidden="true">#</a> Use <code>@pipedream/platform</code> axios for all HTTP requests</h4>
<p>By default, the standard <code>axios</code> package doesn't return useful debugging data to the user when it <code>throw</code>s errors on HTTP 4XX and 5XX status codes. This makes it hard for the user to troubleshoot the issue.</p>
<p>Instead, <a href="/pipedream-axios" target="_blank" rel="noopener noreferrer">use <code>@pipedream/platform</code> axios<ExternalLinkIcon/></a>.</p>
<h4 id="return-javascript-objects" tabindex="-1"><a class="header-anchor" href="#return-javascript-objects" aria-hidden="true">#</a> Return JavaScript objects</h4>
<p>When you <code>return</code> data from an action, it's exposed as a <a href="/workflows/steps/#step-exports" target="_blank" rel="noopener noreferrer">step export<ExternalLinkIcon/></a> for users to reference in future steps of their workflow. Return JavaScript objects in all cases, unless there's a specific reason not to.</p>
<p>For example, some APIs return XML responses. If you return XML from the step, it's harder for users to parse and reference in future steps. Convert the XML to a JavaScript object, and return that, instead.</p>
<h4 id="use-summary-to-summarize-what-happened" tabindex="-1"><a class="header-anchor" href="#use-summary-to-summarize-what-happened" aria-hidden="true">#</a> Use <code>$.summary</code> to summarize what happened</h4>
<p><a href="/components/api/#returning-data-from-steps" target="_blank" rel="noopener noreferrer">Describe what happened<ExternalLinkIcon/></a> when an action succeeds by following these guidelines:</p>
<ul>
<li>Use plain language and provide helpful and contextually relevant information (especially the count of items)</li>
<li>Whenever possible, use names and titles instead of IDs</li>
<li>Basic structure: <em>Successfully [action performed (like added, removed, updated)] “[relevant destination]”</em></li>
</ul>
</template>
