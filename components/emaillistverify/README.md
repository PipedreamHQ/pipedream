# Overview

The EmailListVerify API on Pipedream allows users to validate email addresses in real-time to maintain the hygiene of their mailing lists. This is crucial for reducing bounce rates, improving deliverability, and enhancing overall email campaign performance. By verifying emails, users can filter out invalid, disposable, or non-existent email addresses before they impact email reputation.

# Example Use Cases

- **Clean Up Registrations**: Automatically verify email addresses during user registration processes. Connect EmailListVerify to a registration form on your website (e.g., using the HTTP / Webhook trigger on Pipedream), to ensure only valid emails are added to your database or CRM system.

- **Scheduled List Cleaning**: Set up a recurring workflow on Pipedream that pulls email addresses from your CRM or email marketing tool (like Mailchimp), verifies them with EmailListVerify, and updates the list to remove any invalid emails. This can be done weekly or monthly to consistently maintain list quality.

- **Trigger-Based Verification for Lead Scoring**: Enhance lead scoring mechanisms by integrating EmailListVerify with a CRM application like Salesforce. Use Pipedream to trigger an email verification whenever a new lead is added or updated in Salesforce. Update the lead score based on the validity of the email address, ensuring higher quality leads for your sales teams.
