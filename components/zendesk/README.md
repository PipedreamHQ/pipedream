# Overview

The Zendesk API enables seamless integration of Zendesk's customer service platform with your existing business processes and third-party applications. By leveraging this API with Pipedream, you can automate ticket tracking, sync customer data, escalate issues, and streamline communication across multiple channels. This can significantly increase efficiency, accelerate response times, and enhance the overall customer experience. Automations can range from simple notifications to complex workflows involving data transformation and multi-step actions across various services.

# Example Use Cases

**Ticket Management Automation**
Automatically create Zendesk tickets from emails, chat messages, or form submissions captured in other apps like Gmail or Slack. Use Pipedream to parse the incoming information and create a ticket in Zendesk with the appropriate tags, priorities, and assignments.

**Customer Feedback Loop**
After a ticket is resolved, trigger a workflow to send a follow-up survey using a platform like Typeform. Record responses back in Zendesk to ensure customer feedback influences service quality. An automated workflow could tag the ticket with the feedback score or add notes for support agents.

**Real-Time Notifications for Critical Issues**
Set up a Pipedream workflow that monitors Zendesk for tickets with 'Urgent' priority or specific keywords and sends instant notifications to a dedicated Slack channel or via SMS through Twilio. This ensures that critical issues are promptly addressed by support teams.

# Getting Started

First, log in to your [Pipedream workspace](https://pipedream.com), then connect Zendesk either through a step or trigger in a workflow, or directly from the Connected Accounts page in Pipedream.

You'll first be prompted to enter your Zendesk subdomain. You can find this in the URL after logging into Zendesk.

The subdomain is the portion of the URL *before* `zendesk.com`. 

For example, if the subdomain is `pipedream1903`, that's what you would enter in Pipedream.

![Example of finding the Zendesk subdomain from the URL while logged into Zendesk](https://res.cloudinary.com/pipedreamin/image/upload/v1715183755/marketplace/apps/zendesk/CleanShot_2024-05-08_at_11.44.08_2x_ogzhhj.png)

Next, you'll be prompted to connect your Zendesk account. Zendesk will ask if you'd like to grant Pipedream permission to perform actions on your account; accept these permissions to continue.

And that's it! You can now automate Zendesk actions from within Pipedream workflows.

# Troubleshooting

## Status Codes
Responses may have the status codes described in the following sections.

### 200 range
The request was successful. The status is 200 for successful GET and PUT requests, 201 for most POST requests, and 204 for DELETE requests.

### 400 range
The request was not successful. The content type of the response may be text/plain for API-level error messages such as trying to call the API without SSL. The content type is application/json for business-level error messages because the response includes a JSON object with information about the error:

```json
{
  "details": {
    "value": [
      {
        "type": "blank",
        "description": "can't be blank"
      },
      {
        "type": "invalid",
        "description": " is not properly formatted"
      }
    ]
  },
  "description": "RecordValidation errors",
  "error": "RecordInvalid"
}
```

If you see a response from a known endpoint that looks like plain text, you probably made a syntax error in your request. This type of response commonly occurs when making a request to a nonexistent Zendesk Support instance.

### **403**

A 403 response means the server has determined the user or the account doesn’t have the required permissions to use the API.

### **409**

A 409 response indicates a conflict with the resource you're trying to create or update.

409 errors typically occur when two or more requests try to create or change the same resource simultaneously. While Zendesk APIs can handle concurrent requests, requests shouldn't change the same resource at the same time. To avoid 409 errors, serialize requests when possible. If you receive a 409 error, you can retry your request after resolving the conflict.

The Zendesk Ticketing API provides specific parameters to prevent conflicts when updating tickets. For more information, see Protecting against ticket update collisions.

### **422 Unprocessable Entity**

A 422 response means that the content type and the syntax of the request entity are correct, but the content itself is not processable by the server. This is usually due to the request entity not being relevant to the resource that it's trying to create or update. Example: Trying to close a ticket that's already closed.

### **429**

A 429 error indicates that a usage limit has been exceeded. See the [Zendesk Rate limits](https://developer.zendesk.com/api-reference/introduction/rate-limits/).

### **500 range**

If you ever experience responses with status codes in the 500 range, the Zendesk API may be experiencing internal issues or having a scheduled maintenance during which you might receive a 503 Service Unavailable status code.

A 503 response with a `Retry-After` header indicates a database timeout or deadlock. You can retry your request after the number of seconds specified in the `Retry-After` header.

If the 503 response doesn't have a Retry-After header, Zendesk Support may be experiencing internal issues or undergoing scheduled maintenance. In such cases, check `@zendeskops` and our status page for any known issues.

When building an API client, we recommend treating any 500 status codes as a warning or temporary state. However, if the status persists and if Zendesk doesn't have a publicly announced maintenance or service disruption, contact the [Zendesk Customer Support](https://support.zendesk.com/hc/en-us/articles/360026614173).

If submitting a ticket to Zendesk, provide the `X-Zendesk-Request-Id` header included in the HTTP response. This helps the Support team track down the request in the logs more quickly.
