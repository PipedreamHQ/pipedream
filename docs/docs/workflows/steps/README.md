# What are steps?

Steps are the building blocks you use to create workflows. You can easily combine multiple steps into a workflow to integrate your apps, data and APIs: 

- Steps include triggers, code and prebuilt actions.

- Steps are executed linearly, in the order they appear in your workflow.

- You can pass data between steps using `steps` objects.

- You can observe the execution results for each step including export values, logs and errors.

## Types of Steps

### Trigger

Every workflow begins with a single [**trigger**](/workflows/steps/triggers/) step. Trigger steps initiate the execution of a workflow; i.e., workflows execute on each trigger event. For example, you can create an [HTTP trigger](/workflows/steps/triggers/#http) to accept HTTP requests. We give you a unique URL where you can send HTTP requests, and your workflow is executed on each request.

### Code, Actions

[**Code**](/workflows/steps/code/) and [**Actions**](/workflows/steps/actions/) steps cannot precede triggers, since they'll have no data to operate on.

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

## Passing data to steps (step parameters)

[Steps are just functions](/workflows/steps/code/#async-function-declaration). As functions, they can accept parameters.

To define a parameter, simply reference it in your code. For example, try adding this code to your step:

```javascript
console.log(params.name);
```

then save or deploy your workflow. You'll see a form appear above your code step, prompting you to pass data to the `name` param. You can edit its name, description, type, and more from this UI.

Parameters promote reusability. They make it easier for others to use your workflow, since it's clear what values they need to pass to the step to get it working.

[Read more about params here](params/).

## Step Exports

By default, variables declared in a step are scoped to that step.

```js
// The variable myData can only be used within this step
const myData = 1;
```

To share data between steps, you can use **step exports**.

Your trigger step automatically exports the event that triggered your workflow in the variable `steps.trigger.event`. You can reference this variable in any step.

```js
// In any step, you can reference the contents of the trigger event
console.log(steps.trigger.event);
```

When you export your own data from steps, you'll access it at the variable `steps.[STEP NAME].[EXPORT NAME]`. For example, a code step might export data at `steps.nodejs.myData`. You can reference this variable in any code step or [step parameter](#passing-data-to-steps-step-parameters).

You can export data from steps in one of two ways: using named exports or `return`. The examples below are also included in [this workflow](https://pipedream.com/@dylburger/step-exports-example-p_xMC86w/edit), so you can copy and run it to see how this works.

### Use named exports

The variable `this` is a reference to the current step. `this` is a JavaScript object, and it's mutable. You can export any [JSON-serializable](https://stackoverflow.com/a/3316779/10795955) data from a step by setting properties of `this`:

```js
this.exportedData = "I can use this data in another step";
this.anotherProperty = {
  data: "I can export any JSON-serializable data",
  foo: "bar",
};
```

When your workflow runs, you'll see the named exports appear below your step, with the data you exported. You can reference these exports in other steps using `steps.[STEP NAME].[EXPORT NAME]`.

Let's assume the step above was named `myStep`. You'd reference its exports in any subsequent step like so:

```js
console.log(steps.myStep.exportedData);
console.log(steps.myStep.anotherProperty);
```

### Use `return`

You can also export data from steps using `return`:

```js
return {
  data: "I can use this data in another step",
};
```

When you use `return`, the exported data will appear at `steps.[STEP NAME].$return_value`. For example, if you ran the code above in a step named `nodejs`, you'd reference the returned data using `steps.nodejs.$return_value.data`.

Like with named exports, the returned data will appear below the step.

<Footer />
