# Overview

Zoho Forms API allows you to automate interactions with your forms and the data you collect. Leveraging Pipedream, you can harness this API to trigger workflows upon new form submissions, manipulate form entries, and sync data with other services. Pipedream’s serverless platform simplifies integrating Zoho Forms with 3,000+ other apps, empowering you to create custom, scalable workflows without hosting or managing servers.

# Example Use Cases

- **Automate Lead Capture to CRM**  
  Capture leads using Zoho Forms and instantly add them to a CRM like Salesforce. When a new form submission occurs, the workflow triggers, extracting the submission data and creating a new lead record in Salesforce, ensuring that no lead falls through the cracks.

- **Sync Form Data to Google Sheets**  
  Keep a real-time Google Sheets log of every Zoho Forms submission. Each time a form is submitted, Pipedream's workflow adds a new row to your designated Google Sheet. This is ideal for sharing submission data with team members who prefer working within spreadsheets.

- **Form Submission Notifications via Slack**  
  Get instant notifications in a Slack channel whenever a form is submitted. This Pipedream workflow listens for new submissions on Zoho Forms and then posts a custom message with the submission details to your chosen Slack channel, keeping your team updated in real-time.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).