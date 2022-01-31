<template><h1 id="context" tabindex="-1"><a class="header-anchor" href="#context" aria-hidden="true">#</a> <code>$context</code></h1>
<p><code>$context</code> (&quot;dollar context&quot;) is a variable that contains details about the current execution of a workflow, for instance the time the workflow was executed, the current event ID, and more.</p>
<p>Like <code>$event</code>, <code>$context</code> is a global variable, accessible in any code or action step. <code>$context</code> is also a JavaScript object, so you can access it's properties via dot-notation (for example, <code>$context.ts</code>).</p>
<p>Unlike <code>$event</code>, <code>$context</code> is read-only. Attempting to modify <code>$context</code> will not throw an error, but it will have no effect.</p>
<h2 id="contents-of-context" tabindex="-1"><a class="header-anchor" href="#contents-of-context" aria-hidden="true">#</a> Contents of <code>$context</code></h2>
<p><code>$context</code> contains the following properties:</p>
<ul>
<li><code>id</code>: a unique identifier tied to the current execution.</li>
<li><code>ts</code>: the timestamp the execution began, represented in <a href="https://en.wikipedia.org/wiki/ISO_8601" target="_blank" rel="noopener noreferrer">ISO 8601 format<ExternalLinkIcon/></a></li>
<li><code>pipeline_id</code>: the unique identifier of the current workflow.</li>
<li><code>deployment_id</code> : every workflow version creates a new &quot;deployment&quot; of your workflow. The <code>deployment_id</code> is a unique identifier that represents the version of the workflow tied to the current execution.</li>
<li><code>platform_version</code>: an integer tied to the current structure of <code>$context</code>. If the structure of <code>$context</code> changes in the future, this integer will increment and changes to the structure will be communicated in our docs. The current <code>platform_version</code> is <strong>2</strong>.</li>
<li><code>source_type</code>: a string that represents the source of the event that triggered this execution.</li>
<li><code>verified</code>: a Boolean value representing whether the request to the Pipedream API to trigger this execution was properly signed. This will be <code>false</code> for all HTTP requests that hit Webhook sources directly, without an API key, since those do not utilize the API.</li>
</ul>
</template>
