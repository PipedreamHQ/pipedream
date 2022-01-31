<template><h1 id="component-api-reference" tabindex="-1"><a class="header-anchor" href="#component-api-reference" aria-hidden="true">#</a> Component API Reference</h1>
<p>This document was created to help developers author and use <a href="/components/" target="_blank" rel="noopener noreferrer">Pipedream components<ExternalLinkIcon/></a>. Not only can you develop <a href="/components/quickstart/nodejs/sources/" target="_blank" rel="noopener noreferrer">sources<ExternalLinkIcon/></a> (workflow triggers) and <a href="/components/quickstart/nodejs/actions/" target="_blank" rel="noopener noreferrer">actions<ExternalLinkIcon/></a> using the component API, but you can also develop <a href="/code/nodejs" target="_blank" rel="noopener noreferrer">Node.js steps<ExternalLinkIcon/></a> right in your workflows - without leaving your browser! You can publish components to your account for private use, or <a href="/components/guidelines/" target="_blank" rel="noopener noreferrer">contribute them to the Pipedream registry<ExternalLinkIcon/></a> for anyone to run.</p>
<p>While sources and actions share the same core component API, they differ in both how they're used and written, so certain parts of the component API apply only to one or the other. <a href="#differences-between-sources-and-actions">This section of the docs</a> explains the core differences. When this document uses the term &quot;component&quot;, the corresponding feature applies to both sources and actions. If a specific feature applies to only sources <em>or</em> actions, the correct term will be used.</p>
<p>If you have any questions about component development, please reach out <a href="https://pipedream.com/community/c/dev/11" target="_blank" rel="noopener noreferrer">in our community<ExternalLinkIcon/></a>.</p>
<nav class="table-of-contents"><ul><li><RouterLink to="#overview">Overview</RouterLink><ul><li><RouterLink to="#what-is-a-component">What is a component?</RouterLink></li><li><RouterLink to="#quickstarts">Quickstarts</RouterLink></li><li><RouterLink to="#differences-between-sources-and-actions">Differences between sources and actions</RouterLink></li><li><RouterLink to="#getting-started-with-the-cli">Getting Started with the CLI</RouterLink></li><li><RouterLink to="#example-components">Example Components</RouterLink></li></ul></li><li><RouterLink to="#component-api">Component API</RouterLink><ul><li><RouterLink to="#component-structure">Component Structure</RouterLink></li><li><RouterLink to="#props">Props</RouterLink></li><li><RouterLink to="#methods">Methods</RouterLink></li><li><RouterLink to="#hooks">Hooks</RouterLink></li><li><RouterLink to="#dedupe-strategies">Dedupe Strategies</RouterLink></li><li><RouterLink to="#run">Run</RouterLink></li><li><RouterLink to="#environment-variables">Environment variables</RouterLink></li><li><RouterLink to="#using-npm-packages">Using npm packages</RouterLink></li></ul></li><li><RouterLink to="#managing-components">Managing Components</RouterLink><ul><li><RouterLink to="#managing-sources">Managing Sources</RouterLink></li><li><RouterLink to="#managing-actions">Managing Actions</RouterLink></li></ul></li><li><RouterLink to="#source-lifecycle">Source Lifecycle</RouterLink><ul><li><RouterLink to="#lifecycle-hooks">Lifecycle hooks</RouterLink></li><li><RouterLink to="#states">States</RouterLink></li><li><RouterLink to="#operations">Operations</RouterLink></li></ul></li><li><RouterLink to="#source-event-lifecycle">Source Event Lifecycle</RouterLink><ul><li><RouterLink to="#diagram">Diagram</RouterLink></li><li><RouterLink to="#triggering-sources">Triggering Sources</RouterLink></li><li><RouterLink to="#emitting-events-from-sources">Emitting Events from Sources</RouterLink></li><li><RouterLink to="#consuming-events-from-sources">Consuming Events from Sources</RouterLink></li></ul></li></ul></nav>
<h2 id="overview" tabindex="-1"><a class="header-anchor" href="#overview" aria-hidden="true">#</a> Overview</h2>
<h3 id="what-is-a-component" tabindex="-1"><a class="header-anchor" href="#what-is-a-component" aria-hidden="true">#</a> What is a component?</h3>
<p>Components are Node.js <a href="https://flaviocopes.com/commonjs/" target="_blank" rel="noopener noreferrer">CommonJS modules<ExternalLinkIcon/></a> that run on Pipedream's serverless infrastructure.</p>
<ul>
<li>Trigger Node.js code on HTTP requests, timers, cron schedules, or manually</li>
<li>Emit data on each event to inspect it. Trigger Pipedream hosted workflows or access it outside of Pipedream via API</li>
<li>Accept user input on deploy via <a href="/cli/reference/#pd-deploy" target="_blank" rel="noopener noreferrer">CLI<ExternalLinkIcon/></a>, <a href="/api/rest/#overview" target="_blank" rel="noopener noreferrer">API<ExternalLinkIcon/></a>, or <a href="https://pipedream.com/sources" target="_blank" rel="noopener noreferrer">UI<ExternalLinkIcon/></a></li>
<li>Connect to <a href="https://pipedream.com/apps" target="_blank" rel="noopener noreferrer">400+ apps<ExternalLinkIcon/></a> using Pipedream managed auth</li>
<li>Use most npm packages with no <code>npm install</code> or <code>package.json</code> required</li>
<li>Store and retrieve state using the <a href="#db">built-in key-value store</a></li>
</ul>
<h3 id="quickstarts" tabindex="-1"><a class="header-anchor" href="#quickstarts" aria-hidden="true">#</a> Quickstarts</h3>
<p>To help you get started, we created a step-by-step walkthrough for developing both <a href="/components/quickstart/nodejs/sources/" target="_blank" rel="noopener noreferrer">sources<ExternalLinkIcon/></a> and <a href="/components/quickstart/nodejs/actions/" target="_blank" rel="noopener noreferrer">actions<ExternalLinkIcon/></a>. We recommend starting with those docs and using the API reference below as you develop.</p>
<h3 id="differences-between-sources-and-actions" tabindex="-1"><a class="header-anchor" href="#differences-between-sources-and-actions" aria-hidden="true">#</a> Differences between sources and actions</h3>
<p>Sources and actions share the same component API. However, certain features of the API only apply to one or the other:</p>
<ul>
<li>
<p>Actions are defined with <code>type: action</code> (<a href="#component-structure">see the docs on the <code>type</code> property</a>). Sources require no <code>type</code> property be set. Components without a <code>type</code> are considered sources.</p>
</li>
<li>
<p>Sources emit events <a href="#emit">using <code>this.$emit</code></a>, which trigger linked workflows. Any features associated with emitting events (e.g., <a href="#dedupe-strategies">dedupe strategies</a>) can only be used with sources. Actions <a href="#returning-data-from-steps">return data using <code>return</code> or <code>$.export</code></a>, which is made available to future steps of the associated workflow.</p>
</li>
<li>
<p>Sources have access to <a href="#lifecycle-hooks">lifecycle hooks</a>, which are often required to configure the source to listen for new events. Actions do not have access to these lifecycle hooks.</p>
</li>
<li>
<p>Actions have access to <a href="#actions">a special <code>$</code> variable</a>, passed as a parameter to the <code>run</code> method. This variable exposes functions that allow you to send data to destinations, export data from the action, return HTTP responses, and more.</p>
</li>
<li>
<p>Sources can be developed iteratively using <code>pd dev</code>. Actions currently cannot (please follow <a href="https://github.com/PipedreamHQ/pipedream/issues/1437" target="_blank" rel="noopener noreferrer">this issue<ExternalLinkIcon/></a> to be notified of updates).</p>
</li>
<li>
<p>You use <code>pd deploy</code> to deploy sources to your account. You use <code>pd publish</code> to publish actions, making them available for use in workflows.</p>
</li>
<li>
<p>You can attach <a href="#interface-props">interfaces</a> (like HTTP endpoints, or timers) to sources. This defines how the source is invoked. Actions do not have interfaces, since they're run step-by-step as a part of the associated workflow.</p>
</li>
</ul>
<h3 id="getting-started-with-the-cli" tabindex="-1"><a class="header-anchor" href="#getting-started-with-the-cli" aria-hidden="true">#</a> Getting Started with the CLI</h3>
<p>Several examples below use the Pipedream CLI. To install it, <a href="/cli/install/" target="_blank" rel="noopener noreferrer">follow the instructions for your OS / architecture<ExternalLinkIcon/></a>.</p>
<p>See the <a href="/cli/reference/" target="_blank" rel="noopener noreferrer">CLI reference<ExternalLinkIcon/></a> for detailed usage and examples beyond those covered below.</p>
<h3 id="example-components" tabindex="-1"><a class="header-anchor" href="#example-components" aria-hidden="true">#</a> Example Components</h3>
<p>You can find hundreds of example components in the <code>components/</code> directory of the <a href="https://github.com/PipedreamHQ/pipedream" target="_blank" rel="noopener noreferrer"><code>PipedreamHQ/pipedream</code> repo<ExternalLinkIcon/></a>.</p>
<h2 id="component-api" tabindex="-1"><a class="header-anchor" href="#component-api" aria-hidden="true">#</a> Component API</h2>
<h3 id="component-structure" tabindex="-1"><a class="header-anchor" href="#component-structure" aria-hidden="true">#</a> Component Structure</h3>
<p>Pipedream components export an object with the following properties:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span>
  <span class="token literal-property property">key</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span>
  <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">hooks</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token keyword">async</span> <span class="token function">activate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token keyword">async</span> <span class="token function">deactivate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token keyword">async</span> <span class="token function">deploy</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">dedupe</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter">event</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">$emit</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
