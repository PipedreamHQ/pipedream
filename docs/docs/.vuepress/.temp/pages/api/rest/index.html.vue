<template><h1 id="rest-api" tabindex="-1"><a class="header-anchor" href="#rest-api" aria-hidden="true">#</a> REST API</h1>
<nav class="table-of-contents"><ul><li><RouterLink to="#overview">Overview</RouterLink></li><li><RouterLink to="#base-url">Base URL</RouterLink></li><li><RouterLink to="#authentication">Authentication</RouterLink></li><li><RouterLink to="#required-headers">Required headers</RouterLink></li><li><RouterLink to="#common-parameters">Common Parameters</RouterLink></li><li><RouterLink to="#working-with-resources-owned-by-an-organization">Working with resources owned by an organization</RouterLink></li><li><RouterLink to="#pagination">Pagination</RouterLink><ul><li><RouterLink to="#example-paginated-request">Example Paginated Request</RouterLink></li><li><RouterLink to="#example-paginated-response">Example Paginated Response</RouterLink></li></ul></li><li><RouterLink to="#errors">Errors</RouterLink></li><li><RouterLink to="#components">Components</RouterLink><ul><li><RouterLink to="#create-a-component">Create a component</RouterLink></li><li><RouterLink to="#get-a-component">Get a component</RouterLink></li><li><RouterLink to="#get-a-component-from-the-global-registry">Get a component from the global registry</RouterLink></li></ul></li><li><RouterLink to="#events">Events</RouterLink><ul><li><RouterLink to="#get-source-events">Get Source Events</RouterLink></li><li><RouterLink to="#delete-source-events">Delete source events</RouterLink></li></ul></li><li><RouterLink to="#organizations">Organizations</RouterLink><ul><li><RouterLink to="#get-org-s-subscriptions">Get Org&#39;s Subscriptions</RouterLink></li><li><RouterLink to="#get-org-s-sources">Get Org&#39;s Sources</RouterLink></li></ul></li><li><RouterLink to="#sources">Sources</RouterLink><ul><li><RouterLink to="#list-current-user-sources">List Current User Sources</RouterLink></li><li><RouterLink to="#create-a-source">Create a Source</RouterLink></li><li><RouterLink to="#update-a-source">Update a source</RouterLink></li><li><RouterLink to="#delete-a-source">Delete a source</RouterLink></li></ul></li><li><RouterLink to="#subscriptions">Subscriptions</RouterLink><ul><li><RouterLink to="#listen-for-events-from-another-source-or-workflow">Listen for events from another source or workflow</RouterLink></li><li><RouterLink to="#automatically-subscribe-a-listener-to-events-from-new-workflows-sources">Automatically subscribe a listener to events from new workflows / sources</RouterLink></li><li><RouterLink to="#delete-a-subscription">Delete a subscription</RouterLink></li></ul></li><li><RouterLink to="#webhooks">Webhooks</RouterLink><ul><li><RouterLink to="#create-a-webhook">Create a webhook</RouterLink></li><li><RouterLink to="#list-webhooks">List webhooks</RouterLink></li></ul></li><li><RouterLink to="#workflows">Workflows</RouterLink><ul><li><RouterLink to="#get-workflow-emits">Get Workflow Emits</RouterLink></li><li><RouterLink to="#get-workflow-errors">Get Workflow Errors</RouterLink></li></ul></li><li><RouterLink to="#users">Users</RouterLink><ul><li><RouterLink to="#get-current-user-info">Get Current User Info</RouterLink></li><li><RouterLink to="#get-current-user-s-subscriptions">Get Current User&#39;s Subscriptions</RouterLink></li><li><RouterLink to="#get-current-user-s-webhooks">Get Current User&#39;s Webhooks</RouterLink></li></ul></li></ul></nav>
<h2 id="overview" tabindex="-1"><a class="header-anchor" href="#overview" aria-hidden="true">#</a> Overview</h2>
<p>Use the REST API to create and manage sources, workflows and source events.
Workflow development and management is not currently supported via the API.</p>
<h2 id="base-url" tabindex="-1"><a class="header-anchor" href="#base-url" aria-hidden="true">#</a> Base URL</h2>
<p>The base URL for all requests is <strong>{{$site.themeConfig.API_BASE_URL}}</strong> .</p>
<h2 id="authentication" tabindex="-1"><a class="header-anchor" href="#authentication" aria-hidden="true">#</a> Authentication</h2>
<p>You authenticate to the REST API using your <a href="/api/auth/#pipedream-api-key" target="_blank" rel="noopener noreferrer">Pipedream API
key<ExternalLinkIcon/></a>. When you make API requests, pass an
<code>Authorization</code> header of the following format:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>Authorization: Bearer &lt;api key>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>For example, here's how you can use <code>cURL</code> to fetch profile information for the
authenticated user:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token string">'https://api.pipedream.com/v1/users/me'</span> <span class="token punctuation">\</span>
  -H <span class="token string">'Authorization: Bearer &lt;api_key>'</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>Learn more about <a href="/api/auth" target="_blank" rel="noopener noreferrer">API authentication<ExternalLinkIcon/></a></p>
<h2 id="required-headers" tabindex="-1"><a class="header-anchor" href="#required-headers" aria-hidden="true">#</a> Required headers</h2>
<p>The <code>Authorization</code> header is required on all endpoints for authentication.</p>
<p><code>POST</code> or <code>PUT</code> requests that accept JSON payloads also require a <code>Content-Type</code>
header set to <code>application/json</code>. For example:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> https://api.pipedream.com/v1/components <span class="token punctuation">\</span>
  -H <span class="token string">"Authorization: Bearer &lt;api_key>"</span> <span class="token punctuation">\</span>
  -H <span class="token string">"Content-Type: application/json"</span> <span class="token punctuation">\</span>
  -d <span class="token string">'{"component_url": "https://github.com/PipedreamHQ/pipedream/blob/master/components/rss/sources/new-item-in-feed/new-item-in-feed.js"}'</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h2 id="common-parameters" tabindex="-1"><a class="header-anchor" href="#common-parameters" aria-hidden="true">#</a> Common Parameters</h2>
<p>The following parameters can be passed to any endpoint. They can be included as
query string params for <code>GET</code> requests, or in the body of the payload of <code>POST</code>
requests.</p>
<hr>
<p><code>include</code> <strong>string</strong></p>
<p>The fields in the API response you'd like to include (defaults to all fields).
Pass as a string of comma-separated values:</p>
<p><code>comma,separated,fields,to,include</code></p>
<hr>
<p><code>exclude</code> <strong>string</strong></p>
<p>The fields in the API response you'd like to <em>exclude</em> (defaults to none,
including all fields). Pass as a string of comma-separated values:</p>
<p><code>comma,separated,fields,to,include</code></p>
<hr>
<p><code>org_id</code> <strong>string</strong></p>
<p>Some endpoints require you to specify <a href="/orgs/#finding-your-organization-s-id" target="_blank" rel="noopener noreferrer">the org ID<ExternalLinkIcon/></a> you want the operation to take effect in. For example, if you're creating a new event source in a specific org, you'll want to pass the org ID in the <code>org_id</code> query string parameter.</p>
<p><a href="/orgs/#finding-your-organization-s-id" target="_blank" rel="noopener noreferrer">Find your org's ID here<ExternalLinkIcon/></a>.</p>
<h2 id="working-with-resources-owned-by-an-organization" tabindex="-1"><a class="header-anchor" href="#working-with-resources-owned-by-an-organization" aria-hidden="true">#</a> Working with resources owned by an organization</h2>
<p>If you're interacting with resources owned by an <a href="/orgs/" target="_blank" rel="noopener noreferrer">organization<ExternalLinkIcon/></a>, you may need to specify the org ID as a part of the request's query string parameter or route:</p>
<ul>
<li>When fetching specific resources (for example, when you <a href="#get-source-events">retrieve events for a specific source</a>), you should not need to pass your org's ID. If your user is a part of the org, you should have access to that resource, and the API will return the details of the resource.</li>
<li>When <em>creating</em> new resources, you'll need to specify the <code>org_id</code> where you want the resource to live as a query string parameter (<code>?org_id=o_abc123</code>). Read more about the <code>org_id</code> parameter in the <a href="#common-parameters">Common Parameters section</a>.</li>
<li>When <em>listing</em> resources, use <a href="#organizations">the org-specific endpoints here</a>.</li>
</ul>
<h2 id="pagination" tabindex="-1"><a class="header-anchor" href="#pagination" aria-hidden="true">#</a> Pagination</h2>
<p>Most API endpoints below support pagination, <strong>with a default page size of 10
items</strong>. You can vary the size of pages, and set a <code>before</code> or <code>after</code> cursor on
the results, using the following parameters. They can be included as query
string params for <code>GET</code> requests, or in the body of the payload of <code>POST</code>
requests.</p>
<hr>
<p><code>limit</code> <strong>integer</strong></p>
<p>The number of items to return in the requested page of results.</p>
<ul>
<li>Default: 10</li>
<li>Min: 1</li>
<li>Max: 100</li>
</ul>
<hr>
<p><code>after</code> <strong>string</strong></p>
<p>A cursor, specifying you'd like to retrieve items <em>after</em> this cursor.</p>
<p>Cursor strings are returned with all paginated responses.</p>
<hr>
<p><code>before</code> <strong>string</strong></p>
<p>A cursor, specifying you'd like to retrieve items <em>before</em> this cursor.</p>
<p>Cursor strings are returned with all paginated responses.</p>
<hr>
<h3 id="example-paginated-request" tabindex="-1"><a class="header-anchor" href="#example-paginated-request" aria-hidden="true">#</a> Example Paginated Request</h3>
<p>This request fetches a page of 5 sources in the authenticated account, after a
specific cursor (returned with a previous request):</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> https://api.pipedream.com/v1/users/me/sources<span class="token punctuation">\</span>?limit<span class="token punctuation">\</span><span class="token operator">=</span><span class="token number">3</span><span class="token punctuation">\</span><span class="token operator">&amp;</span>after<span class="token punctuation">\</span><span class="token operator">=</span>ZGNfSzB1QWVl <span class="token punctuation">\</span>
  -H <span class="token string">"Authorization: Bearer &lt;api key>"</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h3 id="example-paginated-response" tabindex="-1"><a class="header-anchor" href="#example-paginated-response" aria-hidden="true">#</a> Example Paginated Response</h3>
