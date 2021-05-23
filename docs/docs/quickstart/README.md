# Introduction

Complete this guide to learn the basic patterns for developing Pipedream workflows:

- Trigger workflows on HTTP requests, schedules and app events
- Return a custom response from your workflow on HTTP requests 
- Use connected accounts in actions and code steps
- Combine code steps and no code actions in workflows and pass data between steps
- Use npm packages in Node.js code steps
- Add a step with Node.js scaffolding for an app

This guide starts with simple examples to introduce basic concepts and builds up to a real-world use case to post richly formatted Tweets to Slack. We strongly recommend that you complete the examples in order. 

<!--![image-20210518194229746](./images/image-20210518194229746.png)-->

1. [hello world!](/quickstart/hello-world/) (~5 minutes)
2. [hello ${name}!](/quickstart/hello-name/) (~5 minutes)
3. [Make outbound HTTP requests!](/quickstart/make-http-request/) (~5 minutes)
4. [Use npm packages](/quickstart/using-npm-packages/) (~5 minutes)
5. [Insert data into Google Sheets](/quickstart/add-data-to-google-sheets/) (~5 minutes)
6. [End Workflow Execution Early](/quickstart/end-workflow-early/) (~5 minutes)
7. [Use managed auth in code](/quickstart/use-managed-auth-in-code/) (~5 minutes)
8. [Email yourself on new items in an RSS feed](/quickstart/email-yourself/) (~5 minutes)
9. [Real-world Twitter -> Slack](/quickstart/real-world-example/) (~5 minutes)

If you don't have a Pipedream account, create one for free at [https://pipedream.com](https://pipedream.com).

Ready to get started? [Take me to the first example &rarr;](/quickstart/hello-world/)

<!--
After you're done, explore Pipedream's [advanced capabilities](/quickstart/next-steps/) to build even more powerful workflows!

::: tip
We **strongly** recommend that you complete the examples in order.
:::

**[hello world!](/quickstart/hello-world/) (~5 minutes)**

- Create a new workflow and familiarize yourself with the builder layout
- Generate a unique endpoint URL to trigger your workflow
- Send HTTP requests to your workflow and inspect them
- Add a custom response to return "hello world!" on each HTTP request

**[hello ${name}!](/quickstart/hello-name/) (~5 minutes)**

- Pass a name on each HTTP request as a query parameter
- Return the name in the custom HTTP response

**[Make outbound HTTP requests!](/quickstart/make-http-request/) (~5 minutes)**

- Use the **GET Request** action to make an HTTP request from your workflow
- Test the workflow and inspect the step exports
- Return data exported by the **GET Request** step in the custom HTTP response

**[Use npm packages](/quickstart/using-npm-packages/) (~5 minutes)**

- Replace the **GET Request** action with a Node.js code step
- Use the `axios` npm package to make an HTTP `GET` request 
- Export the response and rename the step

**[Insert data into Google Sheets](/quickstart/add-data-to-google-sheets/) (~5 minutes)**

- Replace the **HTTP API** trigger with a **Schedule**
- Delete the HTTP response step
- Save data returned from the remaining step to Google Sheets

**[Use managed auth in code](/quickstart/use-managed-auth-in-code/) (~5 minutes)**

- TBC
- TBC

**[Email yourself on new items in an RSS feed](/quickstart/email-yourself/) (~5 minutes)**

- Trigger a workflow on new items in an RSS feed
- Use an action to send an email to the account registered with Pipedream

**[Real-world Twitter -> Slack](/quickstart/real-world-example/) (~5 minutes)**

- Create a workflow triggered on new Twitter mentions 
- Format the Tweet using Slack Block Kit
- Post the formatted message to a Slack channel

At minimum, create a free account at [https://pipedream.com](https://pipedream.com). To complete all the examples, you'll also need accounts for:

- Google Sheets
- Github
- Slack
- Twitter
-->