<th>Required?</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>name</code></td>
<td><code>string</code></td>
<td>required</td>
<td>The name of the component, a string which identifies components deployed to users' accounts. This name will show up in the Pipedream UI, in CLI output (for example, from <code>pd list</code> commands), etc. It will also be converted to a unique slug on deploy to reference a specific component instance (it will be auto-incremented if not unique within a user account).</td>
</tr>
<tr>
<td><code>key</code></td>
<td><code>string</code></td>
<td>recommended</td>
<td>The <code>key</code> uniquely identifies a component within a namespace. The default namespace for components is your account.<br /><br />When publishing components to the Pipedream registry, the <code>key</code> must be unique across registry components and should follow the pattern:<br /><br /><code>app_name_slug</code>-<code>slugified-component-name</code></td>
</tr>
<tr>
<td><code>type</code></td>
<td><code>string</code></td>
<td>required</td>
<td>When publishing an action, <code>type: &quot;action&quot;</code> is required. When publishing a source, use <code>type: &quot;source&quot;</code>.</td>
</tr>
<tr>
<td><code>version</code></td>
<td><code>string</code></td>
<td>required</td>
<td>The component version. There are no constraints on the version, but <a href="https://semver.org/" target="_blank" rel="noopener noreferrer">semantic versioning<ExternalLinkIcon/></a> is required for any components published to the <a href="/components/guidelines/" target="_blank" rel="noopener noreferrer">Pipedream registry<ExternalLinkIcon/></a>.</td>
</tr>
<tr>
<td><code>description</code></td>
<td><code>string</code></td>
<td>recommended</td>
<td>The description will appear in the Pipedream UI to aid in discovery and to contextualize instantiated components</td>
</tr>
<tr>
<td><code>props</code></td>
<td><code>object</code></td>
<td>optional</td>
<td><a href="#props">Props</a> are custom attributes you can register on a component. When a value is passed to a prop attribute, it becomes a property on that component instance. You can reference these properties in component code using <code>this</code> (e.g., <code>this.propName</code>).</td>
</tr>
<tr>
<td><code>methods</code></td>
<td><code>object</code></td>
<td>optional</td>
<td>Define component methods for the component instance. They can be referenced via <code>this</code> (e.g., <code>this.methodName()</code>).</td>
</tr>
<tr>
<td><code>hooks</code></td>
<td><code>object</code></td>
<td>optional (sources only)</td>
<td><a href="#hooks">Hooks</a> are functions that are executed when specific component lifecycle events occur.</td>
</tr>
<tr>
<td><code>dedupe</code></td>
<td><code>string</code></td>
<td>optional (sources only)</td>
<td>You may specify a <a href="#dedupe-strategies">dedupe strategy</a> to be applied to emitted events</td>
</tr>
<tr>
<td><code>run</code></td>
<td><code>method</code></td>
<td>required</td>
<td>Each time a component is invoked (for example, via HTTP request), <a href="#run">its <code>run</code> method</a> is called. The event that triggered the component is passed to <code>run</code>, so that you can access it within the method. Events are emitted using <code>this.$emit()</code>.</td>
</tr>
</tbody>
</table>
<h3 id="props" tabindex="-1"><a class="header-anchor" href="#props" aria-hidden="true">#</a> Props</h3>
<p>Props are custom attributes you can register on a component. When a value is passed to a prop attribute, it becomes a property on that component instance. You can reference these properties in component code using <code>this</code> (e.g., <code>this.propName</code>).</p>
<table>
<thead>
<tr>
<th>Prop Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="#user-input-props">User Input</a></td>
<td>Enable components to accept input on deploy</td>
</tr>
<tr>
<td><a href="#interface-props">Interface</a></td>
<td>Attaches a Pipedream interface to your component (e.g., an HTTP interface or timer)</td>
</tr>
<tr>
<td><a href="#service-props">Service</a></td>
<td>Attaches a Pipedream service to your component (e.g., a key-value database to maintain state)</td>
</tr>
<tr>
<td><a href="#user-input-props">App</a></td>
<td>Enables managed auth for a component</td>
</tr>
</tbody>
</table>
<h4 id="user-input-props" tabindex="-1"><a class="header-anchor" href="#user-input-props" aria-hidden="true">#</a> User Input Props</h4>
<p>User input props allow components to accept input on deploy. When deploying a component, users will be prompted to enter values for these props, setting the behavior of the component accordingly.</p>
<h5 id="general" tabindex="-1"><a class="header-anchor" href="#general" aria-hidden="true">#</a> General</h5>
<p><strong>Definition</strong></p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">myPropName</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span>
    <span class="token literal-property property">label</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span>
    <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span>
    <span class="token literal-property property">options</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token comment">// OR async options() {} to return dynamic options</span>
    <span class="token literal-property property">optional</span><span class="token operator">:</span> <span class="token boolean">true</span> <span class="token operator">||</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token literal-property property">propDefinition</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token keyword">default</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span>
    <span class="token literal-property property">secret</span><span class="token operator">:</span> <span class="token boolean">true</span> <span class="token operator">||</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token literal-property property">min</span><span class="token operator">:</span> <span class="token operator">&lt;</span>integer<span class="token operator">></span><span class="token punctuation">,</span>
    <span class="token literal-property property">max</span><span class="token operator">:</span> <span class="token operator">&lt;</span>integer<span class="token operator">></span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