<p>The response from the request above will have a shape that looks like:</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"page_info"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"total_count"</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>
    <span class="token property">"count"</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>
    <span class="token property">"start_cursor"</span><span class="token operator">:</span> <span class="token string">"ZGNfSzB1QWVl"</span><span class="token punctuation">,</span>
    <span class="token property">"end_cursor"</span><span class="token operator">:</span> <span class="token string">"ZGNfclhhdTZv"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"dc_5YGuMo"</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
      <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"dc_5v3unr"</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
      <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"dc_rXau6o"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><h2 id="errors" tabindex="-1"><a class="header-anchor" href="#errors" aria-hidden="true">#</a> Errors</h2>
<p>Pipedream uses conventional HTTP response codes to indicate the success or
failure of an API request. Codes in the <strong>2xx</strong> range indicate success. Codes in
the <strong>4xx</strong> range indicate an error that failed (e.g., a required parameter was
omitted). Codes in the <strong>5xx</strong> range indicate an error with Pipedream’s server.</p>
<h2 id="components" tabindex="-1"><a class="header-anchor" href="#components" aria-hidden="true">#</a> Components</h2>
<p>Components are objects that represent the code for an <a href="#sources">event source</a>.</p>
<h3 id="create-a-component" tabindex="-1"><a class="header-anchor" href="#create-a-component" aria-hidden="true">#</a> Create a component</h3>
<hr>
<p>Before you can create a source using the REST API, you must first create a
<strong>component</strong> - the code for the source.</p>
<p>This route returns the components <code>id</code>, <code>code</code>, <code>configurable_props</code>, and other
metadata you'll need to <a href="#create-a-source">deploy a source</a> from this component.</p>
<h4 id="endpoint" tabindex="-1"><a class="header-anchor" href="#endpoint" aria-hidden="true">#</a> Endpoint</h4>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>POST /components
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="parameters" tabindex="-1"><a class="header-anchor" href="#parameters" aria-hidden="true">#</a> Parameters</h4>
<hr>
<p><code>component_code</code> <strong>string</strong> (<em>optional</em>)</p>
<p>The full code for a <a href="/components/api/" target="_blank" rel="noopener noreferrer">Pipedream component<ExternalLinkIcon/></a>.</p>
<hr>
<p><code>component_url</code> <strong>string</strong> (<em>optional</em>)</p>
<p>A reference to the URL where the component is hosted.</p>
<p>For example, to create an RSS component, pass
<code>https://github.com/PipedreamHQ/pipedream/blob/master/components/rss/sources/new-item-in-feed/new-item-in-feed.js</code>.</p>
<hr>
<p>One of <code>component_code</code> <em>or</em> <code>component_url</code> is required. If both are present,
<code>component_code</code> is preferred and <code>component_url</code> will be used only as metadata
to identify the location of the code.</p>
<h4 id="example-request" tabindex="-1"><a class="header-anchor" href="#example-request" aria-hidden="true">#</a> Example Request</h4>
<p>Here's an example of how to create an RSS component from a Github URL:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> https://api.pipedream.com/v1/components <span class="token punctuation">\</span>
  -H <span class="token string">"Authorization: Bearer &lt;api_key>"</span> <span class="token punctuation">\</span>
  -H <span class="token string">"Content-Type: application/json"</span> <span class="token punctuation">\</span>
  -d <span class="token string">'{"component_url": "https://github.com/PipedreamHQ/pipedream/blob/master/components/rss/sources/new-item-in-feed/new-item-in-feed.js"}'</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h4 id="example-response" tabindex="-1"><a class="header-anchor" href="#example-response" aria-hidden="true">#</a> Example Response</h4>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"sc_JDi8EB"</span><span class="token punctuation">,</span>
    <span class="token property">"code"</span><span class="token operator">:</span> <span class="token string">"component code here"</span><span class="token punctuation">,</span>
    <span class="token property">"code_hash"</span><span class="token operator">:</span> <span class="token string">"685c7a680d055eaf505b08d5d814feef9fabd516d5960837d2e0838d3e1c9ed1"</span><span class="token punctuation">,</span>
    <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"rss"</span><span class="token punctuation">,</span>
    <span class="token property">"version"</span><span class="token operator">:</span> <span class="token string">"0.0.1"</span><span class="token punctuation">,</span>
    <span class="token property">"configurable_props"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"url"</span><span class="token punctuation">,</span>
        <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"string"</span><span class="token punctuation">,</span>
        <span class="token property">"label"</span><span class="token operator">:</span> <span class="token string">"Feed URL"</span><span class="token punctuation">,</span>
        <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"Enter the URL for any public RSS feed."</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"timer"</span><span class="token punctuation">,</span>
        <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"$.interface.timer"</span><span class="token punctuation">,</span>
        <span class="token property">"default"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token property">"intervalSeconds"</span><span class="token operator">:</span> <span class="token number">900</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">"created_at"</span><span class="token operator">:</span> <span class="token number">1588866900</span><span class="token punctuation">,</span>
    <span class="token property">"updated_at"</span><span class="token operator">:</span> <span class="token number">1588866900</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br></div></div><h3 id="get-a-component" tabindex="-1"><a class="header-anchor" href="#get-a-component" aria-hidden="true">#</a> Get a component</h3>
<p>Retrieve a component saved or published in your account using its saved
component ID <strong>or</strong> key.</p>
<p>This endpoint returns the component's metadata and configurable props.</p>
<h4 id="endpoint-1" tabindex="-1"><a class="header-anchor" href="#endpoint-1" aria-hidden="true">#</a> Endpoint</h4>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>GET /components/{key|id}
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="parameters-1" tabindex="-1"><a class="header-anchor" href="#parameters-1" aria-hidden="true">#</a> Parameters</h4>
<hr>
<p><code>key</code> <strong>string</strong></p>
<p>The component key (identified by the <code>key</code> property within the component's
source code) you'd like to fetch metadata for (example: <code>my-component</code>)</p>
<p><strong>or</strong></p>
<p><code>id</code> <strong>string</strong></p>
<p>The saved component ID you'd like to fetch metadata for (example: <code>sc_JDi8EB</code>)</p>
<hr>
<h4 id="example-request-1" tabindex="-1"><a class="header-anchor" href="#example-request-1" aria-hidden="true">#</a> Example Request</h4>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> https://api.pipedream.com/v1/components/my-component <span class="token punctuation">\</span>
  -H <span class="token string">"Authorization: Bearer &lt;api_key>"</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h4 id="example-response-1" tabindex="-1"><a class="header-anchor" href="#example-response-1" aria-hidden="true">#</a> Example Response</h4>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"sc_JDi8EB"</span><span class="token punctuation">,</span>
    <span class="token property">"code"</span><span class="token operator">:</span> <span class="token string">"component code here"</span><span class="token punctuation">,</span>
    <span class="token property">"code_hash"</span><span class="token operator">:</span> <span class="token string">"685c7a680d055eaf505b08d5d814feef9fabd516d5960837d2e0838d3e1c9ed1"</span><span class="token punctuation">,</span>
    <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"rss"</span><span class="token punctuation">,</span>
    <span class="token property">"version"</span><span class="token operator">:</span> <span class="token string">"0.0.1"</span><span class="token punctuation">,</span>
    <span class="token property">"configurable_props"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"url"</span><span class="token punctuation">,</span>
        <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"string"</span><span class="token punctuation">,</span>
        <span class="token property">"label"</span><span class="token operator">:</span> <span class="token string">"Feed URL"</span><span class="token punctuation">,</span>
        <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"Enter the URL for any public RSS feed."</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"timer"</span><span class="token punctuation">,</span>
        <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"$.interface.timer"</span><span class="token punctuation">,</span>
        <span class="token property">"default"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token property">"intervalSeconds"</span><span class="token operator">:</span> <span class="token number">900</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">"created_at"</span><span class="token operator">:</span> <span class="token number">1588866900</span><span class="token punctuation">,</span>
    <span class="token property">"updated_at"</span><span class="token operator">:</span> <span class="token number">1588866900</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br></div></div><h3 id="get-a-component-from-the-global-registry" tabindex="-1"><a class="header-anchor" href="#get-a-component-from-the-global-registry" aria-hidden="true">#</a> Get a component from the global registry</h3>
