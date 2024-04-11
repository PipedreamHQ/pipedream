# Overview

Build, test, and send HTTP requests without code using your Pipedream workflows. The HTTP / Webhook action is a tool to build HTTP requests with a Postman-like graphical interface.

![An interface for configuring an HTTP request within Pipedream's workflow system. The current selection is a GET request with fields for the request URL, authorization type (set to 'None' with a note explaining "This request does not use authorization"), parameters, headers (with a count of 1, though the detail is not visible), and body. Below the main configuration area is an option to "Include Response Headers," and a button labeled "Configure to test." The overall layout suggests a user-friendly, no-code approach to setting up custom HTTP requests.](https://res.cloudinary.com/pipedreamin/image/upload/v1712765140/marketplace/apps/http/CleanShot_2024-04-10_at_11.53.07_u5anis.png)

## Point and click HTTP requests

Define the target URL, HTTP verb, headers, query parameters, and payload body without writing custom code.

![A screenshot of Pipedream's HTTP Request Configuration interface with a GET request type selected. The request URL is set to 'https://api.openai.com/v1/models'. The 'Auth' tab is highlighted, indicating that authentication is required for this request. In the headers section, there are two headers configured: 'User-Agent' is set to 'pipedream/1', and 'Authorization' is set to 'Bearer {{openai_api_key}}', showing how the OpenAI account's API key is dynamically inserted into the headers to handle authentication automatically.](https://res.cloudinary.com/pipedreamin/image/upload/v1712765340/marketplace/apps/http/CleanShot_2024-04-10_at_12.08.25_ab89hj.png)

[Here's an example workflow that uses the HTTP / Webhook action to send an authenticated API request to OpenAI.](https://pipedream.com/new?h=tch_v4fzLp)

## Focus on integrating, not authenticating

This action can also use your connected accounts with third-party APIs. Selecting an integrated app will automatically update the request’s headers to authenticate with the app properly, and even inject your token dynamically. 

![This GIF depicts the process of selecting an application within Pipedream's HTTP Request Builder. A user hovers the cursor over the 'Auth' tab and clicks on a dropdown menu labeled 'Authorization Type', then scrolls through a list of applications to choose from for authorization purposes. The interface provides a streamlined and intuitive method for users to authenticate their HTTP requests by selecting the relevant app in the configuration settings.](https://res.cloudinary.com/pipedreamin/image/upload/v1712765587/marketplace/apps/http/CleanShot_2024-04-10_at_12.12.34_e6zrft.gif)

Pipedream integrates with thousands of APIs, but if you can’t find a Pipedream integration simply use [Environment Variables](https://pipedream.com/docs/environment-variables) in your request headers to authenticate with.

## Compatible with no code actions or Node.js and Python

The HTTP/Webhook action exports HTTP response data for use in subsequent workflow steps, enabling easy data transformation, further API calls, database storage, and more.

Response data is available for both coded (Node.js, Python) and no-code steps within your workflow.

![An image showing the Pipedream interface where the HTTP Webhook action has returned response data as a step export. The interface highlights a structured view of the returned data with collapsible sections. We can see 'steps.custom_request1' expanded to show 'return_value' which is an object containing a 'list'. Inside the list, an item 'data' is expanded to reveal an element with an 'id' of 'whisper-1', indicating a model created by and owned by 'openai-internal'. Options to 'Copy Path' and 'Copy Value' are available for easy access to the data points.](https://res.cloudinary.com/pipedreamin/image/upload/v1712765724/marketplace/apps/http/CleanShot_2024-04-10_at_12.15.11_mkezj8.png)

# Getting Started

The HTTP / Webhook action is flexible. You can use it with your [Pipedream connected accounts](https://pipedream.com/docs/connected-accounts), import cURL commands, or manually define authentication headers with API keys stored in [Environment Variables](https://pipedream.com/docs/environment-variables).

## Connecting to an API with a Pipedream connected account

We recommend choosing this approach to authenticate your HTTP requests. Pipedream will manage your connected accounts, even rotating OAuth tokens, and you can focus on implementing the payload details.

Start by adding the HTTP/Webhook action as a new step in your workflow.

![The image displays a user interface within Pipedream's workflow editor. On the left sidebar, under "Apps," various application options are listed, including Node, Python, OpenAI (ChatGPT), and others, each with a number indicating available actions. A red arrow points to the "HTTP / Webhook" option, which is highlighted and shows that there are 10 actions available for it. On the right, a panel titled "Actions → Popular" lists options such as "Build API Request," "Run custom code," and others, suggesting these are commonly used or recommended actions for building workflows. The overall design of the interface emphasizes user-friendliness and ease of navigation.](https://res.cloudinary.com/pipedreamin/image/upload/v1712765837/marketplace/apps/http/CleanShot_2024-04-10_at_12.16.59_y1mu9t.png)

Then select Use app to search for the API you’d like to send this HTTP request to. Then use 'Select App' to find and choose the API for your HTTP request:

![The image shows a close-up of the HTTP Request Configuration pane in Pipedream's interface, focusing on the 'Auth' tab. A red arrow points to the 'Authorization Type' dropdown menu, which is expanded to show different authentication types including 'None', 'Basic Auth', 'Bearer Token', and highlighted is the 'Select an app' option. This demonstrates the step where a user can select the type of authorization for their HTTP request, with the option to easily choose an app for integrated authentication.](https://res.cloudinary.com/pipedreamin/image/upload/v1712766063/marketplace/apps/http/CleanShot_2024-04-10_at_12.20.36_kr51sx.png)

Then connect your account, if the app has OAuth then Pipedream will initiate the OAuth sequence and automatically rotate your tokens for you.

After connecting your account, the URL, verb, and headers update to enable a valid authenticated request.

Then click **Test** to send the HTTP request:

![The image displays the Pipedream HTTP Request Configuration panel with a GET method selected and the request URL 'https://api.openai.com/v1/models' entered. Two headers are configured: 'User-Agent' with the value 'pipedream/1' and 'Authorization' with a dynamic variable 'Bearer {{openai_api_key}}' to automatically insert the OpenAI API key. A red arrow points towards the 'Authorization' header field, emphasizing the insertion of the API key. Below the headers, there's an option to 'Include Response Headers', and at the bottom, there's a 'Test' button to send the HTTP request.](https://res.cloudinary.com/pipedreamin/image/upload/v1712766296/marketplace/apps/http/CleanShot_2024-04-10_at_12.24.25_f9ne9h.png)


In the **Exports** tab, you’ll see the data the API responds with. You can click Copy Path next to an attribute to copy the path to that specific variable to your clipboard for easy pasting in other steps.

![The image shows a section of the Pipedream workflow interface under the 'Exports' tab. It details the output of a custom HTTP request step labeled 'steps.custom_request1'. The output, named '$return_value', is an object represented as a list. The list is expanded to reveal 'data' with 30 entries. The first entry is further expanded, displaying details of a model with the ID 'whisper-1', indicating it's an object called 'model' that was created at the UNIX timestamp '1677532384' and is owned by 'openai-internal'.](https://res.cloudinary.com/pipedreamin/image/upload/v1712766450/marketplace/apps/http/CleanShot_2024-04-10_at_12.27.19_xr9kyp.gif)

### Connecting to an API with an imported cURL command

API documentation sometimes include cURL commands as examples. The HTTP request builder action can recognize cURL and update your request configuration to match.

For example, the OpenAI documentation includes an example cURL command to send a prompt to ChatGPT:

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful assistant."
      },
      {
        "role": "user",
        "content": "Hello!"
      }
    ]
  }'
```

Configure the HTTP request to match this cURL command by clicking *Import cURL*:

![The image shows a segment of the Pipedream HTTP Request Configuration interface, where the 'GET' method is selected as the type of HTTP request. A red arrow points towards the 'Import cURL' button located in the top right corner, indicating where users can click to import a cURL command into the workflow for configuration. The 'Enter request URL' field is highlighted, awaiting the user's input. Additionally, tabs for 'Auth', 'Params', 'Headers', and 'Body' are visible, with a notation that there is one header set. The 'Configure' label at the top indicates the setup process is 'Incomplete'.](https://res.cloudinary.com/pipedreamin/image/upload/v1712767353/marketplace/apps/http/CleanShot_2024-04-10_at_12.42.18_ula7yc.png)

Then paste in the cURL command and click *Import*:

![The image shows a dialog box titled "Import Curl" within Pipedream's interface, where a cURL command is ready to be imported. The cURL command includes the API endpoint 'https://api.openai.com/v1/chat/completions', headers for 'Content-Type' and 'Authorization', and a JSON payload specifying a model 'gpt-3.5-turbo' with a series of messages. A red arrow points towards the 'IMPORT' button, indicating that clicking this will import the cURL command into the Pipedream workflow. The 'CANCEL' button is also visible for opting not to proceed with the import.](https://res.cloudinary.com/pipedreamin/image/upload/v1712767458/marketplace/apps/http/CleanShot_2024-04-10_at_12.44.02_xjufrs.png)

This will configure the HTTP request to match the details of the cURL statement:

![The image is a screenshot of the Pipedream HTTP Request Configuration panel after importing a cURL command. It displays a filled-out form with a GET request set to the URL 'https://api.openai.com/v1/chat/completions'. The 'Auth' tab is highlighted, indicating that authentication has been configured. The 'Headers' tab shows '3' indicating multiple headers have been set, including 'Content-Type' with the value 'application/json'. The 'Body' tab is active, showing 'model' set to 'gpt-3.5-turbo' and 'messages' containing a JSON array with two objects, each specifying a 'role' and 'content', indicating the structure of the data to be sent with the request.](https://res.cloudinary.com/pipedreamin/image/upload/v1712767841/marketplace/apps/http/CleanShot_2024-04-10_at_12.50.29_ia5ago.png)

Don't forget to inject your API keys into the headers. We recommend using [Environment Variables](https://pipedream.com/docs/environment-variables) to store your non-Pipedream managed account API keys.

For example, storing your OpenAI API key as `OPEN_API_KEY` you can then reference it in the `Authorization` header like so:

```
{{ process.env["OPEN_API_KEY"] }}
```

Then your key will be injected into the request.

# Troubleshooting

You may run into issues integrating with other APIs. Typically these are errors thrown by the API you’re attempting to integrate with.

Common HTTP status codes provide a standard, but implementations may vary. Please check the API documentation for the service or app you’re integrating with for more details.

Below are a list of common errors when sending HTTP requests to 3rd party APIs:

## Resource Not Found (404)

This means that the API request successfully authenticated, but the resource you’re attempting to retrieve or act on doesn’t exist.

For example, if you’re attempting to update a Google Sheet but that sheet has been deleted, then you’ll see a 404 HTTP status code.

## Method not allowed (405)

This error message means that you attempted to access an endpoint but the HTTP verb the request is using isn’t supported.

For example, you might have sent a `GET` request instead of a `POST` request or vice versa. This error is usually fixed by double checking that the HTTP action the request is configured with matches what the endpoint supports.

## Invalid Request (422)

This error indicates the request's payload lacks data or contains invalid data.

Usually the API’s response will give you a list of errors that give more details.

For example, if you attempt to create a Google Calendar event, but the `start_at` date is **after** the `end_at` date, then the API will return a 422 error because you can’t create an event that ends before it starts.

If this error happens only intermittently, it could mean that downstream data is missing or occasionally produces invalid payloads. You’ll need to select the broken use case in the builder, and test it to find the culprit.

## Rate limited (429)

APIs typically implement rate limits. A rate limit defines how many times you’re allowed to send requests to the API within a specific time frame.

Exceeding this limit prompts the API to respond with a 429 status code and reject the requests.

You can use Concurrency and Rate Limiting controls within your Pipedream workflow settings to respect these 3rd party API limits, and you can also enable Automatic Retries to attempt the request again.

## Not Authorized or Forbidden (401)

This error means that either your request isn’t authentication properly, meaning that your API token is missing or is in the incorrect header; or potentially it means that your API key is valid but it doesn’t have the permissions required to access that resource.

For example, you might see this error if your API key is missing a character, or is incorrectly formatted in the request.

A common cause is omitting 'Bearer' or the space after it in the **`Authorization`** header: **`Bearer ${your API key here}`**.

An authorization error can happen if you attempt to modify a resource your account on that service doesn’t have permission to access.

For example, modifying a Google Sheet not shared with your Google Drive account will result in a permissions error.

## Internal Server Error (50x)

This means that the API encountered a fatal error and it wasn’t able to perform your request. It could be that this service is having an outage, or there’s a specific issue with this particular resource you’re attempting to access or modify.

Your request might be configured correctly, and your authentication headers properly set, but the issue is within the 3rd party’s API. We recommend contacting their customer support for more details.

You can also enable Automatic Retries on your workflow to automatically retry failed requests in case of an intermittent outage.