<th>Required?</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>type</code></td>
<td><code>string</code></td>
<td>required</td>
<td>Value must be set to a valid <code>PropType</code> (see below). Suffix with <code>[]</code> (e.g. <code>string[]</code>) to denote array of that type (if supported).</td>
</tr>
<tr>
<td><code>label</code></td>
<td><code>string</code></td>
<td>optional</td>
<td>A friendly label to show to user for this prop. If a label is not provided, the <code>propName</code> is displayed to the user.</td>
</tr>
<tr>
<td><code>description</code></td>
<td><code>string</code></td>
<td>optional</td>
<td>Displayed near the prop input. Typically used to contextualize the prop or provide instructions to help users input the correct value. Markdown is supported.</td>
</tr>
<tr>
<td><code>options</code></td>
<td><code>string[]</code> or <code>object[]</code> or <code>method</code></td>
<td>optional</td>
<td>Provide an array to display options to a user in a drop down menu.<br> <br><strong><code>[]</code> Basic usage</strong><br>Array of strings. E.g.,<br><code>['option 1', 'option 2']</code><br> <br><strong><code>object[]</code> Define Label and Value</strong><br><code>[{ label: 'Label 1', value: 'label1'}, { label: 'Label 2', value: 'label2'}]</code><br> <br><strong><code>method</code> Dynamic Options</strong><br>You can generate options dynamically (e.g., based on real-time API requests with pagination). See configuration details below.</td>
</tr>
<tr>
<td><code>optional</code></td>
<td><code>boolean</code></td>
<td>optional</td>
<td>Set to <code>true</code> to make this prop optional. Defaults to <code>false</code>.</td>
</tr>
<tr>
<td><code>propDefinition</code></td>
<td><code>[]</code></td>
<td>optional</td>
<td>Re-use a prop defined in an app file. When you include a prop definition, the prop will inherit values for all the properties listed here. However, you can override those values by redefining them for a given prop instance. See <strong>propDefinitions</strong> below for usage.</td>
</tr>
<tr>
<td><code>default</code></td>
<td><code>string</code></td>
<td>optional</td>
<td>Define a default value if the field is not completed. Can only be defined for optional fields (required fields require explicit user input).</td>
</tr>
<tr>
<td><code>secret</code></td>
<td><code>boolean</code></td>
<td>optional</td>
<td>If set to <code>true</code>, this field will hide your input in the browser like a password field, and its value will be encrypted in Pipedream's database. The value will be decrypted when the component is run in <a href="/privacy-and-security/#execution-environment" target="_blank" rel="noopener noreferrer">the execution environment<ExternalLinkIcon/></a>. Defaults to <code>false</code>.     Only allowed for <code>string</code> props.</td>
</tr>
<tr>
<td><code>min</code></td>
<td><code>integer</code></td>
<td>optional</td>
<td>Minimum allowed integer value. Only allowed for <code>integer</code> props..</td>
</tr>
<tr>
<td><code>max</code></td>
<td><code>integer</code></td>
<td>optional</td>
<td>Maximum allowed integer value . Only allowed for <code>integer</code> props.</td>
</tr>
</tbody>
</table>
<p><strong><code>PropType</code>s</strong></p>
<table>
<thead>
<tr>
<th><code>PropType</code></th>
<th>Array Supported</th>
<th>Supported in Sources?</th>
<th>Supported in Actions?</th>
<th style="text-align:left">Custom properties</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>app</code></td>
<td></td>
<td>✓</td>
<td>✓</td>
<td style="text-align:left">See <a href="#app-props">App Props</a> below</td>
</tr>
<tr>
<td><code>boolean</code></td>
<td>✓</td>
<td>✓</td>
<td>✓</td>
<td style="text-align:left"></td>
</tr>
<tr>
<td><code>integer</code></td>
<td>✓</td>
<td>✓</td>
<td>✓</td>
<td style="text-align:left">- <code>min</code> (<code>integer</code>): Minimum allowed integer value.<br/>- <code>max</code> (<code>integer</code>): Maximum allowed integer value.</td>
</tr>
<tr>
<td><code>string</code></td>
<td>✓</td>
<td>✓</td>
<td>✓</td>
<td style="text-align:left">- <code>secret</code> (<code>boolean</code>): Whether to treat the value as a secret.</td>
</tr>
<tr>
<td><code>object</code></td>
<td></td>
<td>✓</td>
<td>✓</td>
<td style="text-align:left"></td>
</tr>
<tr>
<td><code>any</code></td>
<td></td>
<td></td>
<td>✓</td>
<td style="text-align:left"></td>
</tr>
<tr>
<td><code>$.interface.http</code></td>
<td></td>
<td>✓</td>
<td></td>
<td style="text-align:left"></td>
</tr>
<tr>
<td><code>$.interface.timer</code></td>
<td></td>
<td>✓</td>
<td></td>
<td style="text-align:left"></td>
</tr>
<tr>
<td><code>$.service.db</code></td>
<td></td>
<td>✓</td>
<td>✓</td>
<td style="text-align:left"></td>
</tr>
</tbody>
</table>
<p><strong>Usage</strong></p>
<table>
<thead>
<tr>
<th>Code</th>
<th>Description</th>
<th>Read Scope</th>
<th>Write Scope</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>this.myPropName</code></td>
<td>Returns the configured value of the prop</td>
<td><code>run()</code> <code>hooks</code> <code>methods</code></td>
<td>n/a (input props may only be modified on component deploy or update via UI, CLI or API)</td>
</tr>
</tbody>
</table>
<p><strong>Example</strong></p>
<p>Following is an example source that demonstrates how to capture user input via a prop and emit it on each event:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"User Input Prop Example"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">"0.1"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">msg</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"string"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">label</span><span class="token operator">:</span> <span class="token string">"Message"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">"Enter a message to `console.log()`"</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">$emit</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>msg<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br></div></div><p>To see more examples, explore the <a href="#example-components">curated components in Pipedream's GitHub repo</a>.</p>
<h5 id="advanced-configuration" tabindex="-1"><a class="header-anchor" href="#advanced-configuration" aria-hidden="true">#</a> Advanced Configuration</h5>
<h5 id="async-options-example" tabindex="-1"><a class="header-anchor" href="#async-options-example" aria-hidden="true">#</a> Async Options (<a href="https://github.com/PipedreamHQ/pipedream/blob/master/components/github/github.app.js" target="_blank" rel="noopener noreferrer">example<ExternalLinkIcon/></a>)</h5>
<p>Async options allow users to select prop values that can be programmatically-generated (e.g., based on a real-time API response).</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">async</span> <span class="token function">options</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span>
  page<span class="token punctuation">,</span>
  prevContext<span class="token punctuation">,</span>
