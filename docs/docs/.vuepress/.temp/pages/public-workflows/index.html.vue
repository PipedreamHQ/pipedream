<template><h1 id="workflow-code-and-data-visibility" tabindex="-1"><a class="header-anchor" href="#workflow-code-and-data-visibility" aria-hidden="true">#</a> Workflow Code and Data Visibility</h1>
<p><strong>By default, the workflows you create, and the steps within them, are private. The data you send to a workflow, and all logs and API responses we attach to steps, are also private</strong>.</p>
<p>You can make your workflow code public using the drop-down menu to the right of the <strong>code</strong> label at the top of your workflow:</p>
<div>
<img alt="Workflow visibility toggle" src="@source/public-workflows/images/toggle-workflow-visibility.png">
</div>
<p><strong>It's critical you do not save sensitive data — for example, API keys — in public workflow code</strong>. You should save those values in <a href="/workflows/steps/#passing-data-to-steps-step-parameters" target="_blank" rel="noopener noreferrer">step parameters<ExternalLinkIcon/></a> or <a href="/environment-variables/" target="_blank" rel="noopener noreferrer">environment variables<ExternalLinkIcon/></a>, and reference the value of those variables in your workflow, instead.</p>
<p>When a workflow is public, trigger and action steps are also public, <strong>but the specific values of their <a href="/workflows/steps/#passing-data-to-steps-step-parameters" target="_blank" rel="noopener noreferrer">step parameters<ExternalLinkIcon/></a> are kept private, by default</strong>. For example:</p>
<ul>
<li>If you're using an HTTP trigger and sending data to S3 and SQL destinations, the fact that you're using those steps will be public. But we won't reveal the specific endpoint URL associated with your HTTP trigger.</li>
<li>We also won't reveal the name of the S3 bucket to which you're sending data, or the specific data you're sending.</li>
</ul>
<p>Moreover, you can <a href="/workflows/steps/#the-values-of-step-params-are-private-by-default" target="_blank" rel="noopener noreferrer">change the default visibility of step parameters<ExternalLinkIcon/></a> to make them public, to set default values or for examples, where relevant.</p>
<Footer />
</template>
