# Quickstart

Sign up for a [free Pipedream account (no credit card required)](https://pipedream.com/auth/signup) and complete this quickstart guide to learn the basic patterns for workflow development:

[[toc]]

### Create a new workflow

First, create a new workflow by clicking **New** from [https://pipedream.com/workflows](https://pipedream.com/workflows):

![image-20210516114638660](https://pipedream.com/docs/assets/img/image-20210516114638660.739caab0.png)

### Add an HTTP / Webhook trigger

Pipedream will launch the workflow builder. For this example, select the **HTTP / Webhook Requests** trigger. 

![./image-20220123213843066](./image-20220123213843066.png)

Click **Continue** to accept the default settings.

![./image-20220123214244795](./image-20220123214244795.png)

Pipedream will generate a unique URL to trigger this workflow.

![./image-20220123214505923](./image-20220123214505923.png)

### Send data to the workflow

Next, send data to the trigger URL to help you build the workflow. For this example, send an HTTP POST request with a JSON body containing a simple message.

```json
{
  "message": "Pipedream is awesome!"
}
```

You can edit and run the following cURL command or use your favorite app (like Postman or Hoppscotch).

```bash
curl -d '{
  "message": "Pipedream is awesome!"
}'   -H "Content-Type: application/json"   YOUR-TRIGGER-URL-GOES-HERE
```

When Pipedream receives the request, it will display the contents of the HTTP request. Expand the `body` to validate that the message was received. ![./image-20220123215443936](./image-20220123215443936.png)

If you need to send a different event to your workflow you can select it from the event selector:

![./image-20220123215558412](./image-20220123215558412.png)

::: tip

The selected event will be used to provide autocomplete suggestion as you build your workflow. The data will also be used when testing later steps.

:::

### Enrich trigger data using Node.js and npm

Before we send data to Google Sheets, let's use the npm [`sentiment`](https://www.npmjs.com/package/sentiment) package to generate a sentiment score for our message. To do that, click **Continue** or the **+** button.

![./image-20220123220018170](./image-20220123220018170.png)

That will open the **Add a step** menu. Select **Run custom code**.

![./image-20220123220128877](./image-20220123220128877.png) 

Pipedream will add a Node.js code step. Rename the step to **sentiment**.

![image-20220123221849231](./image-20220123221849231.png) 

Next, add the following code to the code step:

```javascript
import Sentiment from "sentiment"

export default defineComponent({
  async run({ steps, $ }) {
    let sentiment = new Sentiment()
    return sentiment.analyze(steps.trigger.event.body.message)
  },
})
```

This code imports the npm package, passes the message we sent to our trigger to the `analyze()` function by referencing `steps.trigger.event.body.message` and then returns the result. 

::: tip

To use any npm package on Pipedream, just `import` it. There's no `npm install` or `package.json` required.

:::

::: tip

Any data you `return`  from a step is exported so it can be inspected and referenceed it in future steps via the `steps` object. In this example, return values will be exported to `steps.sentiment.$return_value` because we renamed the step to **sentiment** .

::: 

Your code step should now look like this. To run the step and test the code, click the **Test** button.

![image-20220123222340361](./image-20220123222340361.png)

You should see the results of the sentiment analysis when the test is complete.

![image-20220123222643042](./image-20220123222643042.png)

::: tip

When you **Test** a step, only the current step is executed. Use the caret to test different ranges of steps including the entire workflow.

::: 

### Save data to Google Sheets
