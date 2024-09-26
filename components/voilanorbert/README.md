# Overview

VoilaNorbert is a potent tool for finding and verifying email addresses. With its API, you can automate processes like enriching leads with verified contact information, streamlining your email outreach, and maintaining the health of your email lists. The API's main features include searching for email addresses based on names and domains, verifying email deliverability, and managing your contacts. When used within Pipedream, you can leverage these capabilities to create workflows that respond to events, integrate with other services, and process data in real time.

# Example Use Cases

- **Lead Enrichment Workflow**: Triggered by a new entry on a Google Sheet (containing names and companies), this workflow uses VoilaNorbert to find corresponding email addresses, verifies them to ensure deliverability, and then updates the Google Sheet with the new data. This automation keeps your lead database fresh and actionable.

- **Email Verification on Signup**: When a new user signs up through a website form, VoilaNorbert is employed to verify the email address provided. If verified, the user's information is added to a CRM like Salesforce, and a welcome email is sent via SendGrid. This process ensures that you're capturing genuine leads without manual vetting.

- **Periodic Email List Cleaning**: A scheduled workflow runs monthly, fetching email addresses from an email marketing platform like Mailchimp. It uses VoilaNorbert to verify and clean the list, removing invalid emails automatically. The cleaned list is then re-uploaded to Mailchimp, optimizing your email campaign's deliverability and engagement rates.
