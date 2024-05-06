# Overview

The Dropcontact API on Pipedream allows you to enrich and clean contact data dynamically within a serverless workflow. It can find, verify, and correct email addresses, providing additional information like company details and social network profiles. Integrating Dropcontact into Pipedream workflows enables automated data enhancement tasks that can trigger actions in other apps for marketing, sales, or CRM purposes.

# Example Use Cases

- **Validate and Enrich Leads Automatically**: This workflow triggers when a new lead is captured, perhaps via a Typeform submission. Pipedream sends the lead’s data to Dropcontact to validate and enrich the email address, and then uses the enriched data to update the lead in a CRM like Salesforce or HubSpot.

- **Email List Cleaning before Campaigns**: Before sending out a marketing campaign through an email service like Mailchimp, you can run your mailing list through a Pipedream workflow that uses Dropcontact to verify and clean the emails, reducing bounce rates and improving deliverability.

- **Sync Enriched Contacts to Google Sheets**: Set up a Pipedream workflow where you drop a CSV into Google Drive. Pipedream parses the file, sends each contact to Dropcontact for enrichment, and appends the results to a Google Sheet, giving you an updated, enriched contact list for outreach or reporting.
