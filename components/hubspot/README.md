# Overview

The HubSpot API enables developers to integrate into HubSpots CRM, CMS, Conversations, and other features. It allows for automated management of contacts, companies, deals, and marketing campaigns, enabling custom workflows, data synchronization, and task automation. This streamlines operations and boosts customer engagement, with real-time updates for rapid response to market changes.

# Getting Started

You can install the Pipedream HubSpot app in the [Accounts](https://pipedream.com/accounts) section of your account, or directly in a workflow.

## From Accounts

1. Visit [https://pipedream.com/accounts](https://pipedream.com/accounts).
2. Click on the **Connect An App** button in the top-right.
3. Search for "HubSpot" among the list of apps, and select it.
4. You will be prompted to sign in to HubSpot and select the account you'd like to connect.
5. Finally, HubSpot will ask to give Pipedream access to your account. Click "Connect app" to proceed.

![A screenshot of a user interface for adding a contact to a HubSpot account, with a prominent red arrow pointing to a dropdown menu titled "Select a HubSpot account...".](https://res.cloudinary.com/pipedreamin/image/upload/v1713894384/marketplace/apps/hubspot/CleanShot_2024-04-23_at_13.46.00_n2ve4a.png)

6. That's it! You can now use this HubSpot account to trigger a workflow, or [link it to any code step](/connected-accounts/#connecting-accounts).

## Within a workflow

1. [Create a new workflow](https://pipedream.com/new).
2. Search for "HubSpot" in the text field when selecting a trigger.
3. Select the one of the triggers that appear, based on your use case.
4. Click the **Connect Account** button near the top of the trigger. This will prompt you to select any existing HubSpot accounts you've previously authenticated with Pipedream, or you can select a **New** account. Clicking **New** opens a new window asking you to allow Pipedream access to your HubSpot account.

![A screenshot of a user interface for adding a contact to a HubSpot account, with a prominent red arrow pointing to a dropdown menu titled "Select a HubSpot account...".](https://res.cloudinary.com/pipedreamin/image/upload/v1713894384/marketplace/apps/hubspot/CleanShot_2024-04-23_at_13.46.00_n2ve4a.png)

5. That's it! You can now connect to the HubSpot API using any of the HubSpot triggers within a Pipedream workflow.

# Troubleshooting

By default, a successful HubSpot API request will return a 200 status code alongside the corresponding data payload.

Below are a list of common errors from HubSpots API by HTTP status code.

## 401 Unauthorized

Returned when the authentication provided is invalid. See our Authentication Overview for details on authenticating API requests.

## 403 Forbidden

Returned when the authentication provided does not have the proper permissions to access the specific URL. For example, an OAuth token with only content access would receive a 403 error when trying to access the Deals API, which requires contacts access. If your API key or private app has the necessary permissions and you're still encountering this error, please contact HubSpot support for assistance.

## 429 Too Many Requests

Returned when your account or app exceeds its API rate limits. For suggestions on how to work within those limits, click here.

## 477 Migration in Progress

Returned when a HubSpot account is in the midst of migration between data hosting locations. In this event, HubSpot provides a Retry-After response header indicating the time in seconds to wait before attempting your request again, typically up to 24 hours.

## 502/504 Timeouts

Returned when HubSpot's processing limits are reached, which are in place to prevent performance degradation due to excessive requests from a single client. If you encounter these timeouts, pause your requests briefly before retrying.

## 503 Service Temporarily Unavailable

Returned when HubSpot is temporarily unavailable. Upon receiving this response, take a short break before resuming your requests.

## 521 Web Server Is Down

Returned when HubSpot's server is down, usually as a temporary issue. If this occurs, pause your requests momentarily, then attempt to reconnect.

## 522 Connection Timed Out

Returned when the connection between HubSpot and your application times out. Contact HubSpot support if you encounter this error.

## 523 Origin Is Unreachable

Returned when HubSpot cannot reach your application. If this happens, pause your requests briefly before trying again.

## 524 Timeout

Returned when a response is not received within 100 seconds, possibly due to HubSpot's server being overloaded. Pause your requests for a short period, then retry.

## 525/526 SSL Issues

Returned when there's an issue with the SSL certificate or if the SSL handshake fails. In such cases, reach out to HubSpot support for assistance.

# Example Use Cases

- **Lead Scoring and Segmentation**: Enhance leads automatically by pulling in enrichment data from external sources and categorizing them in HubSpot. Use customer interaction data from social media or support platforms to adjust lead scores and segment leads into appropriate marketing campaigns within HubSpot.

- **Automated Ticketing and Support**: Create a workflow where new support queries on HubSpot trigger the creation of tickets in a tool like Zendesk. The workflow can also update the customer record in HubSpot with the ticket information, ensuring the sales team has visibility into customer issues.

- **Syncing Contacts with Email Platforms**: Set up a bi-directional sync between HubSpot and email marketing platforms like Mailchimp. When a contact is updated in HubSpot, it triggers an update in Mailchimp and vice versa. This keeps mailing lists current and enables targeted campaign efforts based on the most relevant data.
