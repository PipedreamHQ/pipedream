# Steps

Steps are the building blocks you use to create workflows. You can easily combine multiple steps into a workflow to integrate your apps, data and APIs: 

- Steps include triggers, code and prebuilt actions.

- Steps are executed linearly, in the order they appear in your workflow.

- You can pass data between steps using `steps` objects.

- You can observe the execution results for each step including export values, logs and errors.

[[toc]]

## Types of Steps

### Trigger

Every workflow begins with a single [**trigger**](/workflows/steps/triggers/) step. Trigger steps initiate the execution of a workflow; i.e., workflows execute on each trigger event. For example, you can create an [HTTP trigger](/workflows/steps/triggers/#http) to accept HTTP requests. We give you a unique URL where you can send HTTP requests, and your workflow is executed on each request.

### Code, Actions

[**Actions**](/components/actions/) and [**code**](/workflows/steps/code/) steps drive the logic of your workflow. Anytime your workflow runs, Pipedream will execute each step of your workflow in order. Actions are prebuilt code steps that let you connect to hundreds of APIs without writing code. When you need more control than the default actions provide, code steps let you write any custom Node.js code.

Code and action steps cannot precede triggers, since they'll have no data to operate on.

Once you save a workflow, we deploy it to our servers. Each event triggers the workflow code, whether you have the workflow open in your browser, or not.

## Step Names

Steps have names, which appear at the top of the step:

<div>
<img width="250" alt="Default step names" src="./images/step-name.png">
</div>

When you [share data between steps](#step-exports), you'll use this name to reference that shared data. For example, `steps.trigger.event` contains the event that triggered your workflow. If you exported a property called `myData` from this code step, you'd reference that in other steps using `steps.nodejs.myData`. See the docs on [step exports](#step-exports) to learn more.

You can rename a step by clicking on its name and typing a new one in its place:

<div>
<img width="330" alt="New step name" src="./images/new-step-name.png">
</div>

After changing a step name, you'll need to update any references to the old step. In this example, you'd now reference this step as `steps.my_awesome_code_step`.

## Passing data to steps from the workflow builder

You can generate form based inputs for steps using `props`. This allows the step reuse in across many workflows with different provided arguments - all without changing code.

Learn more about using `props` in our [Node.js code step documentation.](/code/nodejs/#passing-props-to-code-steps)

:::warning
Passing props from the workflow builder to workflow steps are only available in Node.js code steps.

We do not currently offer this feature for Python, Bash or Go powered code steps.
:::

## Step Exports

Step exports allow you to pass data between steps. Any data exported from a step must be JSON serializable; the data must be able to stored as JSON so it can be read by downstream steps.

For examples of supported data types in your steps language, see the examples below.

* [Node.js (Javascript)](/code/nodejs/#sharing-data-between-steps)
* [Python](/code/python/#sharing-data-between-steps)
* [Bash](/code/bash/#sharing-data-between-steps)
* [Go](/code/go/#sharing-data-between-steps)

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