<p>Pipedream operates a global registry of all public components (for example, for
apps like Github, Google Calendar, and more). This endpoint returns the same
data as the endpoint for <a href="#get-a-component">retrieving metadata on a component you
own</a>, but allows you to fetch data for any globally-published
component.</p>
<h4 id="endpoint-2" tabindex="-1"><a class="header-anchor" href="#endpoint-2" aria-hidden="true">#</a> Endpoint</h4>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>GET /components/registry/{key}
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="parameters-2" tabindex="-1"><a class="header-anchor" href="#parameters-2" aria-hidden="true">#</a> Parameters</h4>
<hr>
<p><code>key</code> <strong>string</strong></p>
<p>The component key (identified by the <code>key</code> property within the component's
source code) you'd like to fetch metadata for (example: <code>my-component</code>)</p>
<hr>
<h4 id="example-request-2" tabindex="-1"><a class="header-anchor" href="#example-request-2" aria-hidden="true">#</a> Example Request</h4>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> https://api.pipedream.com/v1/components/registry/github-new-repository <span class="token punctuation">\</span>
  -H <span class="token string">"Authorization: Bearer &lt;api_key>"</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h4 id="example-response-2" tabindex="-1"><a class="header-anchor" href="#example-response-2" aria-hidden="true">#</a> Example Response</h4>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"sc_JDi8EB"</span><span class="token punctuation">,</span>
    <span class="token property">"code"</span><span class="token operator">:</span> <span class="token string">"component code here"</span><span class="token punctuation">,</span>
    <span class="token property">"code_hash"</span><span class="token operator">:</span> <span class="token string">"685c7a680d055eaf505b08d5d814feef9fabd516d5960837d2e0838d3e1c9ed1"</span><span class="token punctuation">,</span>
    <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"rss"</span><span class="token punctuation">,</span>
    <span class="token property">"version"</span><span class="token operator">:</span> <span class="token string">"0.0.1"</span><span class="token punctuation">,</span>
    <span class="token property">"configurable_props"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"url"</span><span class="token punctuation">,</span>
        <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"string"</span><span class="token punctuation">,</span>
        <span class="token property">"label"</span><span class="token operator">:</span> <span class="token string">"Feed URL"</span><span class="token punctuation">,</span>
        <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"Enter the URL for any public RSS feed."</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token punctuation">{</span>
        <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"timer"</span><span class="token punctuation">,</span>
        <span class="token property">"type"</span><span class="token operator">:</span> <span class="token string">"$.interface.timer"</span><span class="token punctuation">,</span>
        <span class="token property">"default"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token property">"intervalSeconds"</span><span class="token operator">:</span> <span class="token number">900</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">"created_at"</span><span class="token operator">:</span> <span class="token number">1588866900</span><span class="token punctuation">,</span>
    <span class="token property">"updated_at"</span><span class="token operator">:</span> <span class="token number">1588866900</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br></div></div><h2 id="events" tabindex="-1"><a class="header-anchor" href="#events" aria-hidden="true">#</a> Events</h2>
<h3 id="get-source-events" tabindex="-1"><a class="header-anchor" href="#get-source-events" aria-hidden="true">#</a> Get Source Events</h3>
<hr>
<p>Retrieve up to the last 100 events emitted by a source.</p>
<h4 id="endpoint-3" tabindex="-1"><a class="header-anchor" href="#endpoint-3" aria-hidden="true">#</a> Endpoint</h4>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>GET /sources/{id}/event_summaries
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="notes-and-examples" tabindex="-1"><a class="header-anchor" href="#notes-and-examples" aria-hidden="true">#</a> Notes and Examples</h4>
<p>The event data for events larger than <code>1KB</code> may get truncated in the response.
If you're processing larger events, and need to see the full event data, pass
<code>?expand=event</code>:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>GET /sources/{id}/event_summaries?expand=event
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>Pass <code>?limit=N</code> to retrieve the last <strong>N</strong> events:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>GET /sources/{id}/event_summaries?limit=10
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h3 id="delete-source-events" tabindex="-1"><a class="header-anchor" href="#delete-source-events" aria-hidden="true">#</a> Delete source events</h3>
<hr>
<p>Deletes all events, or a specific set of events, tied to a source.</p>
<p>By default, making a <code>DELETE</code> request to this endpoint deletes <strong>all</strong> events
associated with a source. To delete a specific event, or a range of events, you
can use the <code>start_id</code> and <code>end_id</code> parameters.</p>
<p>These IDs can be retrieved by using the <a href="/api/rest/#get-source-events" target="_blank" rel="noopener noreferrer"><code>GET /sources/{id}/event_summaries</code>
endpoint<ExternalLinkIcon/></a>, and are tied to the timestamp at which
the event was emitted — e.g. <code>1589486981597-0</code>. They are therefore naturally
ordered by time.</p>
<h4 id="endpoint-4" tabindex="-1"><a class="header-anchor" href="#endpoint-4" aria-hidden="true">#</a> Endpoint</h4>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>DELETE /sources/{id}/events
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="parameters-3" tabindex="-1"><a class="header-anchor" href="#parameters-3" aria-hidden="true">#</a> Parameters</h4>
<hr>
<p><code>start_id</code> <strong>string</strong></p>
<p>The event ID from which you'd like to start deleting events.</p>
<p>If <code>start_id</code> is passed without <code>end_id</code>, the request will delete all events
starting with and including this event ID. For example, if your source has 3
events:</p>
<ul>
<li><code>1589486981597-0</code></li>
<li><code>1589486981598-0</code></li>
<li><code>1589486981599-0</code></li>
</ul>
<p>and you issue a <code>DELETE</code> request like so:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> -X DELETE <span class="token punctuation">\</span>
  -H <span class="token string">"Authorization: Bearer &lt;api key>"</span> <span class="token punctuation">\</span>
  <span class="token string">"https://api.pipedream.com/v1/sources/dc_abc123/events?start_id=1589486981598-0"</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>The request will delete the <strong>last two events</strong>.</p>
<hr>
<p><code>end_id</code> <strong>string</strong></p>
<p>The event ID from which you'd like to end the range of deletion.</p>
<p>If <code>end_id</code> is passed without <code>start_id</code>, the request will delete all events up
to and including this event ID. For example, if your source has 3 events:</p>
<ul>
<li><code>1589486981597-0</code></li>
<li><code>1589486981598-0</code></li>
<li><code>1589486981599-0</code></li>
</ul>
<p>and you issue a <code>DELETE</code> request like so:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> -X DELETE <span class="token punctuation">\</span>
  -H <span class="token string">"Authorization: Bearer &lt;api key>"</span> <span class="token punctuation">\</span>
  <span class="token string">"https://api.pipedream.com/v1/sources/dc_abc123/events?end_id=1589486981598-0"</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>The request will delete the <strong>first two events</strong>.</p>
<hr>
<h4 id="example-request-3" tabindex="-1"><a class="header-anchor" href="#example-request-3" aria-hidden="true">#</a> Example Request</h4>
<p>You can delete a single event by passing its event ID in both the value of the
<code>start_id</code> and <code>end_id</code> params:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> -X DELETE <span class="token punctuation">\</span>
  -H <span class="token string">"Authorization: Bearer &lt;api key>"</span> <span class="token punctuation">\</span>
  <span class="token string">"https://api.pipedream.com/v1/sources/dc_abc123/events?start_id=1589486981598-0&amp;end_id=1589486981598-0"</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><h4 id="example-response-3" tabindex="-1"><a class="header-anchor" href="#example-response-3" aria-hidden="true">#</a> Example Response</h4>
<p>Deletion happens asynchronously, so you'll receive a <code>202 Accepted</code> HTTP status
code in response to any deletion requests.</p>
<h2 id="organizations" tabindex="-1"><a class="header-anchor" href="#organizations" aria-hidden="true">#</a> Organizations</h2>
<p><a href="/orgs/" target="_blank" rel="noopener noreferrer">Organizations<ExternalLinkIcon/></a> provide your team a way to manage resources in a shared workspace. Any resources created by the org are owned by the org and accessible to its members.</p>
<h3 id="get-org-s-subscriptions" tabindex="-1"><a class="header-anchor" href="#get-org-s-subscriptions" aria-hidden="true">#</a> Get Org's Subscriptions</h3>
<hr>
<p>Retrieve all the <a href="#subscriptions">subscriptions</a> configured for a specific organization.</p>
<h4 id="endpoint-5" tabindex="-1"><a class="header-anchor" href="#endpoint-5" aria-hidden="true">#</a> Endpoint</h4>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>GET /orgs/&lt;org_id>/subscriptions
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="path-parameters" tabindex="-1"><a class="header-anchor" href="#path-parameters" aria-hidden="true">#</a> Path Parameters</h4>
<p><code>org_id</code> <strong>string</strong></p>
<p><a href="/docs/orgs/#switching-context" target="_blank" rel="noopener noreferrer">Switch to your org's context<ExternalLinkIcon/></a> and <a href="/orgs/#finding-your-organization-s-id" target="_blank" rel="noopener noreferrer">find your org's ID<ExternalLinkIcon/></a>.</p>
<h4 id="example-request-4" tabindex="-1"><a class="header-anchor" href="#example-request-4" aria-hidden="true">#</a> Example Request</h4>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token string">'https://api.pipedream.com/v1/orgs/o_abc123/subscriptions'</span> <span class="token punctuation">\</span>
  -H <span class="token string">'Authorization: Bearer &lt;api_key>'</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h4 id="example-response-4" tabindex="-1"><a class="header-anchor" href="#example-response-4" aria-hidden="true">#</a> Example Response</h4>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"sub_abc123"</span><span class="token punctuation">,</span>
      <span class="token property">"emitter_id"</span><span class="token operator">:</span> <span class="token string">"dc_abc123"</span><span class="token punctuation">,</span>
      <span class="token property">"listener_id"</span><span class="token operator">:</span> <span class="token string">"p_abc123"</span><span class="token punctuation">,</span>
      <span class="token property">"event_name"</span><span class="token operator">:</span> <span class="token string">""</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
      <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"sub_def456"</span><span class="token punctuation">,</span>
      <span class="token property">"emitter_id"</span><span class="token operator">:</span> <span class="token string">"dc_def456"</span><span class="token punctuation">,</span>
      <span class="token property">"listener_id"</span><span class="token operator">:</span> <span class="token string">"p_def456"</span><span class="token punctuation">,</span>
      <span class="token property">"event_name"</span><span class="token operator">:</span> <span class="token string">""</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><h3 id="get-org-s-sources" tabindex="-1"><a class="header-anchor" href="#get-org-s-sources" aria-hidden="true">#</a> Get Org's Sources</h3>
