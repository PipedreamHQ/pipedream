# HTTP

Integrate and automate any API using Pipedream workflows. Use app specific pre-built actions, or an HTTP request action for a no code interface. If you need more control over error handling, then use your same connected accounts with code in Node.js or Python.

## Pre-built actions

Pre-built actions are the most convenient option for integrating your workflow with an API. Pre-built actions can use your connected accounts to perform API requests, and are configured through props.

Pre-built actions are the fastest way to get started building workflows, but they may not fit your use case if a prop is missing or is handling data in a way that doesn't fit your needs.

For example, to send a message using Slack just search for Slack and use the **Send Message to a Public Channel** action:

![Finding the Slack - Send Message to a Public Channel action](https://res.cloudinary.com/pipedreamin/image/upload/v1684263132/docs/docs/CleanShot_2023-05-16_at_14.36.58_et1kg2.png)

Then connect your Slack account, select a channel and write your message:

![Configuring a Slack - Send Message to a Public Channel action](https://res.cloudinary.com/pipedreamin/image/upload/v1684263134/docs/docs/CleanShot_2023-05-16_at_14.37.29_qngd26.png)

Now with a few clicks and some text you've integrated Slack into a Pipedream workflow.

::: tip Pre-built actions are open source

All pre-built actions are published from the [Pipedream Component Registry](/apps/contributing/), so you can read and modify their source code. You can even publish your own from [Node.js code steps privately to your own workspace](/code/nodejs/sharing-code/).

:::

## HTTP Request Action

The HTTP request action is the next most convenient option. Use a Postman-like interface to configure an HTTP request - including the headers, body, and even connecting an account.

![Finding the HTTP request builder action](https://res.cloudinary.com/pipedreamin/image/upload/v1684420462/docs/docs/http/CleanShot_2023-05-18_at_10.33.50_vigdf7.png)

Once you connect your account to the step, it will automatically configure the authorization headers to match.

![Selecting a connected account for a HTTP request step](https://res.cloudinary.com/pipedreamin/image/upload/v1684259987/docs/docs/event%20histories/CleanShot_2023-05-16_at_13.50.53_fv3caw.png)

Then you can choose **Slack** as the service to connect the HTTP request with:

![Connecting the HTTP Request step to Slack](https://res.cloudinary.com/pipedreamin/image/upload/v1684420551/docs/docs/http/CleanShot_2023-05-18_at_10.35.41_dxyipl.png)

The HTTP request action will automatically be configured with the Slack connection, you'll just need to select your account to finish the authentication.

Then it's simply updating the URL to send a message which is [`https://slack.com/api/chat.postMessage`](https://api.slack.com/methods/chat.postMessage):

![Defining the Slack API endpoint URL and connecting an account](https://res.cloudinary.com/pipedreamin/image/upload/v1684263130/docs/docs/CleanShot_2023-05-16_at_14.35.05_mame6o.png)

Finally modify the body of the request to specify the `channel` and `message` for the request:

![Configuring the Slack body for sending the request](https://res.cloudinary.com/pipedreamin/image/upload/v1684263128/docs/docs/CleanShot_2023-05-16_at_14.34.56_kpk2vp.png)

HTTP Request actions can be used to quickly scaffold API requests, but are not as flexible as code for a few reasons:

* Conditionally sending requests - The HTTP request action will always request, to send requests conditionally you'll need to use code.
* Workflow execution halts - if an HTTP request fails, the entire workflow cancels
* Automatically retrying - `$.flow.retry` isn't available in the HTTP Request action to retry automatically if the request fails
* Error handling - It's not possible to set up a secondary action if an HTTP request fails.

## HTTP Requests in code

When you need more control, use code. You can use your connected accounts with Node.js or Python code steps.

This gives you the flexibility to catch errors, use retries, or send multiple API requests in a single step.

First, connect your account to the code step:

* [Connecting any account to a Node.js step](/code/nodejs/auth/#accessing-connected-account-data-with-this-appname-auth)
* [Connecting any account to a Python step](/code/python/auth/)

### Conditionally sending an API Request

You may only want to send a Slack message on a certain condition, in this example we'll only send a Slack message if the HTTP request triggering the workflow passes a special variable: `steps.trigger.event.body.send_message`

```javascript
import { axios } from "@pipedream/platform"

export default defineComponent({
  props: {
    slack: {
      type: "app",
      app: "slack",
    }
  },
  async run({steps, $}) {
    // only send the Slack message if the HTTP request has a `send_message` property in the body
    if(steps.trigger.body.send_message) {
      return await axios($, {
        headers: {
          Authorization: `Bearer ${this.slack.$auth.oauth_access_token}`,
        },

        url: `https://slack.com/api/chat.postMessage`,

        method: 'post',
        data: {
          channel: 'C123456',
          text: 'Hi from a Pipedream Node.js code step'
        }
      })
    }
  },
})

```

### Error Handling

The other advantage of using code is handling error messages using `try...catch` blocks. In this example, we'll only send a Slack message if another API request fails:

```javascript
import { axios } from "@pipedream/platform"

export default defineComponent({
  props: {
    openai: {
      type: "app",
      app: "openai"
    },
    slack: {
      type: "app",
      app: "slack",
    }
  },
  async run({steps, $}) {
    try {
      return await axios($, {
        url: `https://api.openai.com/v1/completions`,
        method: 'post',
        headers: {
          Authorization: `Bearer ${this.openai.$auth.api_key}`,
        },
        data: {
          "model": "text-davinci-003",
          "prompt": "Say this is a test",
          "max_tokens": 7,
          "temperature": 0
        }
      })
    } catch(error) {
      return await axios($, {
        url: `https://slack.com/api/chat.postMessage`,
        method: 'post',
        headers: {
          Authorization: `Bearer ${this.slack.$auth.oauth_access_token}`,
        },
        data: {
          channel: 'C123456',
          text: `OpenAI returned an error: ${error}`
        }
      })
    }
  },
})
```

::: tip Subscribing to all errors

[You can use a subscription](/api/rest/#subscriptions) to subscribe a workflow to all errors through the `$errors` channel, instead of handling each error individually.

:::

### Automatically retrying an HTTP request

You can leverage `$.flow.rerun` within a `try...catch` block in order to retry a failed API request.

[See the example in the `$.flow.rerun` docs](/code/nodejs/rerun/#pause-resume-and-rerun-a-workflow) for Node.js.
