# Pipedream 101

Complete this quickstart to learn the basic patterns to develop Pipedream workflows, including how to:

- Trigger workflows on HTTP requests, schedules and app events
- Return a custom response from your workflow on HTTP requests 
- Use actions to send yourself an email, add data to Google Sheets and send a message to Slack
- Use npm packages, data exports, and connected accounts in Node.js code steps
- Pass data between workflow steps

This guide starts with simple [examples](#examples) to introduce basic concepts and builds up to a [real-world use case](/quickstart/real-world-example/) to post richly formatted Tweets to Slack. After you're done, explore Pipedream's [advanced capabilities](/quickstart/next-steps/) to build even more powerful workflows!


![image-20210518194229746](./images/image-20210518194229746.png)

## Examples

::: tip
We **strongly** recommend that you complete the examples in order.
:::

**[1. hello world!](/quickstart/hello-world/) (~5 minutes)**

- Create a new workflow and familiarize yourself with the builder layout
- Generate a unique endpoint URL to trigger your workflow
- Send HTTP requests to your workflow and inspect them
- Add a custom response to return "hello world!" on each HTTP request

**[2. hello ${name}!](/quickstart/hello-name/) (~5 minutes)**

- Pass a name on each HTTP request as a query parameter
- Return the name in the custom HTTP response

**[3. Make outbound HTTP requests!](/quickstart/make-http-request/) (~5 minutes)**

- Use the **GET Request** action to make an HTTP request from your workflow
- Test the workflow and inspect the step exports
- Return data exported by the **GET Request** step in the custom HTTP response

**[4. Use npm packages](/quickstart/using-npm-packages/) (~5 minutes)**

- Replace the **GET Request** action with a Node.js code step
- Use the `axios` npm package to make an HTTP `GET` request 
- Export the response and rename the step

**[5. Insert data into Google Sheets](/quickstart/add-data-to-google-sheets/) (~5 minutes)**

- Replace the **HTTP API** trigger with a **Schedule**
- Delete the HTTP response step
- Save data returned from the remaining step to Google Sheets

**[6. Use managed auth in code](/quickstart/use-managed-auth-in-code/) (~5 minutes)**

- TBC
- TBC

**[7. Email yourself on new items in an RSS feed](/quickstart/email-yourself/) (~5 minutes)**

- Trigger a workflow on new items in an RSS feed
- Use an action to send an email to the account registered with Pipedream

**[8. Real-world Twitter -> Slack](/quickstart/real-world-example/) (~5 minutes)**

- Create a workflow triggered on new Twitter mentions 
- Format the Tweet using Slack Block Kit
- Post the formatted message to a Slack channel

## Prerequisites

At minimum, create a free account at [https://pipedream.com](https://pipedream.com). To complete all the examples, you'll also need accounts for:

- Google Sheets
- Github
- Slack
- Twitter
