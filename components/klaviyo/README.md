# Overview

The Klaviyo API grants you the power to automate and personalize your email marketing efforts. With it, you can manage lists, profiles, and campaigns, track event-driven communications, and analyze the results. By leveraging this API on Pipedream, you can create intricate, automated workflows that respond in real-time to your users' behavior, sync data across multiple platforms, and tailor your marketing strategies to improve engagement and conversion rates.

# Example Use Cases

- **Synchronize New Shopify Orders to Klaviyo for Personalized Follow-Ups**: When a new order is placed in Shopify, trigger a workflow in Pipedream that captures order details and customer information. This data is then sent to Klaviyo to create or update a customer profile and trigger a personalized post-purchase email sequence.

- **Automate Lead Scoring Based on User Activity**: Use Pipedream to listen for webhooks from Klaviyo that indicate user actions, like email opens, link clicks, or form submissions. Combine this with data from other sources, like CRMs or analytics tools, to calculate a lead score. Update the contact in Klaviyo with this score to segment audiences and target high-scoring leads with specialized campaigns.

- **Streamline Event Invitations and Follow-Ups with Zoom Webinar Registrations**: When a user registers for a webinar on Zoom, Pipedream can capture this event and create a corresponding profile in Klaviyo, automatically adding them to an event-specific list. Post-webinar, use Klaviyo to send out tailored content, such as a recording of the event, additional resources, or calls to action, based on their engagement.

# Getting Started

To get started using Klaviyo with Pipedream, you’ll need to create a new Klaviyo API key.

First, log in to your Klaviyo account, then open *Settings* in the bottom left-hand corner:

![Open the drawer in the bottom left-hand drawer to open your Klaviyo account settings](https://res.cloudinary.com/pipedreamin/image/upload/v1715178061/marketplace/apps/klayvio/CleanShot_2024-05-08_at_10.11.15_2x_cusdgp.png)

Then, on the next page, click **Create API Key** to begin creating a new private API key.

![Create a new Klaviyo API key](https://res.cloudinary.com/pipedreamin/image/upload/v1715178067/marketplace/apps/klayvio/CleanShot_2024-05-08_at_10.11.29_2x_uenkfm.png)

On this page, you can configure your API key settings, such as its name and permissions. We recommend naming this API key `Pipedream` so you can easily track where it’s used.

Next, you'll need to define the permissions for this API key. You can grant specific permissions, read-only access to all resources, or full read/write access. Don’t worry, you can change these settings later.

![Choosing between permission levels](https://res.cloudinary.com/pipedreamin/image/upload/v1715178064/marketplace/apps/klayvio/CleanShot_2024-05-08_at_10.12.15_2x_ebxwdq.png)

Once you have created your Klaviyo private API key, make sure to copy it to your clipboard and save it within Pipedream through either a Klaviyo trigger or action in a workflow, or by opening the dedicated Connected Accounts area in Pipedream.

![Save the Klaviyo API key to Pipedream](https://res.cloudinary.com/pipedreamin/image/upload/v1715178053/marketplace/apps/klayvio/CleanShot_2024-05-08_at_10.19.51_2x_otps4k.png)

Ensure you save the API key before closing the Klaviyo window, as this is the only time this private API key will be displayed.

# Troubleshooting

Klaviyo uses standard HTTP status codes to communicate errors over it’s API.

## Status Codes

### 200 OK

The request completed successfully.

### 201 Created

The request succeeded, and a new resource was created as a result.

### 202 Accepted

The request has been received but not yet acted upon. We return this status code for requests that were accepted but are processed asynchronously.

### 204 No Content

The request succeeded, but the API doesn’t provide a response body.

### 400 Bad Request

Request is missing a required parameter or has an invalid parameter.

### 401 Not Authorized

Request is lacking required authentication information.

Please follow the guidance here for more details on authenticating your API requests.

### 403 Forbidden

The request contains valid authentication information, but does not have permissions to perform the specified action.

See API key scopes for more information.

### 404 Not Found

The requested resource doesn't exist.

### 405 Method not Allowed

The requested resource doesn't support the provided HTTP method, e.g., DELETE.

### 409 Conflict

The request conflicts with the current state of the server.

### 410 Gone

The requested content has been permanently deleted from Klaviyo’s server. This status code will occur for requested endpoints that no longer exist in our API.

### 415 Unsupported Media Type

The Content-Type or Content-Encoding header is set incorrectly.

### 429 Rate Limit

You hit the rate limit for this endpoint (different endpoints have different rate limits).

### 500 Server Error

Something is wrong with the destination server. This may be on Klaviyo's end.

### 503 Service Unavailable

Something is wrong on Klaviyo’s end leading to service unavailability.

Check Klaviyo’s Status for updates.
