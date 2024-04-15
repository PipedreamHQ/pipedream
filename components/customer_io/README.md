# Overview

The Customer.io API lets you interact with their customer engagement platform, enabling automated messaging based on user behavior. With Pipedream, you can leverage this API to create powerful, serverless workflows that react to data from various sources. These workflows can send personalized emails, push notifications, or SMS to your users, update customer profiles, track custom events, and segment users based on their interactions with your product.

# Example Use Cases

- **Sync New Users from Your App to Customer.io**: Automatically add new users from your app into Customer.io as soon as they sign up. Use a webhook to trigger the workflow on user registration, enrich the data if needed, and then use the Customer.io API to create or update the user's profile.

- **Trigger Email Campaigns Based on Product Usage**: Set up a workflow that listens for specific actions within your app, like reaching a certain level in a game or completing a purchase. When the action is detected, use the Customer.io API to trigger a targeted email campaign that encourages further engagement or rewards the user.

- **Create a Multi-step Onboarding Sequence**: Design a workflow that helps new users get the most out of your product. Start by sending a welcome email via Customer.io when a user signs up. Then, wait a day or two and check if the user has completed key activities. If not, the workflow can trigger follow-up messages or helpful tips to guide them through the process.
