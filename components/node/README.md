# Overview

Develop, run and deploy your Node.js code in Pipedream workflows, using it between no-code steps, with [connected accounts](https://pipedream.com/docs/code/nodejs/auth), or integrate [Data Stores](https://pipedream.com/docs/data-stores) and [File Stores](https://pipedream.com/docs/projects/file-stores).

This includes [installing NPM packages](https://pipedream.com/docs/code/nodejs#using-npm-packages), within your code without having to manage a `package.json` file or running `npm install`.

Below is an example of installing the `axios` package in a Pipedream Node.js code step. Pipedream imports the **`axios`** package, performs the API request, and shares the response with subsequent workflow steps:

# Getting Started

To add a Node.js code step, open a new workflow and include a step.

1. Select the **Node** app:

![Node.js app being chosen in Pipedream's new step selector screen.](https://res.cloudinary.com/pipedreamin/image/upload/v1713366571/marketplace/apps/node.js/CleanShot_2024-04-17_at_11.07.40_nrfq20.png)

2. Then select the **Run Node Code** action:

![Selecting the 'Run Node Code' action from the Node app in the Pipedream interface.”](https://res.cloudinary.com/pipedreamin/image/upload/v1713366838/marketplace/apps/node.js/CleanShot_2024-04-17_at_11.12.26_rtj2qi.png)

Now you’re ready to write some code!

On the right, you'll see the default code provided by Pipedream:

```jsx
// To use any npm package, just import it
// import axios from "axios"

export default defineComponent({
  async run({ steps, $ }) {
    // Reference previous step data using the steps object and return data to use it in future steps
    return steps.trigger.event
  },
})
```

You can write your custom code within the `run` function. `run` is called when this step executes in your workflow.

When you click **Test** on the Node.js code step, it will display the event data from your trigger step. For instance, if your trigger is an HTTP request, then the HTTP request data will be returned.

This step can execute any Node.js code. However, the **`run`** function, a special Pipedream callback, must be set up correctly to return data. Otherwise, you can run arbitrary code that:

- [Consumes or shares data with other steps](https://pipedream.com/docs/code/nodejs#sharing-data-between-steps)
- [Send HTTP requests](https://pipedream.com/docs/code/nodejs#making-http-requests-from-your-workflow)
- [Return an HTTP response](https://pipedream.com/docs/code/nodejs#returning-http-responses)
- [End the entire workflow](https://pipedream.com/docs/code/nodejs#ending-a-workflow-early)
- [Use your connected accounts to make authenticated HTTP requests](https://pipedream.com/docs/code/nodejs/auth)
- [Reference environment variables](https://pipedream.com/docs/code/nodejs#using-secrets-in-code)
- [Display props for entering in dynamic or static data](https://pipedream.com/docs/code/nodejs#passing-props-to-code-steps)
- [Retrieve or update data within Data Stores](https://pipedream.com/docs/code/nodejs/using-data-stores)
- [Download, upload and manipulate files](https://pipedream.com/docs/code/nodejs/working-with-files)
- [Pausing, resuming and rerunning Node.js code steps](https://pipedream.com/docs/code/nodejs/rerun)
- [Browser automation with Puppeteer or Playwright](https://pipedream.com/docs/code/nodejs/browser-automation)

## Developing pre-built actions and triggers

Pipedream’s pre-built actions and triggers (a.k.a. Sources) are built using Node.js. [These components](https://pipedream.com/docs/components) allow you to quickly build workflows by reusing logic with different inputs (also known as [props](https://pipedream.com/docs/workflows/using-props)).

These components are open source. [You can fork the Pipedream repository](https://github.com/PipedreamHQ/pipedream) and modify these components to your needs. You can even publish private actions and sources to your workspace for you and your team’s own use.

You can also [contribute actions and triggers to Pipedream’s Registry](https://pipedream.com/docs/apps/contributing) which are published on [Pipedream’s App Marketplace](https://pipedream.com/apps). Publishing your app on Pipedream integrates it for use with code steps as well as streamlined integrations with your own pre-built actions and triggers.

Components can be deployed to your workspace by using the Pipedream CLI, or within your workflows Node.js code steps directly.

To get started:

- Learn about Pipedream Node.js powered [Components](https://pipedream.com/docs/components)
    - [Build a custom action](https://pipedream.com/docs/components/actions-quickstart)
    - [Build a custom trigger](https://pipedream.com/docs/components/sources-quickstart)
- [Integrate your app into Pipedream](https://pipedream.com/docs/apps/contributing#contribution-process)

## AI code generation

Generate Pipedream compatible Node.js code within your workflow with human language.

To get started, open a Node.js step and select the **Edit with AI** button.

![Initiating an AI code generation session from a Node.js code step in the Pipedream workflow editor.](https://res.cloudinary.com/pipedreamin/image/upload/v1713367770/marketplace/apps/node.js/CleanShot_2024-04-17_at_11.28.34_ld1ymo.png)

Then, enter your prompt to generate code. Selecting a specific app generates the necessary integration code for API requests.

For example, select the Slack app and use the prompt:

```
Send a message to a public channel
```

This prompt will generate the corresponding code to send an API request to Slack and perform the action using your connected Pipedream account.

# Troubleshooting

Pipedream will show your error traces within your individual steps, under the **Logs** section.

Traces across all of your workflows are also available within the [Event History](https://pipedream.com/docs/event-history) in your Pipedream workspace. This gives a global view of all failed executions, and gives you the tools to filter by workflow, time occurred and more.

## Pipedream Specific Errors

If there’s an issue with a specific Pipedream level construct, you’ll see specific error messages within the step itself. 

### Configuration Error

A `ConfigurationError` can occur if the props for the code step are invalid. For example, if you’re attempting to update a Google Calendar event, but the `end_date` is *before* the `start_date`, then the action may throw a specific `ConfigurationError` to signal this action isn’t possible.

As a Pipedream action or source developer, you can also leverage `ConfigurationErrors` to guide users of your action or source to pass appropriate data to props in order for the component to function properly.

For more details, visit the [Configuration Error documentation](https://pipedream.com/docs/code/nodejs#configuration-error).

### Active Handle Error

If your code is performing an asynchronous action that is not properly awaited, you may see an error.

This error means that *control* has moved onto the next step, but there were unresolved promises within your Node.js code.

To keep Pipedream from moving onto the next step, use `await` on your promises to hold execution until the promise finishes.

[Read our docs](https://pipedream.com/docs/code/nodejs/async#the-problem) on implementing asynchronous code in Node.js code steps.