<hr>
<p>Retrieve all the <a href="#sources">event sources</a> configured for a specific organization.</p>
<h4 id="endpoint-6" tabindex="-1"><a class="header-anchor" href="#endpoint-6" aria-hidden="true">#</a> Endpoint</h4>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>GET /orgs/&lt;org_id>/sources
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="path-parameters-1" tabindex="-1"><a class="header-anchor" href="#path-parameters-1" aria-hidden="true">#</a> Path Parameters</h4>
<p><code>org_id</code> <strong>string</strong></p>
<p><a href="/docs/orgs/#switching-context" target="_blank" rel="noopener noreferrer">Switch to your org's context<ExternalLinkIcon/></a> and <a href="/orgs/#finding-your-organization-s-id" target="_blank" rel="noopener noreferrer">find your org's ID<ExternalLinkIcon/></a>.</p>
<h4 id="example-request-5" tabindex="-1"><a class="header-anchor" href="#example-request-5" aria-hidden="true">#</a> Example Request</h4>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token string">'https://api.pipedream.com/v1/orgs/o_abc123/sources'</span> <span class="token punctuation">\</span>
  -H <span class="token string">'Authorization: Bearer &lt;api_key>'</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h4 id="example-response-5" tabindex="-1"><a class="header-anchor" href="#example-response-5" aria-hidden="true">#</a> Example Response</h4>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"page_info"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"total_count"</span><span class="token operator">:</span> <span class="token number">19</span><span class="token punctuation">,</span>
    <span class="token property">"count"</span><span class="token operator">:</span> <span class="token number">10</span><span class="token punctuation">,</span>
    <span class="token property">"start_cursor"</span><span class="token operator">:</span> <span class="token string">"ZGNfSzB1QWVl"</span><span class="token punctuation">,</span>
    <span class="token property">"end_cursor"</span><span class="token operator">:</span> <span class="token string">"ZGNfeUx1alJx"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"dc_abc123"</span><span class="token punctuation">,</span>
      <span class="token property">"component_id"</span><span class="token operator">:</span> <span class="token string">"sc_def456"</span><span class="token punctuation">,</span>
      <span class="token property">"configured_props"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">"http"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token property">"endpoint_url"</span><span class="token operator">:</span> <span class="token string">"https://myendpoint.m.pipedream.net"</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token property">"active"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token property">"created_at"</span><span class="token operator">:</span> <span class="token number">1587679599</span><span class="token punctuation">,</span>
      <span class="token property">"updated_at"</span><span class="token operator">:</span> <span class="token number">1587764467</span><span class="token punctuation">,</span>
      <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"test"</span><span class="token punctuation">,</span>
      <span class="token property">"name_slug"</span><span class="token operator">:</span> <span class="token string">"test"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br></div></div><h2 id="sources" tabindex="-1"><a class="header-anchor" href="#sources" aria-hidden="true">#</a> Sources</h2>
<p>Event sources run code to collect events from an API, or receive events via
webhooks, emitting those events for use on Pipedream. Event sources can function
as workflow triggers. <a href="/event-sources/" target="_blank" rel="noopener noreferrer">Read more here<ExternalLinkIcon/></a>.</p>
<h3 id="list-current-user-sources" tabindex="-1"><a class="header-anchor" href="#list-current-user-sources" aria-hidden="true">#</a> List Current User Sources</h3>
<hr>
<h4 id="endpoint-7" tabindex="-1"><a class="header-anchor" href="#endpoint-7" aria-hidden="true">#</a> Endpoint</h4>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>GET /users/me/sources/
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="parameters-4" tabindex="-1"><a class="header-anchor" href="#parameters-4" aria-hidden="true">#</a> Parameters</h4>
<p><em>No parameters</em></p>
<h4 id="example-request-6" tabindex="-1"><a class="header-anchor" href="#example-request-6" aria-hidden="true">#</a> Example Request</h4>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token string">'https://api.pipedream.com/v1/users/me/sources'</span> <span class="token punctuation">\</span>
  -H <span class="token string">'Authorization: Bearer &lt;api_key>'</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h4 id="example-response-6" tabindex="-1"><a class="header-anchor" href="#example-response-6" aria-hidden="true">#</a> Example Response</h4>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"page_info"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"total_count"</span><span class="token operator">:</span> <span class="token number">19</span><span class="token punctuation">,</span>
    <span class="token property">"count"</span><span class="token operator">:</span> <span class="token number">10</span><span class="token punctuation">,</span>
    <span class="token property">"start_cursor"</span><span class="token operator">:</span> <span class="token string">"ZGNfSzB1QWVl"</span><span class="token punctuation">,</span>
    <span class="token property">"end_cursor"</span><span class="token operator">:</span> <span class="token string">"ZGNfeUx1alJx"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"dc_abc123"</span><span class="token punctuation">,</span>
      <span class="token property">"component_id"</span><span class="token operator">:</span> <span class="token string">"sc_def456"</span><span class="token punctuation">,</span>
      <span class="token property">"configured_props"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">"http"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token property">"endpoint_url"</span><span class="token operator">:</span> <span class="token string">"https://myendpoint.m.pipedream.net"</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token property">"active"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token property">"created_at"</span><span class="token operator">:</span> <span class="token number">1587679599</span><span class="token punctuation">,</span>
      <span class="token property">"updated_at"</span><span class="token operator">:</span> <span class="token number">1587764467</span><span class="token punctuation">,</span>
      <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"test"</span><span class="token punctuation">,</span>
      <span class="token property">"name_slug"</span><span class="token operator">:</span> <span class="token string">"test"</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br></div></div><h3 id="create-a-source" tabindex="-1"><a class="header-anchor" href="#create-a-source" aria-hidden="true">#</a> Create a Source</h3>
<hr>
<h4 id="endpoint-8" tabindex="-1"><a class="header-anchor" href="#endpoint-8" aria-hidden="true">#</a> Endpoint</h4>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>POST /sources/
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="parameters-5" tabindex="-1"><a class="header-anchor" href="#parameters-5" aria-hidden="true">#</a> Parameters</h4>
<hr>
<p><code>component_id</code> <strong>string</strong> (<em>optional</em>)</p>
<p>The ID of a component previously created in your account. <a href="/api/rest/#components" target="_blank" rel="noopener noreferrer">See the component
endpoints<ExternalLinkIcon/></a> for information on how to retrieve this ID.</p>
<hr>
<p><code>component_code</code> <strong>string</strong> (<em>optional</em>)</p>
<p>The full code for a <a href="/components/api/" target="_blank" rel="noopener noreferrer">Pipedream component<ExternalLinkIcon/></a>.</p>
<hr>
<p><code>component_url</code> <strong>string</strong> (<em>optional</em>)</p>
<p>A reference to the URL where the component is hosted.</p>
<p>For example, to create an RSS component, pass
<code>https://github.com/PipedreamHQ/pipedream/blob/master/components/rss/sources/new-item-in-feed/new-item-in-feed.js</code>.</p>
<hr>
<p>One of <code>component_id</code>, <code>component_code</code>, or <code>component_url</code> is required. If all
are present, <code>component_id</code> is preferred and <code>component_url</code> will be used only
as metadata to identify the location of the code.</p>
<hr>
<p><code>name</code> <strong>string</strong> (<em>optional</em>)</p>
<p>The name of the source.</p>
<p>If absent, this defaults to using the <a href="/components/api/#component-structure" target="_blank" rel="noopener noreferrer">name
slug<ExternalLinkIcon/></a>
of the component used to create the source.</p>
<h4 id="example-request-7" tabindex="-1"><a class="header-anchor" href="#example-request-7" aria-hidden="true">#</a> Example Request</h4>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> https://api.pipedream.com/v1/sources <span class="token punctuation">\</span>
  -H <span class="token string">"Authorization: Bearer &lt;api_key>"</span> <span class="token punctuation">\</span>
  -H <span class="token string">"Content-Type: application/json"</span> <span class="token punctuation">\</span>
  -d <span class="token string">'{"component_url": "https://github.com/PipedreamHQ/pipedream/blob/master/components/rss/sources/new-item-in-feed/new-item-in-feed.js", "name": "your-name-here", "configured_props": { "url": "https://rss.m.pipedream.net", "timer": { "intervalSeconds": 60 }}}'</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h4 id="example-response-7" tabindex="-1"><a class="header-anchor" href="#example-response-7" aria-hidden="true">#</a> Example Response</h4>
