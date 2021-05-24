# Use any npm package

Next, we'll replace the **GET request** action with a code step that uses the `axios` npm package.

This example will take **2 - 3 minutes** and will cover how to:

- Delete a step
- Use an npm pacakge in a code step

First, delete `steps.get_request` by clicking the **X** buttton at the top right of the step.

![image-20210516212047297](../images/image-20210516212047297.png)

Next, click the **+** button and add a **Run Node.js code** step between `steps.trigger` and `steps.nodejs`. Pipedream will add a new step called `steps.nodejs_1`:

![image-20210516212506585](../images/image-20210516212506585.png)

Next, `require` the `axios` npm package in `steps.nodejs_1` — there's no `npm install` or `package.json` required. Pipedream will automatically install any npm packages you `require`.

```javascript
const axios = require('axios')
```

Next, use `axios` to make a `GET` request to the open-notify.org API to get the latest position of the ISS (when writing code, remember to `await` all promises):

```javascript
const response = await axios({
  method: "GET",
  url: "http://api.open-notify.org/iss-now.json"
})
```

Finally, `return` the API response to export it from the step (only exported data can be inspected in the builder and be referenced in later workflow steps). The data we want to export is in the `data` key of the the `axios` response:

```javascript
return response.data
```

Following is the complete code:

```javascript
const axios = require('axios')

const response = await axios({
  method: "GET",
  url: "http://api.open-notify.org/iss-now.json"
})

return response.data
```

Finally, rename our step from `steps.nodejs_1` to `steps.get_request` so you don't need to modify the last step of the workflow (which refrences `steps.get_request.$return_value`). Your workflow should now look like this:

![image-20210516213201525](../images/image-20210516213201525.png)

Next, **Deploy** your changes and load the endpoint URL in your browser again. You should continue to see the ISS position returned. Return to your workflow and select the event that corresponds with your most recent test. You should see your `steps.get_request` code step output the ISS position similar to the **GET Request** action you just replaced.

![image-20210516213527109](../images/image-20210516213527109.png)

**Next, we'll transform data returned by the ISS API and save it to Google Sheets.** [Take me to the next example &rarr;](../add-data-to-google-sheets/) 