# Overview

SatisMeter is a tool focused on collecting customer feedback through NPS (Net Promoter Score) surveys directly integrated into your product or sent via email. Using SatisMeter's API on Pipedream allows you to automate responses to survey data, sync customer feedback with other tools, and trigger actions based on feedback scores. This can enhance your ability to rapidly respond to customer needs, tailor marketing strategies, and improve product features based on real user sentiments.

# Example Use Cases

- **Automate Support Tickets Based on Negative Feedback**: When a customer leaves a negative NPS score, automatically create a support ticket in Zendesk. The workflow can extract the feedback details and customer contact information from SatisMeter and use this to populate and prioritize the ticket in Zendesk, ensuring timely follow-up to improve customer satisfaction.

- **Sync NPS Data with CRM**: Automatically sync new NPS feedback entries to a CRM like Salesforce or HubSpot. When a new survey response is received, the workflow can parse the feedback score and comments, then update or create a new contact record in the CRM. This helps sales and customer service teams have up-to-date insights into customer sentiment.

- **Trigger Email Campaigns Based on Positive Feedback**: Launch targeted email campaigns to customers who have given high NPS scores using a platform like Mailchimp. The workflow triggers when high scores are detected, pulling the customer's email address from SatisMeter, and enrolling them in a "Promoters" email list in Mailchimp to nurture these happy customers into brand advocates.
