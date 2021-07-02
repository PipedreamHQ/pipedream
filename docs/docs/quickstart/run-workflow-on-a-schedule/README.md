# Run workflow on a schedule

Next, let's run a workflow on a schedule to keep our HTTP triggered workflow "warm" ([learn more](https://pipedream.com/docs/workflows/events/cold-starts/) about "cold starts" and the value of keeping workflows "warm"). **Note:** Most use cases do not require keeping a workflow "warm" — we're using the example to demonstrate how to use the **Schedule** trigger. This example builds on the workflow created in [previous sections](/quickstart/) and will cover how to:

[[toc]]

::: tip
If you didn't complete the previous examples, we recommend you start from the [beginning of this guide](/quickstart/). If you still want to start here, [copy this workflow](https://pipedream.com/@gettingstarted/quickstart-use-connected-accounts-in-code-p_ezCVLgy) and then follow the instructions below. If you have any issues completing this example, you can view, copy and run completed versions: [Scheduled Workflow](https://pipedream.com/@gettingstarted/quickstart-run-workflow-on-a-schedule-1-2-p_n1Co22e), [Updated HTTP Triggered Workflow](https://pipedream.com/@gettingstarted/quickstart-run-workflow-on-a-schedule-2-2-p_NMCBZZ7).
:::

### Create a workflow using the schedule trigger

First, create a new workflow. Then name it `Schedule Quickstart` and select the **Schedule** trigger (we'll modify the HTTP triggered workflow in a moment, **so we recommend creating this workflow in a separate tab**):

![image-20210525190912450](./images/image-20210525190912450.png)

Next, expand the step menu and select the **GET Request** action in the **HTTP / Webhook** app.

![image-20210525190953091](./images/image-20210525190953091.png)

Enter the endpoint URL to trigger the workflow you built in the previous examples and add `/keepwarm` to the path (e.g., `https://YOUR-ENDPOINT-ID.m.pipedream.net/keepwarm`).

![image-20210525191155803](./images/image-20210525191155803.png)

### Test a scheduled workflow

Next, **Deploy** and click **Run Now** to test your workflow.

![image-20210525191406036](./images/image-20210525191406036.png)

When you inspect the execution, you'll notice that `steps.get_request` returned an array of objects. That means the HTTP workflow ran end-to-end — including getting the latest ISS position and adding it to Google Sheets:

![image-20210525191520789](./images/image-20210525191520789.png)

However, we don't want that to happen on our `/keepwarm` invocations. Let's fix that by adding a `$end()` statement to the HTTP workflow. 

Switch back to your HTTP triggered workflow, select the most recent event and expand `steps.trigger.raw_event`. The `uri` for the request should be `/keepwarm`. 

![image-20210525191622270](./images/image-20210525191622270.png)

Let's use that field for our filter. When requests are made to the `/keepwarm` path, let's respond with an HTTP `204` no content response and end the workflow invocation.

```javascript
if(steps.trigger.raw_event.uri === '/keepwarm') {
  await $respond({
    status: 204,
    immediate: true,
  })
  $end("/keepwarm invocation")
}
```

![image-20210525191725278](./images/image-20210525191725278.png)

**Deploy** the HTTP workflow, return to the scheduled workflow and click **Run Now** again. This time, no content should be returned from `steps.get_request`:

![image-20210525191829397](./images/image-20210525191829397.png)

If you check the HTTP workflow, you should see the workflow execution ended at `steps.filter_keepwarm`:

![image-20210525191854260](./images/image-20210525191854260.png)

### Configure a schedule

Finally, return to the scheduled workflow, configure it to run every 15 minutes, and **Deploy** to update trigger configuration:

![image-20210525191935400](./images/image-20210525191935400.png)

Your scheduled workflow will now run every 15 minutes — 24 hours a day, 7 days a week.

**Next, we'll create a workflow using an app trigger to run a workflow every time there is a new item in an RSS feed.**

<p style="text-align:center;">
<a :href="$withBase('/quickstart/email-yourself/')"><img src="../next.png"></a>
</p>