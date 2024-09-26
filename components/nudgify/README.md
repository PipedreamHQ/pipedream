# Overview

The Nudgify API lets you create and manage social proof notifications, aimed at increasing user engagement and conversions on your website. By leveraging this API on Pipedream, you can automate the interaction with Nudgify notifications and integrate them into your site's workflow. This could include creating notifications based on user behavior, updating them in real-time as data changes, or deleting them once they're no longer needed. The Pipedream platform simplifies the process of working with the Nudgify API by handling authentication, providing a code-free interface for setting up workflows, and enabling connections with numerous other apps for extended functionality.

# Example Use Cases

- **Dynamic Social Proof Creation**: Trigger a Nudgify notification on your website when a new order is placed. Use Pipedream's trigger for a new row in a Google Sheets spreadsheet, where the sheet is updated with order details, to send data to Nudgify for a "recent purchase" notification.

- **Real-time Stock Update Alerts**: Set up a notification for low stock alerts on your e-commerce platform. When the inventory for a popular item dips below a certain threshold in your database (like AWS DynamoDB), it triggers a Pipedream workflow that sends a 'low stock' nudge via Nudgify, prompting users to act fast.

- **User Signup Acknowledgment**: Acknowledge new user signups by sending a "Welcome" nudge. When a new user registers via your app (e.g., through Auth0), trigger a Pipedream workflow that calls the Nudgify API to display a personalized welcome message on your site, enhancing user onboarding.
