# Overview

The Clerk API lets you manage user authentication and create secure, delightful user experiences in your apps. Within Pipedream's serverless platform, you can harness this API to automate workflows that trigger on user events, sync user data across apps, and maintain robust user management without the heavy lifting of building authentication infrastructure from scratch.

# Example Use Cases

- **Automate User Onboarding**: When a new user signs up via Clerk, trigger a Pipedream workflow that sends a personalized welcome email using the SendGrid app, adds the user to a CRM like HubSpot for future outreach, and logs the activity in a Google Sheets spreadsheet.

- **Sync Profile Updates Across Platforms**: Establish a workflow that listens for profile updates in Clerk. When a user changes their info, Pipedream can propagate these changes to other platforms, such as updating their Slack profile, sending a notification to a Discord channel, and updating their record in an Airtable base.

- **Manage Access with Webhooks**: Use Clerk's webhooks to trigger a Pipedream workflow that revokes or grants access to features or content in your app. For instance, when a subscription status changes in Stripe, use Pipedream to call Clerk's API to update the user's session or permissions accordingly, ensuring consistent access control.
