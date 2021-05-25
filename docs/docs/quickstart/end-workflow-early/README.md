# End workflow early

Next, let's update our workflow to filter out `favicon.ico` requests. This example builds on the workflow created in [previous sections](/quickstart/hello-world/) and will cover how to use the `$end()` function to end a workflow execution early.

In the last example, two rows were added to Google Sheets when we loaded the endpoint URL in our browser. That's because modern web browsers automatically make a request for a `favicon.com` file. While this is an artifact of loading the workflow's endpoint in our browser, it provides a good opportunity to demonstrate `$end()`.

First, select an event that represents a `favicon.ico` request:

![image-20210522191836155](./image-20210522191836155.png)

Next, add a **Run Node.js code** step immediately after the trigger and change the name from `steps.nodejs` to `steps.filter_favicon_requests`. Then add code to conditionally end the workflow execution if the request URL contains the string `favicon.ico`. We can also pass a reason for ending the execution to the `$end()` function. For this example, we'll pass the value `favicon.ico request`.

```javascript
if(steps.trigger.event.url.includes('favicon.ico')) {
  $end("favicon.ico request")
}
```

![image-20210522192422418](./image-20210522192422418.png)

Next, **Deploy** your workflow and load the endpoint URL in your browser to trigger your workflow. While 2 events will still appear in the event list, you'll see that one of them indicates that `$end()` was invoked along with the reason we defined. Additionally, no steps after `steps.filter_favicon_requests` were executed.

![image-20210522192712379](./image-20210522192712379.png)

Finally, if you select the event that did **not** invoke `$end()`, you will see it successfully executed. And when you load Google Sheets, you should only see a single new row added:

![image-20210522192945948](./image-20210522192945948.png)

Additionally, the data for that row should match the data returned to your endpoint.

![image-20210522192856091](./image-20210522192856091.png)

**Next, let's use a connected account in a code step to authenticate a Google Sheets API request. [Take me to the next example &rarr;](../use-managed-auth-in-code/)**
