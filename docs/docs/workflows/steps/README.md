# What are steps?

Steps are the building blocks you use to create workflows. You can easily combine multiple steps into a workflow to integrate your apps, data and APIs:

- Steps include triggers, code and pre-built actions.

- Steps are executed linearly, in the order they appear in your workflow.

- You can pass data between steps using `steps` objects.

- You can observe the execution results for each step including export values, logs and errors.

## Types of Steps

### Trigger

Every workflow begin with a single [**trigger**](/workflows/steps/triggers/) step. Trigger steps initiate the execution of a workflow; i.e., workflows execute on each trigger event. For example, you can create an [HTTP trigger](/workflows/steps/triggers/#http) to accept HTTP requests. We give you a unique URL where you can send HTTP requests, and your workflow is executed on each request.

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

[Steps are just functions](workflows/steps/code/#async-function-declaration). As functions, they can accept parameters and return data. We'll review how to pass params to steps here, and show you how to return data [below](#step-exports).

Instead of harcoding values directly in the code, these values can be parameterized, and passed to the step as a variable.

Parameters promote reusability. They make it easier for others to use the workflow, since it's clear what values they need to pass to the step to get it working.

In a new [Node.js code step](/workflows/steps/code/), try adding the following line of code:

```js
console.log(params.foo);
```

As soon as you do, you'll see a form appear below your code that asks you to enter a value for the field **Foo**:

<div>
<img width="600" alt="Params form for foo param" src="./images/params-foo.png">
</div>

When you reference a property of the `params` object in your code, Pipedream automatically creates an associated form field where you're asked to enter its value.

You'll see this field appear no matter how the property is referenced in code. For example, you can [destructure properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring) of `params` and we'll correctly display the associated field below:

<div>
<img width="500" alt="Params form for name param" src="./images/params-name.png">
</div>

Like with [actions](/workflows/steps/actions/), you can reference properties of [the `event` object](/workflows/events/), any data [exported from steps](#step-exports), or any raw strings in these fields.

You can use the **edit params schema** button near the top-right of the form to:

- Change the type of a param (defaults to **string**)
- Change its label
- Add placeholder text and instructions
- Validate its values, for example adding a regular expression against which values are tested

<div>
<img width="200" alt="edit params schema" src="./images/edit-params-schema.png">
</div>

### The values of step params are private by default

[Workflow code is public](/public-workflows/), so it's critical you don't include secrets or other user-specific data in your code.

By default, **the values of step parameters are private**, so if you use a param in your code and pass in its value using the associated form field, other viewers of your workflow won't see your user-specific value.

To be clear, you **should not** do this:

```javascript
const username = "luke";
```

Instead, you **should** replace the value of variables with param references:

```javascript
const { username } = params;
```

and add the value of the parameter in its form field, instead.

You can change the privacy of step parameters by clicking on the eye icon to the right of any param field. By default, they're private:

<div>
<img width="500" alt="param visibility toggle" src="./images/param-visibility.png">
</div>

But **any step parameter can be made public** if you're not passing user-specific data, need to present a default value, or want to display example values like we do in [this tutorial workflow](https://pipedream.com/@dylburger/hello-world-workflow-p_jmCL3N/edit).

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
  foo: "bar"
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
  data: "I can use this data in another step"
};
```

When you use `return`, the exported data will appear at `steps.[STEP NAME].$return_value`. For example, if you ran the code above in a step named `nodejs`, you'd reference the returned data using `steps.nodejs.$return_value`.

Like with named exports, the returned data will appear below the step.

<Footer />
