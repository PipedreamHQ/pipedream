# Overview

The Bouncer API provides robust email verification services. Using Pipedream, you can harness this capability to clean your mailing list, verify emails on sign-up in real-time, or even integrate it into a multi-step workflow involving other apps and services. Pipedream simplifies connecting Bouncer with hundreds of other services for automating tasks, such as sending a welcome email via SendGrid to verified addresses or adding them to a Google Sheet.

# Example Use Cases

- **Email Verification for New Users**: When a new user signs up on your platform, trigger a Pipedream workflow to verify their email address with Bouncer. Based on the verification result, conditionally proceed to create their account and send a welcome email.

- **Mailing List Cleanup**: Set up a scheduled Pipedream workflow that iterates through your mailing list stored in a platform like Airtable. Use Bouncer to check each email and update the Airtable record with the verification status, helping maintain a high deliverability rate.

- **Real-time Signup Form Validation**: Integrate Bouncer API with your website's signup form using Pipedream. When a form is submitted, instantly verify the email address. If it's valid, proceed with the signup process and add the subscriber to your Mailchimp list.