<span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
<th>Required?</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>options()</code></td>
<td><code>method</code></td>
<td>optional</td>
<td>Typically returns an array of values matching the prop type (e.g., <code>string</code>) or an array of object that define the <code>label</code> and <code>value</code> for each option. The <code>page</code> and <code>prevContext</code> input parameter names are reserved for pagination (see below).<br> <br>When using <code>prevContext</code> for pagination, it must return an object with an <code>options</code> array and a <code>context</code> object with a <code>nextPageToken</code> key. E.g., <code>{ options, context: { nextPageToken }, }</code></td>
</tr>
<tr>
<td><code>page</code></td>
<td><code>integer</code></td>
<td>optional</td>
<td>Returns a <code>0</code> indexed page number. For use with APIs that accept a numeric page number for pagination.</td>
</tr>
<tr>
<td><code>prevContext</code></td>
<td><code>string</code></td>
<td>optional</td>
<td>Return a string representing the context for the previous <code>options</code> invocation. For use with APIs that accept a token representing the last record for pagination.</td>
</tr>
</tbody>
</table>
<p>Following is an example source demonstrating the usage of async options:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Async Options Example"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">"0.1"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">msg</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"string"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">label</span><span class="token operator">:</span> <span class="token string">"Message"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">"Select a message to `console.log()`"</span><span class="token punctuation">,</span>
      <span class="token keyword">async</span> <span class="token function">options</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// write any node code that returns a string[] or object[] (with label/value keys)</span>
        <span class="token keyword">return</span> <span class="token punctuation">[</span><span class="token string">"This is option 1"</span><span class="token punctuation">,</span> <span class="token string">"This is option 2"</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">$emit</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>msg<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br></div></div><h5 id="prop-definitions-example" tabindex="-1"><a class="header-anchor" href="#prop-definitions-example" aria-hidden="true">#</a> Prop Definitions (<a href="https://github.com/PipedreamHQ/pipedream/blob/master/components/github/sources/new-commit/new-commit.js" target="_blank" rel="noopener noreferrer">example<ExternalLinkIcon/></a>)</h5>
<p>Prop definitions enable you to reuse props that are defined in another object. A common use case is to enable re-use of props that are defined for a specific app.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">myPropName</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">propDefinition</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      app<span class="token punctuation">,</span>
      <span class="token string">"propDefinitionName"</span><span class="token punctuation">,</span>
      inputValues
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>

</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
<th>Required?</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>propDefinition</code></td>
<td><code>array</code></td>
<td>optional</td>
<td>An array of options that define a reference to a <code>propDefinitions</code> within the <code>propDefinitions</code> for an <code>app</code></td>
</tr>
<tr>
<td><code>app</code></td>
<td><code>object</code></td>
<td>required</td>
<td>An app object</td>
</tr>
<tr>
<td><code>propDefinitionName</code></td>
<td><code>string</code></td>
<td>required</td>
<td>The name of a specific <code>propDefinition</code> defined in the corresponding <code>app</code> object</td>
</tr>
<tr>
<td><code>inputValues</code></td>
<td><code>object</code></td>
<td>optional</td>
<td>Values to pass into the prop definition. To reference values from previous props, use an arrow function. E.g.,:<br> <br><code>c =&gt; ({ variableName: c.previousPropName })</code><br /><br /><a href="#referencing-values-from-previous-props">See these docs</a> for more information.</td>
</tr>
</tbody>
</table>
<p>Following is an example source that demonstrates how to use <code>propDefinitions</code>.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">const</span> rss <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"app"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">app</span><span class="token operator">:</span> <span class="token string">"rss"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">propDefinitions</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">urlDef</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"string"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">label</span><span class="token operator">:</span> <span class="token string">"RSS URL"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">"Enter a URL for an RSS feed."</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Prop Definition Example"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">This component captures an RSS URL and logs it</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">"0.1"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    rss<span class="token punctuation">,</span>
    <span class="token literal-property property">url</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token literal-property property">propDefinition</span><span class="token operator">:</span> <span class="token punctuation">[</span>rss<span class="token punctuation">,</span> <span class="token string">"urlDef"</span><span class="token punctuation">]</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>url<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br></div></div><h5 id="referencing-values-from-previous-props" tabindex="-1"><a class="header-anchor" href="#referencing-values-from-previous-props" aria-hidden="true">#</a> Referencing values from previous props</h5>
<p>When you define a prop in an app file, and that prop depends on the value of another prop, you'll need to pass the value of the previous props in a special way. Let's review an example from <a href="https://trello.com" target="_blank" rel="noopener noreferrer">Trello<ExternalLinkIcon/></a>, a task manager.</p>
<p>You create Trello <em>boards</em> for new projects. Boards contain <em>lists</em>. For example, this <strong>Active</strong> board contains two lists:</p>
<div>
<img alt="Trello board example" src="@source/components/api/images/trello-board-example.png">
</div>
<p>In Pipedream, users can choose from lists on a specific board:</p>
<div>
<img alt="Trello board and lists props" src="@source/components/api/images/trello-props.png">
</div>
<p>Both <strong>Board</strong> and <strong>Lists</strong> are defined in the Trello app file:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token literal-property property">board</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"string"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">label</span><span class="token operator">:</span> <span class="token string">"Board"</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">options</span><span class="token punctuation">(</span><span class="token parameter">opts</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> boards <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getBoards</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>$auth<span class="token punctuation">.</span>oauth_uid<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> activeBoards <span class="token operator">=</span> boards<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">board</span><span class="token punctuation">)</span> <span class="token operator">=></span> board<span class="token punctuation">.</span>closed <span class="token operator">===</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> activeBoards<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">board</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token punctuation">{</span> <span class="token literal-property property">label</span><span class="token operator">:</span> board<span class="token punctuation">.</span>name<span class="token punctuation">,</span> <span class="token literal-property property">value</span><span class="token operator">:</span> board<span class="token punctuation">.</span>id <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token literal-property property">lists</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"string[]"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">label</span><span class="token operator">:</span> <span class="token string">"Lists"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">optional</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">options</span><span class="token punctuation">(</span><span class="token parameter">opts</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> lists <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getLists</span><span class="token punctuation">(</span>opts<span class="token punctuation">.</span>board<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> lists<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">list</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token punctuation">{</span> <span class="token literal-property property">label</span><span class="token operator">:</span> list<span class="token punctuation">.</span>name<span class="token punctuation">,</span> <span class="token literal-property property">value</span><span class="token operator">:</span> list<span class="token punctuation">.</span>id <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><p>In the <code>lists</code> prop, notice how <code>opts.board</code> references the board. You can pass <code>opts</code> to the prop's <code>options</code> method when you reference <code>propDefinitions</code> in specific components:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token literal-property property">board</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token literal-property property">propDefinition</span><span class="token operator">:</span> <span class="token punctuation">[</span>trello<span class="token punctuation">,</span> <span class="token string">"board"</span><span class="token punctuation">]</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token literal-property property">lists</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">propDefinition</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    trello<span class="token punctuation">,</span>
    <span class="token string">"lists"</span><span class="token punctuation">,</span>
    <span class="token punctuation">(</span><span class="token parameter">configuredProps</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">board</span><span class="token operator">:</span> configuredProps<span class="token punctuation">.</span>board <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p><code>configuredProps</code> contains the props the user previously configured (the board). This allows the <code>lists</code> prop to use it in the <code>options</code> method.</p>
<h4 id="interface-props" tabindex="-1"><a class="header-anchor" href="#interface-props" aria-hidden="true">#</a> Interface Props</h4>
<p>Interface props are infrastructure abstractions provided by the Pipedream platform. They declare how a source is invoked — via HTTP request, run on a schedule, etc. — and therefore define the shape of the events it processes.</p>
<table>
<thead>
<tr>
<th>Interface Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><a href="#timer">Timer</a></td>
<td>Invoke your source on an interval or based on a cron expression</td>
</tr>
<tr>
<td><a href="#http">HTTP</a></td>
<td>Invoke your source on HTTP requests</td>
</tr>
</tbody>
</table>
<h4 id="timer" tabindex="-1"><a class="header-anchor" href="#timer" aria-hidden="true">#</a> Timer</h4>
<p>To use the timer interface, declare a prop whose value is the string <code>$.interface.timer</code>:</p>
<p><strong>Definition</strong></p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">myPropName</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"$.interface.timer"</span><span class="token punctuation">,</span>
    <span class="token keyword">default</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
<th>Required?</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>type</code></td>
<td><code>string</code></td>
<td>required</td>
<td>Must be set to <code>$.interface.timer</code></td>
</tr>
<tr>
<td><code>default</code></td>
<td><code>object</code></td>
<td>optional</td>
<td><strong>Define a default interval</strong><br><code>{ intervalSeconds: 60, },</code><br> <br><strong>Define a default cron expression</strong><br><code> { cron: &quot;0 0 * * *&quot;, },</code></td>
</tr>
</tbody>
</table>
<p><strong>Usage</strong></p>
<table>
<thead>
<tr>
<th>Code</th>
<th>Description</th>
<th>Read Scope</th>
<th>Write Scope</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>this.myPropName</code></td>
<td>Returns the type of interface configured (e.g., <code>{ type: '$.interface.timer' }</code>)</td>
<td><code>run()</code> <code>hooks</code> <code>methods</code></td>
<td>n/a (interface props may only be modified on component deploy or update via UI, CLI or API)</td>
</tr>
<tr>
<td><code>event</code></td>
<td>Returns an object with the invocation timestamp and interface configuration (e.g., <code>{ &quot;timestamp&quot;: 1593937896, &quot;interval_seconds&quot;: 3600 }</code>)</td>
<td><code>run(event)</code></td>
<td>n/a (interface props may only be modified on source deploy or update via UI, CLI or API)</td>
</tr>
</tbody>
</table>
<p><strong>Example</strong></p>
<p>Following is a basic example of a source that is triggered by a <code>$.interface.timer</code> and has default defined as a cron expression.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Cron Example"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">"0.1"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">timer</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"$.interface.timer"</span><span class="token punctuation">,</span>
      <span class="token keyword">default</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">cron</span><span class="token operator">:</span> <span class="token string">"0 0 * * *"</span><span class="token punctuation">,</span> <span class="token comment">// Run job once a day</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"hello world!"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><p>Following is an example source that's triggered by a <code>$.interface.timer</code> and has a <code>default</code> interval defined.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Interval Example"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">"0.1"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">timer</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"$.interface.timer"</span><span class="token punctuation">,</span>
      <span class="token keyword">default</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">intervalSeconds</span><span class="token operator">:</span> <span class="token number">60</span> <span class="token operator">*</span> <span class="token number">60</span> <span class="token operator">*</span> <span class="token number">24</span><span class="token punctuation">,</span> <span class="token comment">// Run job once a day</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">"hello world!"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br></div></div><h5 id="http" tabindex="-1"><a class="header-anchor" href="#http" aria-hidden="true">#</a> HTTP</h5>
<p>To use the HTTP interface, declare a prop whose value is the string <code>$.interface.http</code>:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">myPropName</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"$.interface.http"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">customResponse</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token comment">// optional: defaults to false</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p><strong>Definition</strong></p>
<table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
<th>Required?</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>type</code></td>
<td><code>string</code></td>
<td>required</td>
<td>Must be set to <code>$.interface.http</code></td>
</tr>
<tr>
<td><code>respond</code></td>
<td><code>method</code></td>
<td>required</td>
<td>The HTTP interface exposes a <code>respond()</code> method that lets your component issue HTTP responses to the client.</td>
</tr>
</tbody>
</table>
<p><strong>Usage</strong></p>
<table>
<thead>
<tr>
<th>Code</th>
<th>Description</th>
<th>Read Scope</th>
<th>Write Scope</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>this.myPropName</code></td>
<td>Returns an object with the unique endpoint URL generated by Pipedream (e.g., <code>{ endpoint: 'https://abcde.m.pipedream.net' }</code>)</td>
<td><code>run()</code> <code>hooks</code> <code>methods</code></td>
<td>n/a (interface props may only be modified on source deploy or update via UI, CLI or API)</td>
</tr>
<tr>
<td><code>event</code></td>
<td>Returns an object representing the HTTP request (e.g., <code>{ method: 'POST', path: '/', query: {}, headers: {}, bodyRaw: '', body: {}, }</code>)</td>
<td><code>run(event)</code></td>
<td>The shape of <code>event</code> corresponds with the the HTTP request you make to the endpoint generated by Pipedream for this interface</td>
</tr>
<tr>
<td><code>this.myPropName.respond()</code></td>
<td>Returns an HTTP response to the client (e.g., <code>this.http.respond({status: 200})</code>).</td>
<td>n/a</td>
<td><code>run()</code></td>
</tr>
</tbody>
</table>
<h6 id="responding-to-http-requests" tabindex="-1"><a class="header-anchor" href="#responding-to-http-requests" aria-hidden="true">#</a> Responding to HTTP requests</h6>
<p>The HTTP interface exposes a <code>respond()</code> method that lets your source issue HTTP responses. You may run <code>this.http.respond()</code> to respond to the client from the <code>run()</code> method of a source.  In this case you should also pass the <code>customResponse: true</code> parameter to the prop.</p>
<table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
<th>Required?</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>status</code></td>
<td><code>integer</code></td>
<td>required</td>
<td>An integer representing the HTTP status code. Return <code>200</code> to indicate success. Standard status codes range from <code>100</code> - <code>599</code></td>
</tr>
<tr>
<td><code>headers</code></td>
<td><code>object</code></td>
<td>optional</td>
<td>Return custom key-value pairs in the HTTP response</td>
</tr>
<tr>
<td><code>body</code></td>
<td><code>string</code> <code>object</code> <code>buffer</code></td>
<td>optional</td>
<td>Return a custom body in the HTTP response. This can be any string, object, or Buffer.</td>
</tr>
</tbody>
</table>
<h6 id="http-event-shape" tabindex="-1"><a class="header-anchor" href="#http-event-shape" aria-hidden="true">#</a> HTTP Event Shape</h6>
<p>Following is the shape of the event passed to the <code>run()</code> method of your source:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token punctuation">{</span>
  <span class="token literal-property property">method</span><span class="token operator">:</span> <span class="token string">'POST'</span><span class="token punctuation">,</span>
  <span class="token literal-property property">path</span><span class="token operator">:</span> <span class="token string">'/'</span><span class="token punctuation">,</span>
  <span class="token literal-property property">query</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">headers</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">bodyRaw</span><span class="token operator">:</span> <span class="token string">''</span><span class="token punctuation">,</span>
  <span class="token literal-property property">body</span><span class="token operator">:</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p><strong>Example</strong></p>
<p>Following is an example source that's triggered by <code>$.interface.http</code> and returns <code>{ 'msg': 'hello world!' }</code> in the HTTP response. On deploy, Pipedream will generate a unique URL for this source:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"HTTP Example"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">version</span><span class="token operator">:</span> <span class="token string">"0.0.1"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">http</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"$.interface.http"</span><span class="token punctuation">,</span>
      <span class="token literal-property property">customResponse</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter">event</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>http<span class="token punctuation">.</span><span class="token function">respond</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
      <span class="token literal-property property">status</span><span class="token operator">:</span> <span class="token number">200</span><span class="token punctuation">,</span>
      <span class="token literal-property property">body</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">msg</span><span class="token operator">:</span> <span class="token string">"hello world!"</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token literal-property property">headers</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token string-property property">"content-type"</span><span class="token operator">:</span> <span class="token string">"application/json"</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br></div></div><h4 id="service-props" tabindex="-1"><a class="header-anchor" href="#service-props" aria-hidden="true">#</a> Service Props</h4>
<table>
<thead>
<tr>
<th>Service</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>DB</em></td>
<td>Provides access to a simple, component-specific key-value store to maintain state across invocations.</td>
</tr>
</tbody>
</table>
<h5 id="db" tabindex="-1"><a class="header-anchor" href="#db" aria-hidden="true">#</a> DB</h5>
<p><strong>Definition</strong></p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">myPropName</span><span class="token operator">:</span> <span class="token string">"$.service.db"</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p><strong>Usage</strong></p>
<table>
<thead>
<tr>
<th>Code</th>
<th>Description</th>
<th>Read Scope</th>
<th>Write Scope</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>this.myPropName.get('key')</code></td>
<td>Method to get a previously set value for a key. Returns <code>undefined</code> if a key does not exist.</td>
<td><code>run()</code> <code>hooks</code> <code>methods</code></td>
<td>Use the <code>set()</code> method to write values</td>
</tr>
<tr>
<td><code>this.myPropName.set('key', value)</code></td>
<td>Method to set a value for a key. Values must be JSON-serializable data.</td>
<td>Use the <code>get()</code> method to read values</td>
<td><code>run()</code> <code>hooks</code> <code>methods</code></td>
</tr>
</tbody>
</table>
<h4 id="app-props" tabindex="-1"><a class="header-anchor" href="#app-props" aria-hidden="true">#</a> App Props</h4>
<p>App props are normally defined in an <a href="/components/guidelines/#app-files" target="_blank" rel="noopener noreferrer">app file<ExternalLinkIcon/></a>, separate from individual components. See <a href="https://github.com/PipedreamHQ/pipedream/tree/master/components" target="_blank" rel="noopener noreferrer">the <code>components/</code> directory of the pipedream GitHub repo<ExternalLinkIcon/></a> for example app files.</p>
<p><strong>Definition</strong></p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">myPropName</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"app"</span><span class="token punctuation">,</span>
    <span class="token literal-property property">app</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span>
    <span class="token literal-property property">propDefinitions</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
    <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
<th>Required?</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>type</code></td>
<td><code>string</code></td>
<td>required</td>
<td>Value must be <code>app</code></td>
</tr>
<tr>
<td><code>app</code></td>
<td><code>string</code></td>
<td>required</td>
<td>Value must be set to the name slug for an app registered on Pipedream. <a href="/components/guidelines/#app-files" target="_blank" rel="noopener noreferrer">App files<ExternalLinkIcon/></a> are programmatically generated for all integrated apps on Pipedream. To find your app's slug, visit the <code>components</code> directory of <a href="https://github.com/PipedreamHQ/pipedream/tree/master/components" target="_blank" rel="noopener noreferrer">the Pipedream GitHub repo<ExternalLinkIcon/></a>, find the app file (the file that ends with <code>.app.mjs</code>), and find the <code>app</code> property at the root of that module. If you don't see an app listed, please <a href="https://github.com/PipedreamHQ/pipedream/issues/new?assignees=&amp;labels=app%2C+enhancement&amp;template=app---service-integration.md&amp;title=%5BAPP%5D" target="_blank" rel="noopener noreferrer">open an issue here<ExternalLinkIcon/></a>.</td>
</tr>
<tr>
<td><code>propDefinitions</code></td>
<td><code>object</code></td>
<td>optional</td>
<td>An object that contains objects with predefined user input props. See the section on User Input Props above to learn about the shapes that can be defined and how to reference in components using the <code>propDefinition</code> property</td>
</tr>
<tr>
<td><code>methods</code></td>
<td><code>object</code></td>
<td>optional</td>
<td>Define app-specific methods. Methods can be referenced within the app object context via <code>this</code> (e.g., <code>this.methodName()</code>) and within a component via <code>this.myAppPropName</code> (e.g., <code>this.myAppPropName.methodName()</code>).</td>
</tr>
</tbody>
</table>
<p><strong>Usage</strong></p>
<table>
<thead>
<tr>
<th>Code</th>
<th>Description</th>
<th>Read Scope</th>
<th>Write Scope</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>this.$auth</code></td>
<td>Provides access to OAuth tokens and API keys for Pipedream managed auth</td>
<td><strong>App Object:</strong> <code>methods</code></td>
<td>n/a</td>
</tr>
<tr>
<td><code>this.myAppPropName.$auth</code></td>
<td>Provides access to OAuth tokens and API keys for Pipedream managed auth</td>
<td><strong>Parent Component:</strong> <code>run()</code> <code>hooks</code> <code>methods</code></td>
<td>n/a</td>
</tr>
<tr>
<td><code>this.methodName()</code></td>
<td>Execute a common method defined for an app within the app definition (e.g., from another method)</td>
<td><strong>App Object:</strong> <code>methods</code></td>
<td>n/a</td>
</tr>
<tr>
<td><code>this.myAppPropName.methodName()</code></td>
<td>Execute a common method defined for an app from a component that includes the app as a prop</td>
<td><strong>Parent Component:</strong> <code>run()</code> <code>hooks</code> <code>methods</code></td>
<td>n/a</td>
</tr>
</tbody>
</table>
<blockquote>
<p><strong>Note:</strong> The specific <code>$auth</code> keys supported for each app will be published in the near future.</p>
</blockquote>
<h4 id="limits-on-props" tabindex="-1"><a class="header-anchor" href="#limits-on-props" aria-hidden="true">#</a> Limits on props</h4>
<p>When a user configures a prop with a value, it can hold at most <code>{{$site.themeConfig.CONFIGURED_PROPS_SIZE_LIMIT}}</code> data. Consider this when accepting large input in these fields (such as a base64 string).</p>
<p>The <code>{{$site.themeConfig.CONFIGURED_PROPS_SIZE_LIMIT}}</code> limit applies only to static values entered as raw text. In workflows, users can pass expressions (referencing data in a prior step). In that case the prop value is simply the text of the expression, for example <code v-pre>{{steps.nodejs.$return_value}}</code>, well below the limit. The value of these expressions is evaluated at runtime, and are subject to <a href="/limits" target="_blank" rel="noopener noreferrer">different limits<ExternalLinkIcon/></a>.</p>
<h3 id="methods" tabindex="-1"><a class="header-anchor" href="#methods" aria-hidden="true">#</a> Methods</h3>
<p>You can define helper functions within the <code>methods</code> property of your component. You have access to these functions within the <a href="#run"><code>run</code> method</a>, or within other methods.</p>
<p>Methods can be accessed using <code>this.&lt;method-name&gt;</code>. For example, a <code>random</code> method:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> Math<span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><p>can be run like so:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">const</span> randomNum <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h3 id="hooks" tabindex="-1"><a class="header-anchor" href="#hooks" aria-hidden="true">#</a> Hooks</h3>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token literal-property property">hooks</span><span class="token operator">:</span> <span class="token punctuation">{</span>
  <span class="token keyword">async</span> <span class="token function">deploy</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">activate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">deactivate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
<th>Required?</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>deploy</code></td>
<td><code>method</code></td>
<td>optional</td>
<td>Executed each time a component is deployed</td>
</tr>
<tr>
<td><code>activate</code></td>
<td><code>method</code></td>
<td>optional</td>
<td>Executed each time a component is deployed or updated</td>
</tr>
<tr>
<td><code>deactivate</code></td>
<td><code>method</code></td>
<td>optional</td>
<td>Executed each time a component is deactivated</td>
</tr>
</tbody>
</table>
<h3 id="dedupe-strategies" tabindex="-1"><a class="header-anchor" href="#dedupe-strategies" aria-hidden="true">#</a> Dedupe Strategies</h3>
<blockquote>
<p><strong>IMPORTANT:</strong> To use a dedupe strategy, you must emit an <code>id</code> as part of the event metadata (dedupe strategies are applied to the submitted <code>id</code>)</p>
</blockquote>
<table>
<thead>
<tr>
<th>Strategy</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>unique</code></td>
<td>Pipedream maintains a cache of 100 emitted <code>id</code> values. Events with <code>id</code> values that are not in the cache are emitted, and the <code>id</code> value is added to the cache. After 100 events, <code>id</code> values are purged from the cache based on the order received (first in, first out). A common use case for this strategy is an RSS feed which typically does not exceed 100 items</td>
</tr>
<tr>
<td><code>greatest</code></td>
<td>Pipedream caches the largest <code>id</code> value (must be numeric). Only events with larger <code>id</code> values are emitted, and the cache is updated to match the new, largest value..</td>
</tr>
<tr>
<td><code>last</code></td>
<td>Pipedream caches the ID associated with the last emitted event. When new events are emitted, only events after the matching <code>id</code> value will be emitted as events. If no <code>id</code> values match, then all events will be emitted.</td>
</tr>
</tbody>
</table>
<h3 id="run" tabindex="-1"><a class="header-anchor" href="#run" aria-hidden="true">#</a> Run</h3>
<p>Each time a component is invoked, its <code>run</code> method is called. Sources are invoked by their <a href="#interface-props">interface</a> (for example, via HTTP request). Actions are run when their parent workflow is triggered.</p>
<p>You can reference <a href="#referencing-this"><code>this</code></a> within the <code>run</code> method. <code>this</code> refers to the component, and provides access to <a href="#props">props</a>, <a href="#methods">methods</a>, and more.</p>
<h4 id="sources" tabindex="-1"><a class="header-anchor" href="#sources" aria-hidden="true">#</a> Sources</h4>
<p>When a source is invoked, the event that triggered the source is passed to <code>run</code>, so that you can access it within the method:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter">event</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>event<span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h5 id="emit" tabindex="-1"><a class="header-anchor" href="#emit" aria-hidden="true">#</a> $emit</h5>
<p><code>this.$emit()</code> is a method in scope for the <code>run</code> method of a source</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">$emit</span><span class="token punctuation">(</span>event<span class="token punctuation">,</span> <span class="token punctuation">{</span>
  id<span class="token punctuation">,</span>
  name<span class="token punctuation">,</span>
  summary<span class="token punctuation">,</span>
  ts<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><table>
<thead>
<tr>
<th>Property</th>
<th>Type</th>
<th>Required?</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>event</code></td>
<td>JSON serializable data</td>
<td>optional</td>
<td>The data to emit as the event</td>
</tr>
<tr>
<td><code>id</code></td>
<td><code>string</code> or <code>number</code></td>
<td>Required if a dedupe strategy is applied</td>
<td>A value to uniquely identify this event. Common <code>id</code> values may be a 3rd party ID, a timestamp, or a data hash</td>
</tr>
<tr>
<td><code>name</code></td>
<td><code>string</code></td>
<td>optional</td>
<td>The name of the &quot;channel&quot; you'd like to emit the event to. By default, events are emitted to the <code>default</code> channel. If you set a different channel here, listening sources or workflows can subscribe to events on this channel, running the source or workflow only on events emitted to that channel.</td>
</tr>
<tr>
<td><code>summary</code></td>
<td><code>string</code></td>
<td>optional</td>
<td>Define a summary to customize the data displayed in the events list to help differentiate events at a glance</td>
</tr>
<tr>
<td><code>ts</code></td>
<td><code>integer</code></td>
<td>optional</td>
<td>Accepts an epoch timestamp in <strong>milliseconds</strong>. If you submit a timestamp, events will automatically be ordered and emitted from oldest to newest. If using the <code>last</code> dedupe strategy, the value cached as the <code>last</code> event for an invocation will correspond to the event with the newest timestamp.</td>
</tr>
</tbody>
</table>
<p>Following is a basic example that emits an event on each component execution.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"this.$emit() example"</span><span class="token punctuation">,</span>
  <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">"Deploy and run this component manually via the Pipedream UI"</span><span class="token punctuation">,</span>
  <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">$emit</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">message</span><span class="token operator">:</span> <span class="token string">"hello world!"</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br></div></div><h5 id="logs" tabindex="-1"><a class="header-anchor" href="#logs" aria-hidden="true">#</a> Logs</h5>
<p>You can view logs produced by a source's <code>run</code> method in the <strong>Logs</strong> section of the <a href="https://pipedream.com/sources" target="_blank" rel="noopener noreferrer">Pipedream source UI<ExternalLinkIcon/></a>, or using the <code>pd logs</code> CLI command:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pd logs <span class="token operator">&lt;</span>deployed-component-name<span class="token operator">></span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h5 id="events" tabindex="-1"><a class="header-anchor" href="#events" aria-hidden="true">#</a> Events</h5>
<p>If the <code>run</code> method emits events using <code>this.$emit</code>, you can access the events in the <strong>EVENTS</strong> section of the Pipedream UI for the component, or using the <code>pd events</code> CLI command:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pd events <span class="token operator">&lt;</span>deployed-component-name<span class="token operator">></span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="actions" tabindex="-1"><a class="header-anchor" href="#actions" aria-hidden="true">#</a> Actions</h4>
<p>When an action is run in a workflow, Pipedream passes an object with a <code>$</code> variable that gives you access to special functions, outlined below:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// You have access to $ within your action</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h5 id="returning-data-from-steps" tabindex="-1"><a class="header-anchor" href="#returning-data-from-steps" aria-hidden="true">#</a> Returning data from steps</h5>
<p>By default, variables declared within an action are scoped to that action. To return data from a step, you have two options: 1) use the <code>return</code> keyword, or 2) use <code>$.export</code> to return a named export from a step.</p>
<p><strong><code>return</code></strong></p>
<p>Use <code>return</code> to return data from an action:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token string">"data"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>When you use return, the exported data will appear at <code>steps.[STEP NAME].$return_value</code>. For example, if you ran the code above in a step named <code>nodejs</code>, you'd reference the returned data using <code>steps.nodejs.$return_value</code>.</p>
<p><strong><code>$.export</code></strong></p>
<p>You can also use <code>$.export</code> to return named exports from an action. <code>$.export</code> takes the name of the export as the first argument, and the value to export as the second argument:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  $<span class="token punctuation">.</span><span class="token function">export</span><span class="token punctuation">(</span><span class="token string">"name"</span><span class="token punctuation">,</span> <span class="token string">"value"</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>When your workflow runs, you'll see the named exports appear below your step, with the data you exported. You can reference these exports in other steps using <code>steps.[STEP NAME].[EXPORT NAME]</code>.</p>
<p><strong><code>$.respond</code></strong></p>
<p><code>$.respond</code> functions the same way as <code>$respond</code> in workflow code steps. <a href="/workflows/steps/triggers/#customizing-the-http-response" target="_blank" rel="noopener noreferrer">See the <code>$respond</code> docs for more information<ExternalLinkIcon/></a>.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  $<span class="token punctuation">.</span><span class="token function">respond</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    <span class="token literal-property property">status</span><span class="token operator">:</span> <span class="token number">200</span><span class="token punctuation">,</span>
    <span class="token literal-property property">body</span><span class="token operator">:</span> <span class="token string">"hello, world"</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br></div></div><p><strong><code>return $.flow.exit</code></strong></p>
<p><code>return $.flow.exit</code> terminates the entire workflow. It accepts a single argument: a string that tells the workflow why the workflow terminated, which is displayed in the Pipedream UI.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">{</span> $ <span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> $<span class="token punctuation">.</span>flow<span class="token punctuation">.</span><span class="token function">exit</span><span class="token punctuation">(</span><span class="token string">"reason"</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>It functions the same way as <a href="/workflows/steps/code/#end" target="_blank" rel="noopener noreferrer"><code>$end</code> in workflow code steps<ExternalLinkIcon/></a>.</p>
<p><strong><code>$.summary</code></strong></p>
<p><code>$.summary</code> is used to surface brief, user-friendly summaries about what happened when an action step succeeds. For example, when <a href="https://github.com/PipedreamHQ/pipedream/blob/master/components/spotify/actions/add-items-to-playlist/add-items-to-playlist.mjs#L51" target="_blank" rel="noopener noreferrer">adding items to a Spotify playlist<ExternalLinkIcon/></a>:</p>
<div>
<img alt="Spotify example with $summary" src="@source/components/api/images/spotify-$summary-example.png">
</div>
<p>Example implementation:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">const</span> data <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">]</span>
<span class="token keyword">const</span> playlistName <span class="token operator">=</span> <span class="token string">"Cool jams"</span>
$<span class="token punctuation">.</span><span class="token function">export</span><span class="token punctuation">(</span><span class="token string">"$summary"</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">Successfully added </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>data<span class="token punctuation">.</span>length<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>data<span class="token punctuation">.</span>length <span class="token operator">==</span> <span class="token number">1</span> <span class="token operator">?</span> <span class="token string">"item"</span> <span class="token operator">:</span> <span class="token string">"items"</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> to "</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>playlistName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">"</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p><strong><code>$.send</code></strong></p>
<p><code>$.send</code> allows you to send data to <a href="/destinations/" target="_blank" rel="noopener noreferrer">Pipedream destinations<ExternalLinkIcon/></a>.</p>
<p><strong><code>$.send.http</code></strong></p>
<p><a href="/destinations/http/#using-send-http-in-component-actions" target="_blank" rel="noopener noreferrer">See the HTTP destination docs<ExternalLinkIcon/></a>.</p>
<p><strong><code>$.send.email</code></strong></p>
<p><a href="/destinations/email/#using-send-email-in-component-actions" target="_blank" rel="noopener noreferrer">See the Email destination docs<ExternalLinkIcon/></a>.</p>
<p><strong><code>$.send.s3</code></strong></p>
<p><a href="/destinations/s3/#using-send-s3-in-component-actions" target="_blank" rel="noopener noreferrer">See the S3 destination docs<ExternalLinkIcon/></a>.</p>
<p><strong><code>$.send.emit</code></strong></p>
<p><a href="/destinations/emit/#using-send-emit-in-component-actions" target="_blank" rel="noopener noreferrer">See the Emit destination docs<ExternalLinkIcon/></a>.</p>
<p><strong><code>$.send.sse</code></strong></p>
<p><a href="/destinations/sse/#using-send-sse-in-component-actions" target="_blank" rel="noopener noreferrer">See the SSE destination docs<ExternalLinkIcon/></a>.</p>
<h3 id="environment-variables" tabindex="-1"><a class="header-anchor" href="#environment-variables" aria-hidden="true">#</a> Environment variables</h3>
<p><a href="/environment-variables/" target="_blank" rel="noopener noreferrer">Environment variables<ExternalLinkIcon/></a> are not accessible within sources or actions directly. Since components can be used by anyone, you cannot guarantee that a user will have a specific variable set in their environment.</p>
<p>For sources, you can use <a href="#props"><code>secret</code> props</a> to reference sensitive data.</p>
<p>For actions, you can pass environment variables as the values of props using the <a href="/workflows/steps/params/#use-the-object-explorer" target="_blank" rel="noopener noreferrer">object explorer<ExternalLinkIcon/></a> within your workflow.</p>
<h3 id="using-npm-packages" tabindex="-1"><a class="header-anchor" href="#using-npm-packages" aria-hidden="true">#</a> Using npm packages</h3>
<p>To use an npm package in a component, just require it. There is no <code>package.json</code> or <code>npm install</code> required.</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token keyword">import</span> axios <span class="token keyword">from</span> <span class="token string">"axios"</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>When you deploy a component, Pipedream downloads the latest versions of these packages and bundles them with your deployment.</p>
<p>Some packages — for example, packages like <a href="https://pptr.dev/" target="_blank" rel="noopener noreferrer">Puppeteer<ExternalLinkIcon/></a>, which includes large dependencies like Chromium — may not work on Pipedream. Please <a href="https://pipedream.com/community" target="_blank" rel="noopener noreferrer">reach out<ExternalLinkIcon/></a> if you encounter a specific issue.</p>
<h4 id="referencing-a-specific-version-of-a-package" tabindex="-1"><a class="header-anchor" href="#referencing-a-specific-version-of-a-package" aria-hidden="true">#</a> Referencing a specific version of a package</h4>
<p><em>This currently applies only to sources</em>.</p>
<p>If you'd like to use a <em>specific</em> version of a package in a source, you can add that version in the <code>require</code> string, for example: <code>require(&quot;axios@0.19.2&quot;)</code>. Moreover, you can pass the same version specifiers that npm and other tools allow to specify allowed <a href="https://semver.org/" target="_blank" rel="noopener noreferrer">semantic version<ExternalLinkIcon/></a> upgrades. For example:</p>
<ul>
<li>To allow for future patch version upgrades, use <code>require(&quot;axios@~0.20.0&quot;)</code></li>
<li>To allow for patch and minor version upgrades, use <code>require(&quot;axios@^0.20.0&quot;)</code></li>
</ul>
<h2 id="managing-components" tabindex="-1"><a class="header-anchor" href="#managing-components" aria-hidden="true">#</a> Managing Components</h2>
<p>Sources and actions are developed and deployed in different ways, given the different functions they serve in the product.</p>
<ul>
<li><a href="#managing-sources">Managing Sources</a></li>
<li><a href="#managing-actions">Managing Actions</a></li>
</ul>
<h3 id="managing-sources" tabindex="-1"><a class="header-anchor" href="#managing-sources" aria-hidden="true">#</a> Managing Sources</h3>
<h4 id="cli-development-mode" tabindex="-1"><a class="header-anchor" href="#cli-development-mode" aria-hidden="true">#</a> CLI - Development Mode</h4>
<hr>
<p>The easiest way to develop and test sources is with the <code>pd dev</code> command. <code>pd dev</code> deploys a local file, attaches it to a component, and automatically updates the component on each local save. To deploy a new component with <code>pd dev</code>, run:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pd dev <span class="token operator">&lt;</span>filename<span class="token operator">></span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>To attach to an existing deployed component, run:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pd dev --dc <span class="token operator">&lt;</span>existing-deployed-component-id<span class="token operator">></span> <span class="token operator">&lt;</span>file-or-name<span class="token operator">></span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="cli-deploy" tabindex="-1"><a class="header-anchor" href="#cli-deploy" aria-hidden="true">#</a> CLI - Deploy</h4>
<h5 id="from-local-code" tabindex="-1"><a class="header-anchor" href="#from-local-code" aria-hidden="true">#</a> From Local Code</h5>
<p>To deploy a source via CLI, use the <code>pd deploy</code> command.</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pd deploy <span class="token operator">&lt;</span>filename<span class="token operator">></span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>E.g.,</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pd deploy my-source.js
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h5 id="from-pipedream-github-repo" tabindex="-1"><a class="header-anchor" href="#from-pipedream-github-repo" aria-hidden="true">#</a> From Pipedream Github Repo</h5>
<p>You can explore the components available to deploy in <a href="https://github.com/pipedreamhq/pipedream/tree/master/components" target="_blank" rel="noopener noreferrer">Pipedream's GitHub repo<ExternalLinkIcon/></a>.</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pd deploy <span class="token operator">&lt;</span>source-key<span class="token operator">></span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>E.g.,</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pd deploy http-new-requests
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h5 id="from-any-url" tabindex="-1"><a class="header-anchor" href="#from-any-url" aria-hidden="true">#</a> From Any URL</h5>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pd deploy <span class="token operator">&lt;</span>url-to-raw-code<span class="token operator">></span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>E.g.,</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pd deploy https://raw.githubusercontent.com/PipedreamHQ/pipedream/master/components/http/sources/new-requests/new-requests.js
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="cli-update" tabindex="-1"><a class="header-anchor" href="#cli-update" aria-hidden="true">#</a> CLI - Update</h4>
<p>View the <a href="/cli/reference/#command-reference" target="_blank" rel="noopener noreferrer">CLI command reference<ExternalLinkIcon/></a>.</p>
<h4 id="cli-delete" tabindex="-1"><a class="header-anchor" href="#cli-delete" aria-hidden="true">#</a> CLI - Delete</h4>
<p>View the <a href="/cli/reference/#command-reference" target="_blank" rel="noopener noreferrer">CLI command reference<ExternalLinkIcon/></a>.</p>
<h4 id="ui-deploy" tabindex="-1"><a class="header-anchor" href="#ui-deploy" aria-hidden="true">#</a> UI - Deploy</h4>
<p>You can find and deploy curated components at <a href="https://pipedream.com/sources/new" target="_blank" rel="noopener noreferrer">https://pipedream.com/sources/new<ExternalLinkIcon/></a>, or you can deploy code via the UI using following URL patterns.</p>
<h5 id="from-pipedream-github-repo-1" tabindex="-1"><a class="header-anchor" href="#from-pipedream-github-repo-1" aria-hidden="true">#</a> From Pipedream Github Repo</h5>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>https://pipedream.com/sources?action<span class="token operator">=</span>create<span class="token operator">&amp;</span><span class="token assign-left variable">key</span><span class="token operator">=</span><span class="token operator">&lt;</span>source-key<span class="token operator">></span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>E.g.,</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>https://pipedream.com/sources?action<span class="token operator">=</span>create<span class="token operator">&amp;</span><span class="token assign-left variable">key</span><span class="token operator">=</span>http-new-requests
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h5 id="from-any-url-1" tabindex="-1"><a class="header-anchor" href="#from-any-url-1" aria-hidden="true">#</a> From Any URL</h5>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>https://pipedream.com/sources?action<span class="token operator">=</span>create<span class="token operator">&amp;</span><span class="token assign-left variable">url</span><span class="token operator">=</span><span class="token operator">&lt;</span>url-encoded-url<span class="token operator">></span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>E.g.,</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>https://pipedream.com/sources?action<span class="token operator">=</span>create<span class="token operator">&amp;</span><span class="token assign-left variable">url</span><span class="token operator">=</span>https%3A%2F%2Fraw.githubusercontent.com%2FPipedreamHQ%2Fpipedream%2Fmaster%2Fcomponents%2Fhttp%2Fhttp.js
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="ui-update" tabindex="-1"><a class="header-anchor" href="#ui-update" aria-hidden="true">#</a> UI - Update</h4>
<p>You can update the code and props for a component from the <strong>Configuration</strong> tab for a source in the Pipedream UI.</p>
<h4 id="ui-delete" tabindex="-1"><a class="header-anchor" href="#ui-delete" aria-hidden="true">#</a> UI - Delete</h4>
<p>You can delete a component via the UI at <a href="https://pipedream.com/sources" target="_blank" rel="noopener noreferrer">https://pipedream.com/sources<ExternalLinkIcon/></a>.</p>
<h4 id="api" tabindex="-1"><a class="header-anchor" href="#api" aria-hidden="true">#</a> API</h4>
<p>See the <a href="/api/rest/#operations" target="_blank" rel="noopener noreferrer">REST API docs<ExternalLinkIcon/></a>.</p>
<h3 id="managing-actions" tabindex="-1"><a class="header-anchor" href="#managing-actions" aria-hidden="true">#</a> Managing Actions</h3>
<h4 id="cli-publish" tabindex="-1"><a class="header-anchor" href="#cli-publish" aria-hidden="true">#</a> CLI - Publish</h4>
<p>To publish an action, use the <code>pd publish</code> command.</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pd publish <span class="token operator">&lt;</span>filename<span class="token operator">></span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>E.g.,</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pd publish my-action.js
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h2 id="source-lifecycle" tabindex="-1"><a class="header-anchor" href="#source-lifecycle" aria-hidden="true">#</a> Source Lifecycle</h2>
<h3 id="lifecycle-hooks" tabindex="-1"><a class="header-anchor" href="#lifecycle-hooks" aria-hidden="true">#</a> Lifecycle hooks</h3>
<p>Pipedream sources support the following hooks. The code for these hooks are defined within the component. Learn more about the <a href="#component-structure">component structure</a> and <a href="#hooks">hook usage</a>.</p>
<h4 id="deploy" tabindex="-1"><a class="header-anchor" href="#deploy" aria-hidden="true">#</a> <code>deploy</code></h4>
<p>The <code>deploy()</code> hook is automatically invoked by Pipedream when a source is deployed. A common use case for the deploy hook is to create webhook subscriptions when the source is deployed, but you can run any Node.js code within the <code>deploy</code> hook. To learn more about the <code>deploy()</code> hook, refer to the <a href="#hooks">API documentation</a>.</p>
<h4 id="activate" tabindex="-1"><a class="header-anchor" href="#activate" aria-hidden="true">#</a> <code>activate</code></h4>
<p>The <code>activate()</code> hook is automatically invoked by Pipedream when a source is deployed or updated. For example, this hook will be run when users update component props, so you can run code here that handles those changes. To learn more about defining a custom <code>activate()</code> hook, refer to the <a href="#hooks">API documentation</a>.</p>
<h4 id="deactivate" tabindex="-1"><a class="header-anchor" href="#deactivate" aria-hidden="true">#</a> <code>deactivate</code></h4>
<p>The <code>deactivate()</code> hook is automatically invoked by Pipedream when a source is updated or deleted. A common use case for the deactivate hook is to automatically delete a webhook subscription when a component is deleted, but you can run any Node.js code within the <code>deactivate</code> hook. To learn more about the <code>deactivate()</code> hook, refer to the <a href="#hooks">API documentation</a>.</p>
<h3 id="states" tabindex="-1"><a class="header-anchor" href="#states" aria-hidden="true">#</a> States</h3>
<h4 id="saved-component" tabindex="-1"><a class="header-anchor" href="#saved-component" aria-hidden="true">#</a> Saved Component</h4>
<p>A saved component is non-instantiated component code that has previously been deployed to Pipedream. Each saved component has a unique saved component ID. Saved components cannot be invoked directly — they must first be deployed.</p>
<h4 id="deployed-component" tabindex="-1"><a class="header-anchor" href="#deployed-component" aria-hidden="true">#</a> Deployed Component</h4>
<p>A deployed component is an instance of a saved component that can be invoked. Deployed components can be active or inactive. On deploy, Pipedream instantiates a saved component and invokes the <code>activate()</code> hook.</p>
<h4 id="deleted-component" tabindex="-1"><a class="header-anchor" href="#deleted-component" aria-hidden="true">#</a> Deleted Component</h4>
<p>On delete, Pipedream invokes the <code>deactivate()</code> hook and then deletes the deployed component instance.</p>
<h3 id="operations" tabindex="-1"><a class="header-anchor" href="#operations" aria-hidden="true">#</a> Operations</h3>
<h4 id="deploy-1" tabindex="-1"><a class="header-anchor" href="#deploy-1" aria-hidden="true">#</a> Deploy</h4>
<p>On deploy, Pipedream creates an instance of a saved component and invokes the optional <code>deploy()</code> and <code>activate()</code> hooks. A unique deployed component ID is generated for the component.</p>
<p>You can deploy a component via the <a href="#management">CLI, UI or API</a>.</p>
<h4 id="update" tabindex="-1"><a class="header-anchor" href="#update" aria-hidden="true">#</a> Update</h4>
<p>On update, Pipedream, invokes the optional <code>deactivate()</code> hook, updates the code and props for a deployed component, and then invokes the optional <code>activate()</code> hook. The deployed component ID is not changed by an update operation.</p>
<h4 id="delete" tabindex="-1"><a class="header-anchor" href="#delete" aria-hidden="true">#</a> Delete</h4>
<p>On delete, Pipedream invokes the optional <code>deactivate()</code> hook and deletes the component instance.</p>
<h2 id="source-event-lifecycle" tabindex="-1"><a class="header-anchor" href="#source-event-lifecycle" aria-hidden="true">#</a> Source Event Lifecycle</h2>
<p>The event lifecycle applies to deployed sources. Learn about the <a href="#source-lifecycle">source lifecycle</a>.</p>
<h3 id="diagram" tabindex="-1"><a class="header-anchor" href="#diagram" aria-hidden="true">#</a> Diagram</h3>
<p><img src="@source/components/api/images/image-20200819210516311.png" alt="image-20200819210516311"></p>
<h3 id="triggering-sources" tabindex="-1"><a class="header-anchor" href="#triggering-sources" aria-hidden="true">#</a> Triggering Sources</h3>
<p>Sources are triggered when you manually run them (e.g., via the <strong>RUN NOW</strong> button in the UI) or when one of their <a href="#interface-props">interfaces</a> is triggered. Pipedream sources currently support <strong>HTTP</strong> and <strong>Timer</strong> interfaces.</p>
<p>When a source is triggered, the <code>run()</code> method of the component is executed. Standard output and errors are surfaced in the <strong>Logs</strong> tab.</p>
<h3 id="emitting-events-from-sources" tabindex="-1"><a class="header-anchor" href="#emitting-events-from-sources" aria-hidden="true">#</a> Emitting Events from Sources</h3>
<p>Sources can emit events via <code>this.$emit()</code>. If you define a <a href="#dedupe-strategies">dedupe strategy</a> for a source, Pipedream automatically dedupes the events you emit.</p>
<blockquote>
<p><strong>TIP:</strong> if you want to use a dedupe strategy, be sure to pass an <code>id</code> for each event. Pipedream uses this value for deduping purposes.</p>
</blockquote>
<h3 id="consuming-events-from-sources" tabindex="-1"><a class="header-anchor" href="#consuming-events-from-sources" aria-hidden="true">#</a> Consuming Events from Sources</h3>
<p>Pipedream makes it easy to consume events via:</p>
<ul>
<li>The UI</li>
<li>Workflows</li>
<li>APIs</li>
<li>CLI</li>
</ul>
<h4 id="ui" tabindex="-1"><a class="header-anchor" href="#ui" aria-hidden="true">#</a> UI</h4>
<p>When you navigate to your source <a href="https://pipedream.com/sources" target="_blank" rel="noopener noreferrer">in the UI<ExternalLinkIcon/></a>, you'll be able to select and inspect the most recent 100 events (i.e., an event bin). For example, if you send requests to a simple HTTP source, you will be able to inspect the events (i.e., a request bin).</p>
<h4 id="workflows" tabindex="-1"><a class="header-anchor" href="#workflows" aria-hidden="true">#</a> Workflows</h4>
<p><a href="/workflows/" target="_blank" rel="noopener noreferrer">Trigger hosted Node.js workflows<ExternalLinkIcon/></a> on each event. Integrate with 300+ apps including Google Sheets, Discord, Slack, AWS, and more!</p>
<h4 id="api-1" tabindex="-1"><a class="header-anchor" href="#api-1" aria-hidden="true">#</a> API</h4>
<p>Events can be retrieved using the <a href="/api/rest/" target="_blank" rel="noopener noreferrer">REST API<ExternalLinkIcon/></a> or <a href="/api/sse/" target="_blank" rel="noopener noreferrer">SSE stream tied to your component<ExternalLinkIcon/></a>. This makes it easy to retrieve data processed by your component from another app. Typically, you'll want to use the <a href="/api/rest/" target="_blank" rel="noopener noreferrer">REST API<ExternalLinkIcon/></a> to retrieve events in batch, and connect to the <a href="/api/sse/" target="_blank" rel="noopener noreferrer">SSE stream<ExternalLinkIcon/></a> to process them in real time.</p>
<h4 id="cli" tabindex="-1"><a class="header-anchor" href="#cli" aria-hidden="true">#</a> CLI</h4>
<p>Use the <code>pd events</code> command to retrieve the last 10 events via the CLI:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code>pd events -n <span class="token number">10</span> <span class="token operator">&lt;</span>source-name<span class="token operator">></span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div></template>
