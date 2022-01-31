<template><h1 id="steps" tabindex="-1"><a class="header-anchor" href="#steps" aria-hidden="true">#</a> Steps</h1>
<p>Steps are the building blocks you use to create workflows. You can easily combine multiple steps into a workflow to integrate your apps, data and APIs:</p>
<ul>
<li>
<p>Steps include triggers, code and prebuilt actions.</p>
</li>
<li>
<p>Steps are executed linearly, in the order they appear in your workflow.</p>
</li>
<li>
<p>You can pass data between steps using <code>steps</code> objects.</p>
</li>
<li>
<p>You can observe the execution results for each step including export values, logs and errors.</p>
</li>
</ul>
<nav class="table-of-contents"><ul><li><RouterLink to="#types-of-steps">Types of Steps</RouterLink><ul><li><RouterLink to="#trigger">Trigger</RouterLink></li><li><RouterLink to="#code-actions">Code, Actions</RouterLink></li></ul></li><li><RouterLink to="#step-names">Step Names</RouterLink></li><li><RouterLink to="#passing-data-to-steps-from-the-workflow-builder">Passing data to steps from the workflow builder</RouterLink></li><li><RouterLink to="#step-exports">Step Exports</RouterLink></li></ul></nav>
<h2 id="types-of-steps" tabindex="-1"><a class="header-anchor" href="#types-of-steps" aria-hidden="true">#</a> Types of Steps</h2>
<h3 id="trigger" tabindex="-1"><a class="header-anchor" href="#trigger" aria-hidden="true">#</a> Trigger</h3>
<p>Every workflow begins with a single <a href="/workflows/steps/triggers/" target="_blank" rel="noopener noreferrer"><strong>trigger</strong><ExternalLinkIcon/></a> step. Trigger steps initiate the execution of a workflow; i.e., workflows execute on each trigger event. For example, you can create an <a href="/workflows/steps/triggers/#http" target="_blank" rel="noopener noreferrer">HTTP trigger<ExternalLinkIcon/></a> to accept HTTP requests. We give you a unique URL where you can send HTTP requests, and your workflow is executed on each request.</p>
<h3 id="code-actions" tabindex="-1"><a class="header-anchor" href="#code-actions" aria-hidden="true">#</a> Code, Actions</h3>
<p><a href="/components/actions/" target="_blank" rel="noopener noreferrer"><strong>Actions</strong><ExternalLinkIcon/></a> and <a href="/workflows/steps/code/" target="_blank" rel="noopener noreferrer"><strong>code</strong><ExternalLinkIcon/></a> steps drive the logic of your workflow. Anytime your workflow runs, Pipedream will execute each step of your workflow in order. Actions are prebuilt code steps that let you connect to hundreds of APIs without writing code. When you need more control than the default actions provide, code steps let you write any custom Node.js code.</p>
<p>Code and action steps cannot precede triggers, since they'll have no data to operate on.</p>
<p>Once you save a workflow, we deploy it to our servers. Each event triggers the workflow code, whether you have the workflow open in your browser, or not.</p>
<h2 id="step-names" tabindex="-1"><a class="header-anchor" href="#step-names" aria-hidden="true">#</a> Step Names</h2>
<p>Steps have names, which appear at the top of the step:</p>
<div>
<img width="250" alt="Default step names" src="@source/workflows/steps/images/step-name.png">
</div>
<p>When you <a href="#step-exports">share data between steps</a>, you'll use this name to reference that shared data. For example, <code>steps.trigger.event</code> contains the event that triggered your workflow. If you exported a property called <code>myData</code> from this code step, you'd reference that in other steps using <code>steps.nodejs.myData</code>. See the docs on <a href="#step-exports">step exports</a> to learn more.</p>
<p>You can rename a step by clicking on its name and typing a new one in its place:</p>
<div>
<img width="330" alt="New step name" src="@source/workflows/steps/images/new-step-name.png">
</div>
<p>After changing a step name, you'll need to update any references to the old step. In this example, you'd now reference this step as <code>steps.my_awesome_code_step</code>.</p>
<h2 id="passing-data-to-steps-from-the-workflow-builder" tabindex="-1"><a class="header-anchor" href="#passing-data-to-steps-from-the-workflow-builder" aria-hidden="true">#</a> Passing data to steps from the workflow builder</h2>
<p>You can generate form based inputs for steps using <code>props</code>. This allows the step reuse in across many workflows with different provided arguments - all without changing code.</p>
<p>Learn more about using <code>props</code> in our <a href="/code/nodejs/#passing-props-to-code-steps" target="_blank" rel="noopener noreferrer">Node.js code step documentation.<ExternalLinkIcon/></a></p>
<div class="custom-container warning"><p class="custom-container-title">WARNING</p>
<p>Passing props from the workflow builder to workflow steps are only available in Node.js code steps.</p>
<p>We do not currently offer this feature for Python, Bash or Go powered code steps.</p>
</div>
<h2 id="step-exports" tabindex="-1"><a class="header-anchor" href="#step-exports" aria-hidden="true">#</a> Step Exports</h2>
<p>Step exports allow you to pass data between steps. Any data exported from a step must be JSON serializable; the data must be able to stored as JSON so it can be read by downstream steps.</p>
<p>For examples of supported data types in your steps language, see the examples below.</p>
<ul>
<li><a href="/code/nodejs/#sharing-data-between-steps" target="_blank" rel="noopener noreferrer">Node.js (Javascript)<ExternalLinkIcon/></a></li>
<li><a href="/code/python/#sharing-data-between-steps" target="_blank" rel="noopener noreferrer">Python<ExternalLinkIcon/></a></li>
<li><a href="/code/bash/#sharing-data-between-steps" target="_blank" rel="noopener noreferrer">Bash<ExternalLinkIcon/></a></li>
<li><a href="/code/go/#sharing-data-between-steps" target="_blank" rel="noopener noreferrer">Go<ExternalLinkIcon/></a></li>
</ul>
<!--
To share data between steps, you can use **step exports**.

Your trigger step automatically exports the event that triggered your workflow in the variable `steps.trigger.event`. You can reference this variable in any step.

```javascript
async run({ steps, $ }) {
  // In any step, you can reference the contents of the trigger event
  console.log(steps.trigger.event);
}
```

When you export your own data from steps, you'll access it at the variable `steps.[STEP NAME].[EXPORT NAME]`. For example, a code step might export data at `steps.nodejs.myData`.

### Exporting data in code steps

You can export data from code steps in one of two ways: using named exports or `return`.

#### Using `return`

When you use return, the exported data will appear at `steps.[STEP NAME].$return_value`. For example, if you run the code below in a step named `nodejs`, you'd reference the returned data using `steps.nodejs.$return_value`.

```javascript
async run({ steps, $ }) {
  return "data"
}
```

#### Using `$.export`

You can also use `$.export` to return named exports from an action. `$export` takes the name of the export as the first argument, and the value to export as the second argument:

```javascript
async run({ steps, $ }) {
  $.export("name", "value")
}
```

When your workflow runs, you'll see the named exports appear below your step, with the data you exported. You can reference these exports in other steps using `steps.[STEP NAME].[EXPORT NAME]`.
-->
<Footer />
</template>
