# Overview

PropelAuth provides a robust API for managing authentication and user management in your applications. By leveraging the PropelAuth API on Pipedream, you can seamlessly integrate authentication flows, user data synchronization, and access management with your existing services and workflows. This allows for the creation of secure, scalable, and efficient automations that can react to user events, update permissions, and maintain user data across various platforms.

# Example Use Cases

- **User Onboarding Automation**: Automate the onboarding process by using PropelAuth to create new user accounts. Once a user is created, trigger a Pipedream workflow to send a personalized welcome email using the SendGrid app, add the user's details to a Google Sheets spreadsheet for record-keeping, and assign initial roles or permissions within your application.

- **Real-time Access Revocation**: Monitor user activity or subscription status using PropelAuth, and set up a Pipedream workflow that instantly revokes access or deactivates accounts when certain conditions are met. Connect this workflow to your Slack app to notify your admin team whenever an account is deactivated for immediate follow-up or auditing.

- **Synchronized User Profiles**: Keep user profiles in sync across multiple platforms. When a user updates their profile information in PropelAuth, trigger a Pipedream workflow to update that information in other systems such as CRM tools like Salesforce or marketing platforms like Mailchimp to maintain data consistency and enable personalized marketing campaigns.
