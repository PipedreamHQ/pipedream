# Make outbound HTTP requests

In the previous examples, we focused on catching inbound HTTP requests and manipulating the workflow response. Next, let's add an action step to make an outbound request from our workflow. This example builds on the workflow created in [previous sections](/quickstart/) and will cover how to:

[[toc]]

### Use a pre-built action to make an HTTP request from your workflow

First, click on the **+** sign between the trigger and code steps to add a step.

![image-20210525171237467](./image-20210525171237467.png)

Next, click on the **HTTP / Webhook** app:

![image-20210525171326688](./image-20210525171326688.png)

Then select **GET Request** (to make an HTTP `GET` request):

![image-20210525171411902](./image-20210525171411902.png)

Next, enter `http://api.open-notify.org/iss-now.json` in the **URL** field. This URL is a free API provided by open-notify.org  to return the current position of the International Space Station (ISS). It does not require any authentication.

![image-20210525171518303](./image-20210525171518303.png)

Then, update the step name from `steps.get_request` to `steps.get_iss_position`.

![get_iss_position](./get_iss_position.gif)

Finally, click **Deploy** and then hit the **Send Test Event** button in the trigger to run the workflow so we can test our change (we don't need to make a live request from our web browser since we're not validating the workflow response with this test).

![image-20210525171621793](./image-20210525171621793.png)

### Inspect the exports for the action step

Select the new event from the event list to inspect the execution. The response from the **GET Request** action should be exported as `steps.get_iss_position.$return_value`. Expand the `iss_position` key to inspect the `lattitude` and `longitude` returned by the API. If you run the workflow again, you'll see the position change for each execution:

![image-20210525171711647](./image-20210525171711647.png)

### Use data exported by the action in the workflow response

Next, let's update `$respond()` in `steps.respond` to return `steps.get_iss_position.$return_value.iss_position` as the body of the workflow response:

```javascript
await $respond({
  status: 200,
  immediate: true,
  body: steps.get_iss_position.$return_value.iss_position
})
```

![image-20210525171805160](./image-20210525171805160.png)

Finally, **Deploy** and reload the endpoint for your workflow in your web browser. `hello foo!` should be replaced by the JSON representing the ISS position. Each time you load the endpoint the most recent position will be returned.

![get-iss-position](./get-iss-position.gif)

**Next, let's replace the GET Request action with a code step and use the `axios` npm package to get the position of the ISS.** [Take me to the next example &rarr;](../using-npm-packages/) 

