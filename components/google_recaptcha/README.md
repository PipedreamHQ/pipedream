# Overview

The Google reCAPTCHA API helps discern humans from bots, safeguarding websites from spam and abuse. With Pipedream, you can integrate this API into workflows to validate user interactions in real-time. This enhances security by ensuring only genuine users can trigger actions or access data. You can set up workflows that react to form submissions, activate upon successful recaptcha verifications, or conditionally process data based on verification status.

# Example Use Cases

- **Enhance Form Submission Security**: Verify reCAPTCHA responses when a user submits a form, then proceed with data processing or storage only if the verification is successful. Connect with databases like Airtable or Google Sheets for data handling.

- **User Verification for Account Creation**: Integrate reCAPTCHA with user signup flows. After the reCAPTCHA challenge is cleared, trigger a workflow to create a new user account in your authentication service, such as Auth0 or Firebase Authentication.

- **Conditional Content Delivery**: Secure API endpoints by requiring a valid reCAPTCHA token before serving sensitive content. Set up a Pipedream workflow that validates the token and, upon success, fetches content from a CMS like Contentful or directly serves data from a Pipedream data store.
