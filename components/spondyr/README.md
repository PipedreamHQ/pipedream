# Overview

The Spondyr API, known as MailboxValidator, is a tool designed to clean and verify email lists, ensuring that businesses can keep their email marketing databases free of invalid, inactive, or disposable email addresses. By integrating Spondyr with Pipedream, you can automate the process of maintaining a high-quality email list, triggering email validation workflows, and integrating with other services to enhance user management, campaign effectiveness, and overall data hygiene.

# Example Use Cases

- **Email Verification on User Sign-up**: Trigger a workflow in Pipedream when a new user signs up via your app's API. Use the Spondyr API to validate the email address. If it's valid, continue the sign-up process; if not, reject the sign-up and notify the user to provide a valid email.

- **Scheduled Email List Cleaning**: Set up a Pipedream cron job to periodically trigger a workflow that sends batches of email addresses from your database to the Spondyr API for validation. After cleaning, update your database by removing invalid emails, and use Pipedream's built-in integrations to log the results to a Google Sheets spreadsheet for record-keeping and further analysis.

- **Real-time Lead Validation in Marketing Campaigns**: Integrate the Spondyr API with your marketing platform via Pipedream. When a lead is captured through a landing page form, instantly validate their email with Spondyr. Based on the validation result, you could route the lead to different nurturing tracks or notify your sales team about high-quality leads with valid email addresses.
