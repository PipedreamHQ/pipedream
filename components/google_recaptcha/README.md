# Overview

The Google reCAPTCHA API protects your website from fraud and abuse. It verifies that user interactions are legitimate without any user friction. On Pipedream, you can incorporate reCAPTCHA verification within your serverless workflows to validate user responses on forms, ensuring they're not automated bots. This is crucial for form submissions, account sign-ups, or any user interaction point that you want to safeguard. You can trigger workflows with HTTP requests, email events, or even on a schedule, and include a reCAPTCHA API call to verify the user's action.

# Example Use Cases

- **Validate Form Submissions:** Integrate reCAPTCHA with form handlers on Pipedream. When a user submits a form, trigger a workflow that calls the reCAPTCHA API to confirm the submission is from a real user, then proceed with data processing or storage only if verification succeeds.

- **Secure User Sign-Ups:** Ensure that new account creations come from humans, not bots. Set up a Pipedream workflow that triggers on new sign-up events, uses the reCAPTCHA API to verify the sign-up action, and then creates the user account in your database or a third-party service like Auth0.

- **Enhanced Comment Moderation:** Automate moderation of user comments on your platform. Create a Pipedream workflow that runs when new comments are posted, uses the reCAPTCHA API to verify the commenter is not a bot, and then allows the comment to be posted or flags it for review.