<p>Example response from creating an RSS source that runs once a minute:</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"dc_abc123"</span><span class="token punctuation">,</span>
    <span class="token property">"user_id"</span><span class="token operator">:</span> <span class="token string">"u_abc123"</span><span class="token punctuation">,</span>
    <span class="token property">"component_id"</span><span class="token operator">:</span> <span class="token string">"sc_abc123"</span><span class="token punctuation">,</span>
    <span class="token property">"configured_props"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token property">"url"</span><span class="token operator">:</span> <span class="token string">"https://rss.m.pipedream.net"</span><span class="token punctuation">,</span>
      <span class="token property">"timer"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">"cron"</span><span class="token operator">:</span> <span class="token null keyword">null</span><span class="token punctuation">,</span>
        <span class="token property">"interval_seconds"</span><span class="token operator">:</span> <span class="token number">60</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token property">"active"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">"created_at"</span><span class="token operator">:</span> <span class="token number">1589486978</span><span class="token punctuation">,</span>
    <span class="token property">"updated_at"</span><span class="token operator">:</span> <span class="token number">1589486978</span><span class="token punctuation">,</span>
    <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"your-name-here"</span><span class="token punctuation">,</span>
    <span class="token property">"name_slug"</span><span class="token operator">:</span> <span class="token string">"your-name-here"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><hr>
<h3 id="update-a-source" tabindex="-1"><a class="header-anchor" href="#update-a-source" aria-hidden="true">#</a> Update a source</h3>
<hr>
<h4 id="endpoint-9" tabindex="-1"><a class="header-anchor" href="#endpoint-9" aria-hidden="true">#</a> Endpoint</h4>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>PUT /sources/{id}
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="parameters-6" tabindex="-1"><a class="header-anchor" href="#parameters-6" aria-hidden="true">#</a> Parameters</h4>
<hr>
<p><code>component_id</code> <strong>string</strong> (<em>optional</em>)</p>
<p>The ID of a component previously created in your account. <a href="/api/rest/#components" target="_blank" rel="noopener noreferrer">See the component
endpoints<ExternalLinkIcon/></a> for information on how to retrieve this ID.</p>
<hr>
<p><code>component_code</code> <strong>string</strong> (<em>optional</em>)</p>
<p>The full code for a <a href="/components/api/" target="_blank" rel="noopener noreferrer">Pipedream
component<ExternalLinkIcon/></a>.</p>
<hr>
<p><code>component_url</code> <strong>string</strong> (<em>optional</em>)</p>
<p>A reference to the URL where the component is hosted.</p>
<p>For example, to create an RSS component, pass
<code>https://github.com/PipedreamHQ/pipedream/blob/master/components/rss/sources/new-item-in-feed/new-item-in-feed.js</code>.</p>
<hr>
<p>One of <code>component_id</code>, <code>component_code</code>, or <code>component_url</code> is required. If all
are present, <code>component_id</code> is preferred and <code>component_url</code> will be used only
as metadata to identify the location of the code.</p>
<hr>
<p><code>name</code> <strong>string</strong> (<em>optional</em>)</p>
<p>The name of the source.</p>
<p>If absent, this defaults to using the <a href="/components/api/#component-structure" target="_blank" rel="noopener noreferrer">name slug<ExternalLinkIcon/></a>
of the component used to create the source.</p>
<hr>
<p><code>active</code> <strong>boolean</strong> (<em>optional</em>)</p>
<p>The active state of a component. To disable a component, set to <code>false</code>. To
enable a component, set to <code>true</code>.</p>
<p>Default: <code>true</code>.</p>
<h3 id="delete-a-source" tabindex="-1"><a class="header-anchor" href="#delete-a-source" aria-hidden="true">#</a> Delete a source</h3>
<hr>
<h4 id="endpoint-10" tabindex="-1"><a class="header-anchor" href="#endpoint-10" aria-hidden="true">#</a> Endpoint</h4>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>DELETE /sources/{id}
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h2 id="subscriptions" tabindex="-1"><a class="header-anchor" href="#subscriptions" aria-hidden="true">#</a> Subscriptions</h2>
<h3 id="listen-for-events-from-another-source-or-workflow" tabindex="-1"><a class="header-anchor" href="#listen-for-events-from-another-source-or-workflow" aria-hidden="true">#</a> Listen for events from another source or workflow</h3>
<hr>
<p>You can configure a source, or a workflow, to receive events from any number of
other workflows or sources. For example, if you want a single workflow to run on
10 different RSS sources, you can configure the workflow to <em>listen</em> for events
from those 10 sources.</p>
<p><strong>Currently, this feature is enabled only on the API. The Pipedream UI will not
display the sources configured as listeners using this API</strong>.</p>
<hr>
<h4 id="endpoint-11" tabindex="-1"><a class="header-anchor" href="#endpoint-11" aria-hidden="true">#</a> Endpoint</h4>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>POST /subscriptions?emitter_id={emitting_component_id}&amp;event_name={event_name}&amp;listener_id={receiving_source_id}
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="parameters-7" tabindex="-1"><a class="header-anchor" href="#parameters-7" aria-hidden="true">#</a> Parameters</h4>
<hr>
<p><code>emitter_id</code> <strong>string</strong></p>
<p>The ID of the workflow or component emitting events. Events from this component
trigger the receiving component / workflow.</p>
<p><code>emitter_id</code> also accepts glob patterns that allow you to subscribe to <em>all</em>
workflows or components:</p>
<ul>
<li><code>p_*</code>: Listen to events from all workflows</li>
<li><code>dc_*</code>: Listen to events from all event sources</li>
</ul>
<p><a href="/api/rest/#components" target="_blank" rel="noopener noreferrer">See the component endpoints<ExternalLinkIcon/></a> for information on how to
retrieve the ID of existing components. You can retrieve the ID of your workflow
in your workflow's URL - it's the string <code>p_2gCPml</code> in
<code>https://pipedream.com/@dylan/example-rss-sql-workflow-p_2gCPml/edit</code>.</p>
<hr>
<p><code>event_name</code> <strong>string</strong> (optional)</p>
<p><strong>Only pass <code>event_name</code> when you're listening for events on a custom channel, with the name of the custom channel</strong>:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>event_name=&lt;custom_channel>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>See <a href="/components/api/#emit" target="_blank" rel="noopener noreferrer">the <code>this.$emit</code> docs<ExternalLinkIcon/></a> for more information on how to emit events on custom channels.</p>
<p>Pipedream also exposes channels for logs and errors:</p>
<ul>
<li><code>$errors</code>: Any errors thrown by workflows or sources are emitted to this
stream</li>
<li><code>$logs</code>: Any logs produced by <strong>event sources</strong> are emitted to this stream</li>
</ul>
<hr>
<p><code>listener_id</code> <strong>string</strong></p>
<p>The ID of the component or workflow you'd like to receive events.</p>
<p><a href="/api/rest/#components" target="_blank" rel="noopener noreferrer">See the component endpoints<ExternalLinkIcon/></a> for information on how to
retrieve the ID of existing components. You can retrieve the ID of your workflow
in your workflow's URL - it's the string <code>p_2gCPml</code> in
<code>https://pipedream.com/@dylan/example-rss-sql-workflow-p_2gCPml/edit</code>.</p>
<hr>
<h4 id="example-request-8" tabindex="-1"><a class="header-anchor" href="#example-request-8" aria-hidden="true">#</a> Example Request</h4>
<p>You can configure workflow <code>p_abc123</code> to listen to events from the source
<code>dc_def456</code> using the following command:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token string">"https://api.pipedream.com/v1/subscriptions?emitter_id=dc_def456&amp;listener_id=p_abc123"</span> <span class="token punctuation">\</span>
  -X POST <span class="token punctuation">\</span>
  -H <span class="token string">"Authorization: Bearer &lt;api_key>"</span> <span class="token punctuation">\</span>
  -H <span class="token string">"Content-Type: application/json"</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h3 id="automatically-subscribe-a-listener-to-events-from-new-workflows-sources" tabindex="-1"><a class="header-anchor" href="#automatically-subscribe-a-listener-to-events-from-new-workflows-sources" aria-hidden="true">#</a> Automatically subscribe a listener to events from new workflows / sources</h3>
