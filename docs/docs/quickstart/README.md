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

You can edit and run the following `cURL` command (or use your favorite HTTP tool).

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
Any data you `return` from a step is exported so it can be inspected and referenced it in future steps via the `steps` object. In this example, return values will be exported to `steps.sentiment.$return_value` because we renamed the step to **sentiment** .
::: 

Your code step should now look like the screenshot below. To run the step and test the code, click the **Test** button.

![image-20220123222340361](./image-20220123222340361.png)

You should see the results of the sentiment analysis when the test is complete.

![image-20220123222643042](./image-20220123222643042.png)

::: tip

When you **Test** a step, only the current step is executed. Use the caret to test different ranges of steps including the entire workflow.

::: 

### Save data to Google Sheets

Next, create a Google Sheet and add **Timestamp**, **Message** and **Sentiment Score** to the first row. These labels will act as our column headers amd will help us configure the Google Sheets step of the workflow. 

![image-20220125184754078](./image-20220125184754078.png)

Next, let's add a step to the workflow to send the data to Google Sheets. First, click **+** after the `sentiment` code step and select the **Google Sheets** app.

![image-20220125185156527](./image-20220125185156527.png)

Then select the **Add Single Row** action.

![image-20220125185305043](./image-20220125185305043.png)

Click to connect you Google Sheets account to Pipedream (or select it from the dropdown if you previously connected an account).

![image-20220125185354469](./image-20220125185354469.png)

Pipedream will open Google's sign in flow in a new window. Sign in with the account you want to connect.

<img src="./image-20220125185544800.png" alt="image-20220125185544800" style="zoom: 33%;" />

::: warning Important

If prompted, you must check the box for Pipedream to **See, edit, create and delete all of your Google Drive files**. These permissions are required for configure and use the pre-built actions for Google Sheets.

<img src="./image-20220125185952120.png" alt="image-20220125185952120" style="zoom:33%;" />

Learn more about Pipedream's [privacy and security policy](/privacy-and-security/).

::: 

When you complete connecting your Google account, the window should close and you should return to Pipedream. Your connected account should automatically be selected. Next, select your spreadsheet from the dropdown menu:

![image-20220125190643112](./image-20220125190643112.png)

Then select the sheet name (the default sheet name in Google Sheets is **Sheet1**):

![image-20220125190740937](./image-20220125190740937.png)

Next, select if the spreadsheet has headers in the first row. When a header row exists, Pipedream will automatically retrieve the header labels to make it easy to enter data (if not, you can manually construct an array of values). Since the sheet for this example contains headers, select **Yes**.

![image-20220125191025880](./image-20220125191025880.png)

Pipedream will retrieve the headers and generate a form to enter data in your sheet:

![image-20220125191155907](./image-20220125191155907.png)

First, let's use the object explorer to pass the timestamp for the workflow event as the value for the first column. This data can be found in the context object on the trigger. When you click into the **Timestamp** field, Pipedream will display an object explorer to make it easy to find data. Scroll or search to find the `ts` key under `steps.trigger.context` and click **select path**. That will insert the reference <code v-pre>{{steps.trigger.context.ts}}</code>:

![image-20220125191627775](./image-20220125191627775.png)

Next, let's use autocomplete to enter a value for the **Message** column. First, add double braces `{{` — Pipedream will automatically add the closing braces `}}`. Then, type `steps.trigger.event.body.message` between the pairs of braces. Pipedream will provide autocomplete suggestions as you type. Press **Tab**  to use a suggestion and then click `.` to get suggestions for the next key. The final value in the **Message** field should be <code v-pre>{{steps.trigger.event.body.message}}</code>.

![image-20220125191907876](./image-20220125191907876.png)

Finally, let's copy a reference from a previous step. Scroll up to the `sentiment` step and click the **Copy Path** link next to the score. 

![image-20220125192301634](./image-20220125192301634.png)

Paste the value into the **Sentiment Score** field — Pipedream will automatically wrap the reference in double braces <code v-pre>{{ }}</code>.

![image-20220125192410390](./image-20220125192410390.png)

Now that the configuration is complete, click **Test** to validate the configuration for this step. When the test is complete, you will see a success message and a summary of the action performed:

![image-20220125192709058](./image-20220125192709058.png)

If you load your spreadsheet, you should see the data Pipedream inserted.

![image-20220125192818879](./image-20220125192818879.png)

Next, return to your workflow. Before you deploy, customize the name of your workflow:

![image-20220125193340378](./image-20220125193340378.png)

Then click **Deploy** to run your workflow on every trigger event.

![image-20220125200445675](./image-20220125200445675.png)

When your workflow deploys, you will be redirected to the **Inspector**. Your workflow is now live. 

![image-20220125193507453](./image-20220125193507453.png)

To validate your workflow is working as expected, send a new request to your workflow: You can edit and run the following `cURL` command:

```bash
curl -d '{
  "message": "Wow!!! Pipedream IS awesome and easy to use!!!"
}'   -H "Content-Type: application/json"   YOUR-TRIGGER-URL-GOES-HERE
```

The event will instantly appear in the event list. Select it to inspect the workflow execution.

![image-20220125194354113](./image-20220125194354113.png)

Finally, you can return to Google Sheets to validate that the new data was automatically inserted.

![image-20220125194510308](./image-20220125194510308.png) 

Congratulations! You completed the quickstart and should now understand the basic patterns for workflow development. Next, try creating your own workflows and check out the docs to learn more!
