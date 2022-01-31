<template><h1 id="cold-starts" tabindex="-1"><a class="header-anchor" href="#cold-starts" aria-hidden="true">#</a> Cold Starts</h1>
<p>If your workflow doesn't process an event for roughly 5 minutes, Pipedream turns off the execution environment that runs your code. When your workflow receives another event, Pipedream creates a new execution environment and process your event. <strong>Initializing this environment takes a few seconds, which delays the execution of this first event</strong>. This is common on serverless platforms, and is typically referred to as a &quot;cold start&quot;.</p>
<p>If your workflow needs to process data in a time-sensitive manner (for example, if you're issuing an HTTP response), you can implement the following workaround to keep your workflow &quot;warm&quot;.</p>
<ul>
<li>Create a scheduled workflow that runs roughly every 5 minutes, making an HTTP request to your HTTP-triggered workflow on the <code>/warm</code> path (<a href="https://pipedream.com/@dylburger/warm-up-http-workflow-p_A2CQ9ne/edit" target="_blank" rel="noopener noreferrer">see example workflow<ExternalLinkIcon/></a>).</li>
<li>Then, in your original workflow, add a step at the top that ends the workflow early if it receives a request on this <code>/warm</code> path. You can set this path to be whatever you'd like — <code>/warm</code> is just an example. On normal requests, that step won't run and your workflow will proceed as normal (<a href="https://pipedream.com/@dylburger/end-early-on-warming-requests-p_PACqYrW/edit" target="_blank" rel="noopener noreferrer">see example workflow<ExternalLinkIcon/></a>).</li>
</ul>
<p>We're tracking the ability to keep a workflow permanently warm <a href="https://github.com/PipedreamHQ/pipedream/issues/318" target="_blank" rel="noopener noreferrer">here<ExternalLinkIcon/></a>. Feel free to follow that issue to receive updates.</p>
<Footer />
</template>
