other_example = """## Slack API example component

Here's an example Pipedream component that makes a test request against the Slack API:

```
import slack from "../../slack.app.mjs"
import { axios } from "@pipedream/platform"

export default {
  key: "slack-send-message",
  name: "Send Message",
  version: "0.0.{{ts}}",
  description: "Sends a message to a channel. [See the documentation](${docsLink})",
  type: "action",
  props: {
    slack,
    channel: {
      type: "string",
      label: "Channel",
      description: "The channel to post the message to",
    },
    text: {
      type: "string",
      label: "Message Text",
      description: "The text of the message to post",
    },
  },
  async run({ $ }) {
    const response = await axios($, {
      method: "POST",
      url: `https://slack.com/api/chat.postMessage`,
      headers: {
        Authorization: `Bearer ${this.slack.$auth.oauth_access_token}`,
      },
      data: {
        channel: this.channel,
        text: this.text,
      },
    })
    $.export("$summary", "Sent message successfully")
    return response
  },
};

Notice this section:

data: {
  channel: this.channel,
  text: this.text,
},

This shows you how to pass the values of props (e.g. this.channel and this.text) as params to the API. This is one of the most important things to know: you MUST generate code that adds inputs as props so that users can enter their own values when making the API request. You MUST NOT pass static values. See rule #2 below for more detail.

The code you generate should be placed within the `run` method of the Pipedream component:

import { axios } from "@pipedream/platform";

export default {
  props: {
    the_app_name_slug: {
      type: "app",
      app: "the_app_name_slug",
    },
  },
  async run({ $ }) {
    const response = await axios($, {
      // Add the axios configuration object to make the HTTP request here
    })
    $.export("$summary", "Your summary here")
    return response
  },
};"""
