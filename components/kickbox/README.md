# Overview

The Kickbox API on Pipedream allows you to verify email addresses to improve deliverability and reduce bounce rates. With this API, you can integrate email validation into your application's signup process, maintain the hygiene of your email lists, and orchestrate workflows involving email verification with various apps supported by Pipedream. By leveraging serverless workflows, you can automate tasks like updating CRM contacts, triggering marketing campaigns, or filtering out invalid emails before sending out newsletters.

# Example Use Cases

- **List Hygiene Automation**: Automatically validate new email addresses added to a Google Sheet. When a new row is added, trigger a workflow that uses the Kickbox API to verify the email. If the email is valid, update another column in Google Sheets to reflect this, ensuring your contact list remains clean.

- **Signup Verification Process**: Enhance your website's signup form by integrating Kickbox to perform real-time email validation. Use an HTTP webhook to trigger a Pipedream workflow whenever a user signs up, then validate the email with Kickbox. Upon successful validation, you could then proceed to create a new user record in your database or send a welcome email.

- **CRM Clean-Up**: Periodically validate the email addresses in your CRM like Salesforce. Set up a scheduled workflow in Pipedream that fetches contacts from Salesforce, verifies each email with Kickbox, and updates the contact records in Salesforce based on the verification results, helping maintain the integrity of your CRM data.
