# Overview

The ZeroBounce API provides email verification services that help improve email deliverability by removing invalid or risky email addresses from your lists. When integrated with Pipedream, you can automate workflows to clean your mailing lists, validate subscribers in real-time, and enrich your contacts. Pipedream's serverless platform facilitates the running of code that interacts with the ZeroBounce API to execute these tasks based on various triggers and actions from other integrated services.

# Example Use Cases

- **Email List Cleaning Workflow**: Automatically validate and clean email lists on a schedule. By setting up a timed trigger, the workflow can retrieve email lists from a data storage app, send them to the ZeroBounce API for validation, and receive the cleaned list, which can be stored back or sent to an email marketing service like Mailchimp.

- **Real-time Email Verification**: Implement real-time email verification on sign-up forms. When a new user submits their email through a form, a Pipedream workflow can instantly verify it with ZeroBounce. Depending on the result, the workflow can either proceed with the user registration or prompt for a valid email, ensuring only legitimate users are onboarded.

- **Enrichment and Segmentation**: Enrich and segment contacts based on ZeroBounce's data append feature. The workflow can take an email address, use ZeroBounce to append additional data such as the user's location, gender, or IP address, and subsequently use this info to segment the contacts into specific marketing campaigns within a CRM such as Salesforce.
