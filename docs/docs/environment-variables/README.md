---
prev: false
next: false
---

# Environment Variables

**Environment variables** give you a way to separate secrets and other data from your code.

For example, you wouldn't want to include an API key in a code cell of a workflow. On the free tier, all workflow code is public by default, so anyone would be able to see your API key in plain sight. By referencing the value of an environment variable, instead, your public workflow includes a reference to that variable — `process.env.API_KEY` — instead of the API key itself.

You can [make any workflow private](/workflows/managing/#workflows-are-public-by-default-your-data-is-private), but it's still recommended to never keep API keys or other sensitive data directly in your code, no matter where that code is stored.

Environment variables are defined at the account-level, and can be referenced in code cells in any workflow.

[[toc]]

## Creating, updating environment variables

Environment variables are managed at the account-level. You can access your environment variables by clicking on the **Settings** link in the header of the app or by visiting <a href="https://pipedream.com/settings">{{$site.themeConfig.PIPEDREAM_BASE_URL}}/environment</a>

If this is your first time adding an environment variable, you'll see a menu prompting you to add a new **Key** and associated **Value**:

<div>
<img alt="Add a new env var" src="./images/add-new-env-var.png">
</div>

You can add another environment variable by clicking on the **+** button to the right of the text boxes, or remove it by clicking on the **-** button:

<div>
<img alt="Add or remove env var" src="./images/add-remove-env-var.png">
</div>

Any changes you make to environment variables — adding, removing, or updating one — must be saved for them to take effect. You'll see the green **Save** button appear in the footer of the page when you've made changes that need to be saved.

Updates to environment variables will be made available to your workflows as soon as the save operation is complete — typically a few seconds after you click **Save**. So if you update the value of an environment variable in the UI, your workflow should automatically use that new value where it's referenced.

There are some restrictions on the names and values of environment variables — see the [limits](#limits) section below. If you encounter these constraints, you'll typically see a helpful error message noting what the issue is:

<div>
<img alt="Error message" src="./images/env-var-error.png">
</div>

## Referencing environment variables in code

In Node.js code cells, you can reference the value of any environment variable using the Node-provided object [`process.env`](https://nodejs.org/dist/latest-v10.x/docs/api/process.html#process_process_env). This object contains environment variables as key-value pairs.

For example, let's say you have an environment variable named `API_KEY`. You can reference its value using `process.env.API_KEY`:

```javascript
const url = `http://yourapi.com/endpoint/?api_key=${process.env.API_KEY}`;
```

Variable names are case-sensitive. Use the name you defined in your Environment settings in the app when referencing your variable in `process.env`.

Referencing an environment variable that doesn't exist returns the value `undefined` in Node.js. For example, if you try to reference `process.env.API_KEY` without first defining the `API_KEY` variable in your environment settings, it will return the value `undefined`.

::: warning
Logging the value of any environment variables — for example, using `console.log` — will include that value in the logs associated with the cell. Please keep this in mind and take care not to print the values of sensitive secrets.
:::

## Referencing environment variables in actions

[Actions](/workflows/steps/actions/) are pre-built code steps that provide a form for passing [params](/workflows/steps/actions/) as input.

Like in code steps, you can also reference the value of environment variables using `process.env.<VARIABLE NAME>`. When you start typing `process.env`, you'll see an auto-completed list of available environment variables. Select the correct one to save its value in the params form:

<div>
<img alt="Select an environment variable" src="https://res.cloudinary.com/pipedreamin/image/upload/v1585434743/docs/env-vars_cn6pwm.gif">
</div>

You can also see the list of available variables — environment variables, [data from previous steps](/workflows/steps/#step-exports), etc. — by clicking on the hamburger menu on the right of the input field:

<div>
<img width="200px" alt="Params form hamburger menu" src="./images/params-hamburger-menu.png">
</div>

## Copying workflows that use environment variables

Your environment variables are made available to any running workflow. **If you copy a public workflow that uses an environment variable, make sure you review the code to see what environment variables it's using**.

Reviewing the code ensures you have the necessary variables defined for the workflow to run correctly, and makes sure the original workflow author isn't reading variables that you don't need for the workflow to function. You can always modify the code for the workflow after copying to remove these variables, or change their names.

## Limits

The value of any environment variable may be no longer than 256 characters.

The names of environment variables must start with a letter. Following characters can use any alpha-numeric character or an underscore (`_`).

Pipedream reserves environment variables that start with `PIPEDREAM_` for internal use. You cannot create an environment variable that begins with that prefix.

The total size of both the names and values of your environment variables cannot exceed `64KB` in length.

<Footer />
