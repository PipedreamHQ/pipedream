# Overview

The Hunter API on Pipedream provides a potent suite for automating email discovery and verification processes. By interfacing with Hunter, you can programmatically find email addresses associated with a domain, verify the deliverability of emails, and retrieve other data points like the organization behind an address. This capability is invaluable for lead generation, sales outreach, and data enrichment workflows, where accurate contact information is crucial.

# Example Use Cases

- **Lead Generation Automation**: Set up a workflow that triggers whenever your company's database adds a new potential client's domain. The Hunter API fetches the most common email pattern for that domain, and perhaps even specific email addresses. Integrate with CRM platforms like HubSpot or Salesforce on Pipedream to automatically populate new leads with this data.
- **Email Verification Before Campaigns**: Before launching an email marketing campaign, ensure email lists have high deliverability. Create a workflow that takes a list of emails, uses Hunter to verify each, and filters out undeliverable addresses. This can tie in with email marketing tools like Mailchimp on Pipedream, automatically updating subscriber lists.
- **Enriching Contact Details in Support Tickets**: When a new support ticket is created, a workflow can call the Hunter API to find additional contact information about the person who submitted the ticket. This data can then be pushed to a helpdesk system such as Zendesk, providing support staff with valuable context and potential contact alternatives.