<hr>
<p>You can use this endpoint to automatically receive events, like workflow errors,
in another listening workflow or event source. Once you setup the
auto-subscription, any new workflows or event sources you create will
automatically deliver the specified events to the listener.</p>
<p>Note: this will configure subscriptions for <em>new</em> workflows and sources after
the time you configure the subscription. To deliver events to your listener from
<em>existing</em> workflows or sources, use the <a href="#listen-for-events-from-another-source-or-workflow"><code>POST /subscriptions</code>
endpoint</a>.</p>
<p><strong>Currently, this feature is enabled only on the API. The Pipedream UI will not
display the sources configured as listeners using this API</strong>.</p>
<hr>
<h4 id="endpoint-12" tabindex="-1"><a class="header-anchor" href="#endpoint-12" aria-hidden="true">#</a> Endpoint</h4>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>POST /auto_subscriptions?event_name={event_name}&amp;listener_id={receiving_source_id}
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="parameters-8" tabindex="-1"><a class="header-anchor" href="#parameters-8" aria-hidden="true">#</a> Parameters</h4>
<hr>
<p><code>event_name</code> <strong>string</strong></p>
<p>The name of the event stream whose events you'd like to receive:</p>
<ul>
<li><code>$errors</code>: Any errors thrown by workflows or sources are emitted to this
stream</li>
<li><code>$logs</code>: Any logs produced by <strong>event sources</strong> are emitted to this stream</li>
</ul>
<hr>
<p><code>listener_id</code> <strong>string</strong></p>
<p>The ID of the component or workflow you'd like to receive events.</p>
<p><a href="/api/rest/#components" target="_blank" rel="noopener noreferrer">See the component endpoints<ExternalLinkIcon/></a> for information on how to
retrieve the ID of existing components. You can retrieve the ID of your workflow
in your workflow's URL - it's the string <code>p_2gCPml</code> in
<code>https://pipedream.com/@dylan/example-rss-sql-workflow-p_2gCPml/edit</code>.</p>
<hr>
<h4 id="example-request-9" tabindex="-1"><a class="header-anchor" href="#example-request-9" aria-hidden="true">#</a> Example Request</h4>
<p>You can configure workflow <code>p_abc123</code> to listen to events from the source
<code>dc_def456</code> using the following command:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token string">"https://api.pipedream.com/v1/auto_subscriptions?event_name=<span class="token variable">$errors</span>&amp;listener_id=p_abc123"</span> <span class="token punctuation">\</span>
  -X POST <span class="token punctuation">\</span>
  -H <span class="token string">"Authorization: Bearer &lt;api_key>"</span> <span class="token punctuation">\</span>
  -H <span class="token string">"Content-Type: application/json"</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h3 id="delete-a-subscription" tabindex="-1"><a class="header-anchor" href="#delete-a-subscription" aria-hidden="true">#</a> Delete a subscription</h3>
