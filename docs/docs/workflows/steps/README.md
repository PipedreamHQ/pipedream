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

[**Actions**](/components#actions) and [**code**](/code/) steps drive the logic of your workflow. Anytime your workflow runs, Pipedream will execute each step of your workflow in order. Actions are prebuilt code steps that let you connect to hundreds of APIs without writing code. When you need more control than the default actions provide, code steps let you write any custom Node.js code.

Code and action steps cannot precede triggers, since they'll have no data to operate on.

Once you save a workflow, we deploy it to our servers. Each event triggers the workflow code, whether you have the workflow open in your browser, or not.

## Step Names

Steps have names, which appear at the top of the step:

![The name of the step is on the top of the step](https://res.cloudinary.com/pipedreamin/image/upload/v1647958883/docs/components/CleanShot_2022-03-22_at_10.20.52_2x_ngo5r5.png)

When you [share data between steps](#step-exports), you'll use this name to reference that shared data. For example, `steps.trigger.event` contains the event that triggered your workflow. If you exported a property called `myData` from this code step, you'd reference that in other steps using `steps.code.myData`. See the docs on [step exports](#step-exports) to learn more.

You can rename a step by clicking on its name and typing a new one in its place:

![Renaming a code step to "get_data"](https://res.cloudinary.com/pipedreamin/image/upload/v1647959120/docs/components/CleanShot_2022-03-22_at_10.24.32_zfxrwd.gif)

After changing a step name, you'll need to update any references to the old step. In this example, you'd now reference this step as `steps.get_data`.

::: tip
Step names cannot contain spaces or dashes. Please use underscores or camel casing for your step names, like `getData` or `get_data`.
:::

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

<Footer />
