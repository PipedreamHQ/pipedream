# Overview

Mailwizz offers a potent API that enables automation of email marketing tasks, subscriber management, campaign tracking, and more. Using Pipedream, you can harness this API to create custom workflows that trigger on specific events, process data, or synchronize with other apps. Pipedream's serverless architecture allows you to handle workflows at scale without managing infrastructure.

# Example Use Cases

- **Automate Subscriber Syncing**: Sync subscribers from Mailwizz to Google Sheets. When a new subscriber is added in Mailwizz, Pipedream can catch the event, process the subscriber's information, and automatically add their details to a Google Sheet, keeping your records up to date without manual entry.

- **Dynamic Campaign Triggering**: Trigger email campaigns based on customer activity. For instance, if a customer makes a purchase on your Shopify store, Pipedream can initiate a Mailwizz workflow that sends a personalized thank-you email or a follow-up email sequence to encourage repeat business.

- **Monitor Campaign Performance**: Keep tabs on your email campaigns by setting up a workflow where Pipedream listens for campaign event webhooks from Mailwizz, such as opens or clicks. The data can then be logged into a database like MySQL or sent to a dashboard application like Grafana for real-time monitoring and analysis.