<hr>
<p>Use this endpoint to delete an existing subscription. This endpoint accepts the
same parameters as the <a href="#listen-for-events-from-another-source-or-workflow"><code>POST /subscriptions</code>
endpoint</a> for creating
subscriptions.</p>
<hr>
<h4 id="endpoint-13" tabindex="-1"><a class="header-anchor" href="#endpoint-13" aria-hidden="true">#</a> Endpoint</h4>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>DELETE /subscriptions?emitter_id={emitting_component_id}&amp;listener_id={receiving_source_id}&amp;event_name={event_name}
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="parameters-9" tabindex="-1"><a class="header-anchor" href="#parameters-9" aria-hidden="true">#</a> Parameters</h4>
<hr>
<p><code>emitter_id</code> <strong>string</strong></p>
<p>The ID of the workflow or component emitting events. Events from this component
trigger the receiving component / workflow.</p>
<p><code>emitter_id</code> also accepts glob patterns that allow you to subscribe to <em>all</em>
workflows or components:</p>
<ul>
<li><code>p_*</code>: Listen to events from all workflows</li>
<li><code>dc_*</code>: Listen to events from all event sources</li>
</ul>
<p><a href="/api/rest/#components" target="_blank" rel="noopener noreferrer">See the component endpoints<ExternalLinkIcon/></a> for information on how to
retrieve the ID of existing components. You can retrieve the ID of your workflow
in your workflow's URL - it's the string <code>p_2gCPml</code> in
<code>https://pipedream.com/@dylan/example-rss-sql-workflow-p_2gCPml/edit</code>.</p>
<hr>
<p><code>listener_id</code> <strong>string</strong></p>
<p>The ID of the component or workflow you'd like to receive events.</p>
<p><a href="/api/rest/#components" target="_blank" rel="noopener noreferrer">See the component endpoints<ExternalLinkIcon/></a> for information on how to
retrieve the ID of existing components. You can retrieve the ID of your workflow
in your workflow's URL - it's the string <code>p_2gCPml</code> in
<code>https://pipedream.com/@dylan/example-rss-sql-workflow-p_2gCPml/edit</code>.</p>
<hr>
<p><code>event_name</code> <strong>string</strong></p>
<p>The name of the event stream tied to your subscription. <strong>If you didn't specify
an <code>event_name</code> when creating your subscription, pass <code>event_name=</code></strong>.</p>
<p>You'll find the <code>event_name</code> that's tied to your subscription when <a href="#get-current-user-s-subscriptions">listing your
subscriptions</a>:</p>
<div class="language-javascript ext-js line-numbers-mode"><pre v-pre class="language-javascript"><code><span class="token punctuation">{</span>
  <span class="token string-property property">"id"</span><span class="token operator">:</span> <span class="token string">"sub_abc123"</span><span class="token punctuation">,</span>
  <span class="token string-property property">"emitter_id"</span><span class="token operator">:</span> <span class="token string">"dc_abc123"</span><span class="token punctuation">,</span>
  <span class="token string-property property">"listener_id"</span><span class="token operator">:</span> <span class="token string">"dc_def456"</span><span class="token punctuation">,</span>
  <span class="token string-property property">"event_name"</span><span class="token operator">:</span> <span class="token string">"test"</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">{</span>
  <span class="token string-property property">"id"</span><span class="token operator">:</span> <span class="token string">"sub_def456"</span><span class="token punctuation">,</span>
  <span class="token string-property property">"emitter_id"</span><span class="token operator">:</span> <span class="token string">"dc_abc123"</span><span class="token punctuation">,</span>
  <span class="token string-property property">"listener_id"</span><span class="token operator">:</span> <span class="token string">"wh_abc123"</span><span class="token punctuation">,</span>
  <span class="token string-property property">"event_name"</span><span class="token operator">:</span> <span class="token string">""</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><hr>
<h4 id="example-request-10" tabindex="-1"><a class="header-anchor" href="#example-request-10" aria-hidden="true">#</a> Example Request</h4>
<p>You can delete a subscription you configured for workflow <code>p_abc123</code> to listen
to events from the source <code>dc_def456</code> using the following command:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token string">"https://api.pipedream.com/v1/subscriptions?emitter_id=dc_def456&amp;listener_id=p_abc123"</span> <span class="token punctuation">\</span>
  -X DELETE <span class="token punctuation">\</span>
  -H <span class="token string">"Authorization: Bearer &lt;api_key>"</span> <span class="token punctuation">\</span>
  -H <span class="token string">"Content-Type: application/json"</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h2 id="webhooks" tabindex="-1"><a class="header-anchor" href="#webhooks" aria-hidden="true">#</a> Webhooks</h2>
<p>Pipedream supports webhooks as a way to deliver events to a endpoint you own.
Webhooks are managed at an account-level, and you send data to these webhooks
using <a href="#subscriptions">subscriptions</a>.</p>
<p>For example, you can run a Twitter <a href="/event-sources" target="_blank" rel="noopener noreferrer">event source<ExternalLinkIcon/></a> that listens
for new tweets. If you <a href="#subscriptions">subscribe</a> the webhook to this source,
Pipedream will deliver those tweets directly to your webhook's URL without
running a workflow.</p>
<p><a href="/api/rest/webhooks" target="_blank" rel="noopener noreferrer"><strong>See these tutorials</strong><ExternalLinkIcon/></a> for examples.</p>
<h3 id="create-a-webhook" tabindex="-1"><a class="header-anchor" href="#create-a-webhook" aria-hidden="true">#</a> Create a webhook</h3>
<p>Creates a webhook pointing to a URL. Configure a <a href="#subscriptions">subscription</a>
to deliver events to this webhook.</p>
<h4 id="endpoint-14" tabindex="-1"><a class="header-anchor" href="#endpoint-14" aria-hidden="true">#</a> Endpoint</h4>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>POST /webhooks?url={your_endpoint_url}&amp;name={name}&amp;description={description}
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="parameters-10" tabindex="-1"><a class="header-anchor" href="#parameters-10" aria-hidden="true">#</a> Parameters</h4>
<hr>
<p><code>url</code> <strong>string</strong></p>
<p>The endpoint URL where you'd like to deliver events. Any events sent to this
webhook object will be delivered to this endpoint URL.</p>
<p>This URL <strong>must</strong> contain, at a minimum, a protocol — one of <code>http</code> or <code>https</code> —
and hostname, but can specify resources or ports. For example, these URLs work:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>https://example.com
http://example.com
https://example.com:12345/endpoint
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>but these do not:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code># No protocol - needs http(s)://
example.com

# mysql protocol not supported. Must be an HTTP(S) endpoint
mysql://user:pass@host:port
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div><hr>
<p><code>name</code> <strong>string</strong></p>
<p>The name you'd like to assign to this webhook, which will appear when <a href="#get-current-user-s-webhooks">listing
your webhooks</a>.</p>
<hr>
<p><code>description</code> <strong>string</strong></p>
<p>The description you'd like to assign to this webhook, which will appear when
<a href="#get-current-user-s-webhooks">listing your webhooks</a>.</p>
<h4 id="example-request-11" tabindex="-1"><a class="header-anchor" href="#example-request-11" aria-hidden="true">#</a> Example Request</h4>
<p>You can create a webhook that delivers events to
<code>https://endpoint.m.pipedream.net</code> using the following command:</p>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token string">"https://api.pipedream.com/v1/webhooks?url=https://endpoint.m.pipedream.net&amp;name=name&amp;description=description"</span> <span class="token punctuation">\</span>
  -X POST <span class="token punctuation">\</span>
  -H <span class="token string">"Authorization: Bearer &lt;api_key>"</span> <span class="token punctuation">\</span>
  -H <span class="token string">"Content-Type: application/json"</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div><h4 id="example-response-8" tabindex="-1"><a class="header-anchor" href="#example-response-8" aria-hidden="true">#</a> Example Response</h4>
<p>Successful API responses contain a webhook ID for the webhook that was created
in <code>data.id</code> — the string that starts with <code>wh_</code> — which you can reference when
creating <a href="#subscriptions">subscriptions</a>.</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"wh_abc123"</span><span class="token punctuation">,</span>
    <span class="token property">"user_id"</span><span class="token operator">:</span> <span class="token string">"u_abc123"</span><span class="token punctuation">,</span>
    <span class="token property">"name"</span><span class="token operator">:</span> <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">"description"</span><span class="token operator">:</span> <span class="token null keyword">null</span><span class="token punctuation">,</span>
    <span class="token property">"url"</span><span class="token operator">:</span> <span class="token string">"https://endpoint.m.pipedream.net"</span><span class="token punctuation">,</span>
    <span class="token property">"active"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token property">"created_at"</span><span class="token operator">:</span> <span class="token number">1611964025</span><span class="token punctuation">,</span>
    <span class="token property">"updated_at"</span><span class="token operator">:</span> <span class="token number">1611964025</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br></div></div><h3 id="list-webhooks" tabindex="-1"><a class="header-anchor" href="#list-webhooks" aria-hidden="true">#</a> List webhooks</h3>
<p>You can list webhooks you've created in your account using the
<a href="#get-current-user-s-webhooks"><code>/users/me/webhooks</code> endpoint</a></p>
<h2 id="workflows" tabindex="-1"><a class="header-anchor" href="#workflows" aria-hidden="true">#</a> Workflows</h2>
<h3 id="get-workflow-emits" tabindex="-1"><a class="header-anchor" href="#get-workflow-emits" aria-hidden="true">#</a> Get Workflow Emits</h3>
<hr>
<p>Retrieve up to the last 100 events emitted from a workflow using
<a href="/destinations/emit/#emit-events" target="_blank" rel="noopener noreferrer"><code>$send.emit()</code><ExternalLinkIcon/></a>.</p>
<h4 id="endpoint-15" tabindex="-1"><a class="header-anchor" href="#endpoint-15" aria-hidden="true">#</a> Endpoint</h4>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>GET /workflows/{workflow_id}/event_summaries
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="notes-and-examples-1" tabindex="-1"><a class="header-anchor" href="#notes-and-examples-1" aria-hidden="true">#</a> Notes and Examples</h4>
<p>The event data for events larger than <code>1KB</code> may get truncated in the response.
If you're retrieving larger events, and need to see the full event data, pass
<code>?expand=event</code>:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>GET /workflows/{workflow_id}/event_summaries&amp;expand=event
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>Pass <code>?limit=N</code> to retrieve the last <strong>N</strong> events:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>GET /v1/workflows/{workflow_id}/event_summaries?expand=event&amp;limit=1
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="example-request-12" tabindex="-1"><a class="header-anchor" href="#example-request-12" aria-hidden="true">#</a> Example Request</h4>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token string">'https://api.pipedream.com/v1/workflows/p_abc123/event_summaries?expand=event&amp;limit=1'</span> <span class="token punctuation">\</span>
  -H <span class="token string">'Authorization: Bearer &lt;api_key>'</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h4 id="example-response-9" tabindex="-1"><a class="header-anchor" href="#example-response-9" aria-hidden="true">#</a> Example Response</h4>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"page_info"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"total_count"</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
    <span class="token property">"start_cursor"</span><span class="token operator">:</span> <span class="token string">"1606511826306-0"</span><span class="token punctuation">,</span>
    <span class="token property">"end_cursor"</span><span class="token operator">:</span> <span class="token string">"1606511826306-0"</span><span class="token punctuation">,</span>
    <span class="token property">"count"</span><span class="token operator">:</span> <span class="token number">1</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"1606511826306-0"</span><span class="token punctuation">,</span>
      <span class="token property">"indexed_at_ms"</span><span class="token operator">:</span> <span class="token number">1606511826306</span><span class="token punctuation">,</span>
      <span class="token property">"event"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">"raw_event"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"Luke"</span><span class="token punctuation">,</span>
          <span class="token property">"title"</span><span class="token operator">:</span> <span class="token string">"Jedi"</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token property">"metadata"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">"emit_id"</span><span class="token operator">:</span> <span class="token string">"1ktF96gAMsLqdYSRWYL9KFS5QqW"</span><span class="token punctuation">,</span>
        <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">""</span><span class="token punctuation">,</span>
        <span class="token property">"emitter_id"</span><span class="token operator">:</span> <span class="token string">"p_abc123"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br></div></div><hr>
<h3 id="get-workflow-errors" tabindex="-1"><a class="header-anchor" href="#get-workflow-errors" aria-hidden="true">#</a> Get Workflow Errors</h3>
<hr>
<p>Retrieve up to the last 100 events for a workflow that threw an error. The
details of the error, along with the original event data, will be included</p>
<h4 id="endpoint-16" tabindex="-1"><a class="header-anchor" href="#endpoint-16" aria-hidden="true">#</a> Endpoint</h4>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>GET /workflows/{workflow_id}/$errors/event_summaries
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="notes-and-examples-2" tabindex="-1"><a class="header-anchor" href="#notes-and-examples-2" aria-hidden="true">#</a> Notes and Examples</h4>
<p>The event data for events larger than <code>1KB</code> may get truncated in the response.
If you're processing larger events, and need to see the full event data, pass
<code>?expand=event</code>:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>GET /workflows/{workflow_id}/$errors/event_summaries&amp;expand=event
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><p>Pass <code>?limit=N</code> to retrieve the last <strong>N</strong> events:</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>GET /v1/workflows/{workflow_id}/$errors/event_summaries?expand=event&amp;limit=1
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="example-request-13" tabindex="-1"><a class="header-anchor" href="#example-request-13" aria-hidden="true">#</a> Example Request</h4>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token string">'https://api.pipedream.com/v1/workflows/p_abc123/$errors/event_summaries?expand=event&amp;limit=1'</span> <span class="token punctuation">\</span>
  -H <span class="token string">'Authorization: Bearer &lt;api_key>'</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h4 id="example-response-10" tabindex="-1"><a class="header-anchor" href="#example-response-10" aria-hidden="true">#</a> Example Response</h4>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"page_info"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"total_count"</span><span class="token operator">:</span> <span class="token number">100</span><span class="token punctuation">,</span>
    <span class="token property">"start_cursor"</span><span class="token operator">:</span> <span class="token string">"1606370816223-0"</span><span class="token punctuation">,</span>
    <span class="token property">"end_cursor"</span><span class="token operator">:</span> <span class="token string">"1606370816223-0"</span><span class="token punctuation">,</span>
    <span class="token property">"count"</span><span class="token operator">:</span> <span class="token number">1</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"1606370816223-0"</span><span class="token punctuation">,</span>
      <span class="token property">"indexed_at_ms"</span><span class="token operator">:</span> <span class="token number">1606370816223</span><span class="token punctuation">,</span>
      <span class="token property">"event"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">"original_event"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"Luke"</span><span class="token punctuation">,</span>
          <span class="token property">"title"</span><span class="token operator">:</span> <span class="token string">"Jedi"</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token property">"original_context"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"1kodJIW7jVnKfvB2yp1OoPrtbFk"</span><span class="token punctuation">,</span>
          <span class="token property">"ts"</span><span class="token operator">:</span> <span class="token string">"2020-11-26T06:06:44.652Z"</span><span class="token punctuation">,</span>
          <span class="token property">"workflow_id"</span><span class="token operator">:</span> <span class="token string">"p_abc123"</span><span class="token punctuation">,</span>
          <span class="token property">"deployment_id"</span><span class="token operator">:</span> <span class="token string">"d_abc123"</span><span class="token punctuation">,</span>
          <span class="token property">"source_type"</span><span class="token operator">:</span> <span class="token string">"SDK"</span><span class="token punctuation">,</span>
          <span class="token property">"verified"</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
          <span class="token property">"owner_id"</span><span class="token operator">:</span> <span class="token string">"u_abc123"</span><span class="token punctuation">,</span>
          <span class="token property">"platform_version"</span><span class="token operator">:</span> <span class="token string">"3.1.20"</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token property">"error"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
          <span class="token property">"code"</span><span class="token operator">:</span> <span class="token string">"InternalFailure"</span><span class="token punctuation">,</span>
          <span class="token property">"cellId"</span><span class="token operator">:</span> <span class="token string">"c_abc123"</span><span class="token punctuation">,</span>
          <span class="token property">"ts"</span><span class="token operator">:</span> <span class="token string">"2020-11-26T06:06:56.077Z"</span><span class="token punctuation">,</span>
          <span class="token property">"stack"</span><span class="token operator">:</span> <span class="token string">"    at Request.extractError ..."</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token property">"metadata"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
        <span class="token property">"emitter_id"</span><span class="token operator">:</span> <span class="token string">"p_abc123"</span><span class="token punctuation">,</span>
        <span class="token property">"emit_id"</span><span class="token operator">:</span> <span class="token string">"1kodKnAdWGeJyhqYbqyW6lEXVAo"</span><span class="token punctuation">,</span>
        <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"$errors"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br></div></div><h2 id="users" tabindex="-1"><a class="header-anchor" href="#users" aria-hidden="true">#</a> Users</h2>
<h3 id="get-current-user-info" tabindex="-1"><a class="header-anchor" href="#get-current-user-info" aria-hidden="true">#</a> Get Current User Info</h3>
<hr>
<p>Retrieve information on the authenticated user.</p>
<h4 id="endpoint-17" tabindex="-1"><a class="header-anchor" href="#endpoint-17" aria-hidden="true">#</a> Endpoint</h4>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>GET /users/me
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="parameters-11" tabindex="-1"><a class="header-anchor" href="#parameters-11" aria-hidden="true">#</a> Parameters</h4>
<p><em>No parameters</em></p>
<h4 id="example-request-14" tabindex="-1"><a class="header-anchor" href="#example-request-14" aria-hidden="true">#</a> Example Request</h4>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token string">'https://api.pipedream.com/v1/users/me'</span> <span class="token punctuation">\</span>
  -H <span class="token string">'Authorization: Bearer &lt;api_key>'</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h4 id="example-response-11" tabindex="-1"><a class="header-anchor" href="#example-response-11" aria-hidden="true">#</a> Example Response</h4>
<p>Free user:</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"u_abc123"</span><span class="token punctuation">,</span>
    <span class="token property">"username"</span><span class="token operator">:</span> <span class="token string">"dylburger"</span><span class="token punctuation">,</span>
    <span class="token property">"email"</span><span class="token operator">:</span> <span class="token string">"dylan@pipedream.com"</span><span class="token punctuation">,</span>
    <span class="token property">"orgs"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"MyTestOrg"</span><span class="token punctuation">,</span>
        <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"o_abc123"</span><span class="token punctuation">,</span>
        <span class="token property">"orgname"</span><span class="token operator">:</span> <span class="token string">"mytestorg"</span><span class="token punctuation">,</span>
        <span class="token property">"email"</span><span class="token operator">:</span> <span class="token string">"test@pipedream.com"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">"daily_compute_time_quota"</span><span class="token operator">:</span> <span class="token number">95400000</span><span class="token punctuation">,</span>
    <span class="token property">"daily_compute_time_used"</span><span class="token operator">:</span> <span class="token number">8420300</span><span class="token punctuation">,</span>
    <span class="token property">"daily_invocations_quota"</span><span class="token operator">:</span> <span class="token number">27344</span><span class="token punctuation">,</span>
    <span class="token property">"daily_invocations_used"</span><span class="token operator">:</span> <span class="token number">24903</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br></div></div><p>Paid user:</p>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"u_abc123"</span><span class="token punctuation">,</span>
    <span class="token property">"username"</span><span class="token operator">:</span> <span class="token string">"dylburger"</span><span class="token punctuation">,</span>
    <span class="token property">"email"</span><span class="token operator">:</span> <span class="token string">"dylan@pipedream.com"</span><span class="token punctuation">,</span>
    <span class="token property">"billing_period_start_ts"</span><span class="token operator">:</span> <span class="token number">1610154978</span><span class="token punctuation">,</span>
    <span class="token property">"billing_period_end_ts"</span><span class="token operator">:</span> <span class="token number">1612833378</span><span class="token punctuation">,</span>
    <span class="token property">"billing_period_invocations"</span><span class="token operator">:</span> <span class="token number">12345</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br></div></div><h3 id="get-current-user-s-subscriptions" tabindex="-1"><a class="header-anchor" href="#get-current-user-s-subscriptions" aria-hidden="true">#</a> Get Current User's Subscriptions</h3>
<hr>
<p>Retrieve all the <a href="#subscriptions">subscriptions</a> configured for the
authenticated user.</p>
<h4 id="endpoint-18" tabindex="-1"><a class="header-anchor" href="#endpoint-18" aria-hidden="true">#</a> Endpoint</h4>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>GET /users/me/subscriptions
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="parameters-12" tabindex="-1"><a class="header-anchor" href="#parameters-12" aria-hidden="true">#</a> Parameters</h4>
<p><em>No parameters</em></p>
<h4 id="example-request-15" tabindex="-1"><a class="header-anchor" href="#example-request-15" aria-hidden="true">#</a> Example Request</h4>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token string">'https://api.pipedream.com/v1/users/me/subscriptions'</span> <span class="token punctuation">\</span>
  -H <span class="token string">'Authorization: Bearer &lt;api_key>'</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h4 id="example-response-12" tabindex="-1"><a class="header-anchor" href="#example-response-12" aria-hidden="true">#</a> Example Response</h4>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"sub_abc123"</span><span class="token punctuation">,</span>
      <span class="token property">"emitter_id"</span><span class="token operator">:</span> <span class="token string">"dc_abc123"</span><span class="token punctuation">,</span>
      <span class="token property">"listener_id"</span><span class="token operator">:</span> <span class="token string">"p_abc123"</span><span class="token punctuation">,</span>
      <span class="token property">"event_name"</span><span class="token operator">:</span> <span class="token string">""</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
      <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"sub_def456"</span><span class="token punctuation">,</span>
      <span class="token property">"emitter_id"</span><span class="token operator">:</span> <span class="token string">"dc_def456"</span><span class="token punctuation">,</span>
      <span class="token property">"listener_id"</span><span class="token operator">:</span> <span class="token string">"p_def456"</span><span class="token punctuation">,</span>
      <span class="token property">"event_name"</span><span class="token operator">:</span> <span class="token string">""</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><h3 id="get-current-user-s-webhooks" tabindex="-1"><a class="header-anchor" href="#get-current-user-s-webhooks" aria-hidden="true">#</a> Get Current User's Webhooks</h3>
<hr>
<p>Retrieve all the <a href="#webhooks">webhooks</a> configured for the authenticated user.</p>
<h4 id="endpoint-19" tabindex="-1"><a class="header-anchor" href="#endpoint-19" aria-hidden="true">#</a> Endpoint</h4>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>GET /users/me/webhooks
</code></pre><div class="line-numbers"><span class="line-number">1</span><br></div></div><h4 id="parameters-13" tabindex="-1"><a class="header-anchor" href="#parameters-13" aria-hidden="true">#</a> Parameters</h4>
<p><em>No parameters</em></p>
<h4 id="example-request-16" tabindex="-1"><a class="header-anchor" href="#example-request-16" aria-hidden="true">#</a> Example Request</h4>
<div class="language-bash ext-sh line-numbers-mode"><pre v-pre class="language-bash"><code><span class="token function">curl</span> <span class="token string">'https://api.pipedream.com/v1/users/me/webhooks'</span> <span class="token punctuation">\</span>
  -H <span class="token string">'Authorization: Bearer &lt;api_key>'</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><h4 id="example-response-13" tabindex="-1"><a class="header-anchor" href="#example-response-13" aria-hidden="true">#</a> Example Response</h4>
<div class="language-json ext-json line-numbers-mode"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
  <span class="token property">"page_info"</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token property">"total_count"</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
    <span class="token property">"count"</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
    <span class="token property">"start_cursor"</span><span class="token operator">:</span> <span class="token string">"d2hfMjlsdUd6"</span><span class="token punctuation">,</span>
    <span class="token property">"end_cursor"</span><span class="token operator">:</span> <span class="token string">"d2hfb3dHdWVv"</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token property">"data"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"wh_abc123"</span><span class="token punctuation">,</span>
      <span class="token property">"name"</span><span class="token operator">:</span> <span class="token null keyword">null</span><span class="token punctuation">,</span>
      <span class="token property">"description"</span><span class="token operator">:</span> <span class="token null keyword">null</span><span class="token punctuation">,</span>
      <span class="token property">"url"</span><span class="token operator">:</span> <span class="token string">"https://endpoint.m.pipedream.net"</span><span class="token punctuation">,</span>
      <span class="token property">"active"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token property">"created_at"</span><span class="token operator">:</span> <span class="token number">1611964025</span><span class="token punctuation">,</span>
      <span class="token property">"updated_at"</span><span class="token operator">:</span> <span class="token number">1611964025</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span>
      <span class="token property">"id"</span><span class="token operator">:</span> <span class="token string">"wh_def456"</span><span class="token punctuation">,</span>
      <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"Test webhook"</span><span class="token punctuation">,</span>
      <span class="token property">"description"</span><span class="token operator">:</span> <span class="token string">"just a test"</span><span class="token punctuation">,</span>
      <span class="token property">"url"</span><span class="token operator">:</span> <span class="token string">"https://endpoint2.m.pipedream.net"</span><span class="token punctuation">,</span>
      <span class="token property">"active"</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token property">"created_at"</span><span class="token operator">:</span> <span class="token number">1605835136</span><span class="token punctuation">,</span>
      <span class="token property">"updated_at"</span><span class="token operator">:</span> <span class="token number">1605835136</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br></div></div><Footer />
</template>
