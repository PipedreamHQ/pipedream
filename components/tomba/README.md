# Overview

The Tomba API is a comprehensive email finder and verification service that enables you to discover, verify, and enrich email addresses and contact data. With Tomba, you can find email addresses from domains, names, LinkedIn profiles, or blog posts, verify email deliverability, and gather detailed company intelligence. Leverage Pipedream's capabilities to integrate Tomba with hundreds of other apps, creating powerful automated workflows for lead generation, email verification, contact enrichment, and competitive research.

# Example Use Cases

- **Lead Generation Automation**: Trigger a workflow when a new company is added to your CRM. Use Tomba to find email addresses associated with the company's domain, enrich the lead data, and automatically add qualified contacts to your outreach sequences in tools like Mailchimp or HubSpot.

- **Email List Verification**: Before launching an email campaign, run your contact list through a Pipedream workflow that uses Tomba's email verifier to validate each address. Automatically remove invalid emails and update your email platform like SendGrid, ensuring higher deliverability rates and protecting your sender reputation.

- **Competitive Intelligence Gathering**: Set up a scheduled workflow that monitors competitor domains using Tomba's domain search and technology detection features. Store findings in Google Sheets and send Slack notifications to your team with insights about competitor email patterns, employee counts, and tech stacks.

# Getting Started

To start using Tomba with Pipedream:

1. **Sign up for Tomba**: Create an account at [tomba.io](https://tomba.io) and obtain your API key and secret from the dashboard.

2. **Connect to Pipedream**: In your Pipedream workflow, add a Tomba action and authenticate using your API credentials.

3. **Choose your action**: Select from 20 available actions including Email Finder, Domain Search, Email Verifier, and Company Search.

4. **Configure parameters**: Set up your search criteria such as domain names, email addresses, or LinkedIn URLs.

5. **Test and deploy**: Run your workflow to verify the results, then deploy for automated execution.

# Troubleshooting

**Authentication Issues**

- Verify your API key and secret are correctly entered in the Pipedream connection settings
- Check that your Tomba account has sufficient credits and is not suspended
- Ensure your API keys haven't expired or been regenerated

**Rate Limiting**

- Tomba enforces API rate limits based on your subscription plan
- Implement delays between requests in high-volume workflows
- Monitor your usage with the "Get Usage" action to track quota consumption

**No Results Found**

- For Email Finder: Try different name variations or check if the domain uses a non-standard email format
- For Domain Search: Some domains may have limited public email exposure
- For LinkedIn Finder: Ensure the LinkedIn URL is publicly accessible and properly formatted

**Invalid Email Addresses**

- Use the Email Verifier action to validate emails before adding them to campaigns
- Some emails may exist but have strict spam filters that prevent verification
