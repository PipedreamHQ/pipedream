# End workflow early

For the next example, we'll:

Workflows typically run until they reach the last step. However, there are cases when we want to end the workflow execution early, and not continue on with additional steps.

Pipedream provides an easy way to do that using the `$end()` function.

In our last example, two rows were added to Google Sheets when we loaded the endpoint URL in our browser. That's because modern web browsers make a request for a favicon. While this is an artifact because we loaded the URL in our browser, it provides a good opportunity to demonstrate `$end()`.

First, select an event that lists the request for `favicon.ico`:

![image-20210522191836155](./image-20210522191836155.png)

Next, add a **Run Node.js code** step immediately after the trigger and change the name from `steps.nodejs` to `steps.filter_favicon_requests`. Then let's add code to conditionally end the workflow execution if the request URL contains the text `favicon.ico`. We can also pass a reason for ending the execution to the `$end()` function as a string. For this example, we'll pass the value `favicon.ico request`.

```javascript
if(steps.trigger.event.url.includes('favicon.ico')) {
  $end("favicon.ico request")
}
```

Your workflow should look like this:

![image-20210522192422418](./image-20210522192422418.png)

Next, **Deploy** your workflow and load the endpoint URL in your browser. While 2 events will still appear in the event list, you'll see that one of them indicates that `$end()` was invoked along with the reason we defined. Additionally, no steps after `steps.filter_favicon_requests` were executed.

![image-20210522192712379](./image-20210522192712379.png)

Finally, if you select the event that was not ended early, you will see it successfully executed. And when you load Google Sheets, you should only see a single new row added:

![image-20210522192945948](./image-20210522192945948.png)

Additionally, the data for that row should match the data returned to your endpoint.

![image-20210522192856091](./image-20210522192856091.png)
