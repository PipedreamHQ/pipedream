# 3. Make outbound HTTP requests

So far, we've focused on catching inbound HTTP requests and manipulating the response. Next, let's review how easy it is to make an outbound HTTP request from a workflow. 

For this example, we'll continue to modify the same workflow as in the previous examples. Click on the **+** sign between the trigger and code steps to bring up the menu to add a step.

![image-20210516204038767](../images/image-20210516204038767.png)

Next, click on the **HTTP / Webhook** app:

![image-20210516204148639](../images/image-20210516204148639.png)

Then select **GET Request** (to make an HTTP GET request):

![image-20210516204229156](../images/image-20210516204229156.png)

Next, enter `http://api.open-notify.org/iss-now.json` as the URL. This URL is a free API provided by http://open-notify.org  to return the current position of the International Space Station (ISS). It does not require any authentication to use it.

![image-20210516210136157](../images/image-20210516210136157.png)

Finally, click **Deploy** and then hit the **Send Test Event** button in the trigger to run the workflow so we can test our change.

![image-20210516210434021](../images/image-20210516210434021.png)

Select the event that's generated on the in the event list to inspect the execution. The response from the URL is exported from the step as `$return_value` and can be inspected and referenced in future steps. Expand the `iss_position` key to see the `lattitude` and `longitude` returned by the API. If you run the workflow again, you'll see the position change for each execution

![image-20210516210735882](../images/image-20210516210735882.png)

Next, let's update the code step with our custom response and replace `hello ${steps.trigger.event.query.name}!` with the `lattitude` and `longitude` returned by the API. To do that, we'll set body to `steps.get_request.$return_value.iss_position` (with no quotes or backticks):

```javascript
await $respond({
  status: 200,
  immediate: true,
  body: steps.get_request.$return_value.iss_position
})
```

![image-20210516211333394](../images/image-20210516211333394.png)

Finally, click **Deploy** and then reload the URL in your web browser.`hello foo!` should be replaced by the JSON representing the ISS position. Each time you load the URL, the updated position will be returned.

![image-20210516211633575](../images/image-20210516211633575.png)

