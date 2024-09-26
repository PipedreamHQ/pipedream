# Overview

The Appcues API enables developers to enrich and automate the user onboarding and engagement processes. By interfacing with Appcues, you can programmatically manage flows, segments, and events, and integrate user experience data into other systems for analysis or action. This supports creating customized, scalable user journeys and leveraging user interactions for informed decision-making across your business applications.

# Example Use Cases

- **Sync User Events with a CRM**: Automate the synchronization of user engagement data from Appcues to your CRM platform. For instance, when a user completes an onboarding flow in Appcues, trigger a workflow in Pipedream that updates the user's profile in Salesforce with the new engagement data.

- **Personalized Email Campaigns Based on User Behavior**: Use Appcues events to trigger personalized email campaigns. When a user completes a specific action or flow within your app, use Pipedream to send this data to an email marketing service like Mailchimp to enroll the user in a targeted email sequence.

- **Slack Notifications for User Milestones**: Enhance team collaboration by sending Slack notifications when users hit key milestones. Set up a Pipedream workflow that listens for `flow_completed` events in Appcues and posts a message to a designated Slack channel, keeping your team informed about user progress in real time.
