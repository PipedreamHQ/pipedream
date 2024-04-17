# Overview

GetProspect offers a powerful API to automate the process of finding and verifying professional email addresses. Harnessing this capability within Pipedream, you can create streamlined workflows that not only gather leads but also integrate them into your marketing or sales pipelines. Imagine enhancing your CRM with fresh leads, syncing contact info across tools, or setting up alerts when certain lead criteria are met—all of this can be orchestrated within Pipedream's serverless platform.

# Example Use Cases

- **Lead Enrichment for CRM**: When a new lead is added to your CRM (e.g., Salesforce), trigger a workflow that uses the GetProspect API to find additional contact information. Once retrieved, update the lead's record in Salesforce with enriched data, ensuring your sales team has the most current information at their fingertips.

- **Automated Lead Qualification**: Set up a Pipedream workflow that listens for new sign-ups on your website. For each sign-up, use GetProspect to obtain their professional email and verify its validity. Then, based on the lead's company size or industry (fetched via GetProspect), use conditional logic to route qualified leads to a Slack channel for immediate sales engagement.

- **Periodic Lead Synchronization**: Build a workflow that periodically fetches new contacts from a Google Sheet or another source. With GetProspect API, validate and enrich these contacts, then sync them to your email marketing platform (like Mailchimp) for seamless campaign targeting. This ensures your mailing lists are always current and populated with verified emails.
