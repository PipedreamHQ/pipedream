# Using AI to generate code
![Introducing Pi](https://res.cloudinary.com/pipedreamin/image/upload/c_scale,w_425/v1685134013/image_5_yppihx.png)

_**Introducing Pi** — the helpful Pipedream AI Bot!_

<BetaFeatureNotice feature="Enable AI Code Generation in the Builder" />

You can now harness the power of AI to generate code from English, directly in the Pipedream workflow builder.

[Built-in actions](/workflows/steps/actions/) are great for enabling access to common API operations without having to write basic code, but sometimes the actions available in Pipedream may not exactly solve your use case and you might not want to write the code yourself.

This feature is new and [your feedback](https://pipedream.com/support) is crucial in helping improve the output and usefulness!

## Getting Started
<!-- <div>
<img alt="Use AI with the Slack API" width="700px" src="https://res.cloudinary.com/pipedreamin/image/upload/v1685130847/docs/generate-code-with-ai_kcsbvr.gif">
</div> -->
![Use AI with the Slack API](https://res.cloudinary.com/pipedreamin/image/upload/v1685130847/docs/generate-code-with-ai_kcsbvr.gif)

<br>

**[Enable the feature flag,](https://pipedream.com/user/alpha)** then open any workflow, and access the feature either from within a Node.js code cell or from any app in the step selector.

<!-- <div>
<img alt="Use AI with the Slack API" width="700px" src="https://res.cloudinary.com/pipedreamin/image/upload/v1685132186/docs/docs/Screenshot_2023-05-26_at_1.15.14_PM_c4p2qw.png">
</div> -->
![Use AI with the Slack API](https://res.cloudinary.com/pipedreamin/image/upload/v1685132186/docs/docs/Screenshot_2023-05-26_at_1.15.14_PM_c4p2qw.png)

Enter your prompt: a window should pop up and ask for your prompt. Write exactly what you want to do within that step and hit enter or click "Generate". See below for best practices and tips for generating good responses.

Code will immediately start streaming back from Pi, and you can re-generate the code if it doesn't quite look right or click "Use this code" to insert it into the code cell to test it.

We’ll automatically refresh the step to show connected accounts and any input fields (props) above the step. 

<!-- <div>
<img alt="AI-generated code for Slack" width="600px" src="https://res.cloudinary.com/pipedreamin/image/upload/v1685130847/docs/ai-generated-code_uzsr8q.png">
</div> -->
![AI-generated code for Slack](https://res.cloudinary.com/pipedreamin/image/upload/v1685130847/docs/ai-generated-code_uzsr8q.png)

Edit the code however you’d like. Once you’re done, test the code. You’ll see the option to provide a :+1: or :-1: on the code, which helps us learn what’s working and what’s not.

## Tips for getting good results
**This feature works best with clear, precise, and detailed instructions of what you want to do in your step.**

### Examples

**Using the Slack app:**
>Send a message to the #general channel that says, "This message was sent with AI-generate code!" Format it as a Slack block, with a header named, "Hello, world!"

**Code output:**
```javascript
import { axios } from "@pipedream/platform";

export default defineComponent({
  props: {
    slack: {
      type: "app",
      app: "slack",
    },
  },
  async run({ steps, $ }) {
    return await axios($, {
      method: "POST",
      url: `https://slack.com/api/chat.postMessage`,
      headers: {
        Authorization: `Bearer ${this.slack.$auth.oauth_access_token}`,
      },
      data: {
        channel: "#general",
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "Hello, world!",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "This message was sent with AI-generated code!",
            },
          },
        ],
      },
    });
  },
});
```

Another example, this time **using Stripe**:
>Get the subscription information about a specific customer based on their email address

**Code Output:**

```javascript
import { axios } from "@pipedream/platform";

export default defineComponent({
  props: {
    stripe: {
      type: "app",
      app: "stripe",
    },
    email: {
      type: "string",
      label: "Email Address",
      description: "The email address of the customer to get subscription information for",
    },
  },
  async run({ steps, $ }) {
    const customerResponse = await axios($, {
      method: "GET",
      url: `https://api.stripe.com/v1/customers`,
      headers: {
        Authorization: `Bearer ${this.stripe.$auth.api_key}`,
      },
      params: {
        email: this.email,
      },
    });

    if (customerResponse.data.length === 0) {
      throw new Error("Customer not found");
    }

    const customerId = customerResponse.data[0].id;

    return await axios($, {
      method: "GET",
      url: `https://api.stripe.com/v1/subscriptions`,
      headers: {
        Authorization: `Bearer ${this.stripe.$auth.api_key}`,
      },
      params: {
        customer: customerId,
      },
    });
  },
});
```

## Current limitations of the AI Bot
- Currently only supports actions and not triggers
- Only supports Node.js output
- It supports single steps, and not entire workflows
