# Overview

Zoho CRM API is a powerful and versatile tool to create business applications.
It provides an easy to use platform for developers to create customer-facing
applications for businesses of all sizes. With the Zoho CRM API, developers can
create applications for sales, marketing, customer support, and even financial
data management.

The Zoho CRM API provides access to a comprehensive set of features that allow
developers to build efficient, reliable and intuitive business solutions. These
features include:

- Customer Relationship Management (CRM)
- Automation Tools
- Reporting and Analytics
- Customization and Deployment

Here are some examples of what developers can build using the Zoho CRM API:

- Automate customer interactions and manage customer relationship workflows
- Send targeted emails based on customer segmentation or customer behavior
- Leverage the reporting and analytics capabilities of the Zoho CRM to gain
  insights into customer data
- Create dynamic dashboards and reports to better understand customer
  engagement and performance
- Develop customer relationship management apps to capture customer information
  and interact with customers
- Integrate the Zoho CRM with external applications and services to build
  comprehensive customer-facing applications.


## Getting Started

1. First, sign up for Pipedream at [https://pipedream.com](https://pipedream.com).
2. [Create a new workflow](https://pipedream.com/new).
3. Select a [trigger](/workflows/steps/triggers/) for your workflow (for example, HTTP or Cron).
4. [Add a new step](/workflows/steps/) and search for "Zoho CRM". This will display [actions](/components#actions) associated with the Zoho CRM app. You can choose to either "Run Node.js code with Zoho CRM" or select one of the prebuilt actions for performing common API operations.
5. Once you've added a step, press the **Connect Zoho CRM** button near the top. If this is your first time authorizing Pipedream's access to your Zoho CRM account, you'll be prompted to accept that access, and Pipedream will store the authorization grant to enable the workflow to access the API. If you've already linked a Zoho CRM account via Pipedream, pressing **Connect Zoho CRM** will list any existing accounts you've linked. 

Once you've connected your account, you can run your workflow and fetch data from the API. You can change any of the code associated with this step, changing the API endpoint you'd like to retrieve data from, or modifying the results in any way.

# Troubleshooting

**Issues Connecting My Account: IP Allowlist**

If your Zoho security policy includes an IP Allowlist, update it to connect your account:

1. Add this IP Range: `44.223.89.56` - `44.223.89.63`.
2. Include your current IP Address because the initial OAuth authorization request originates from your browser.
3. Set up a [Virtual Private Cloud (VPC) on Pipedream](https://pipedream.com/docs/workflows/vpc#create-a-new-vpc). Add the [static IP address](https://pipedream.com/docs/workflows/vpc#find-the-static-outbound-ip-address-for-a-vpc) to Zoho's IP Allowlist. Note: VPCs are available with Pipedream's **Business Plan** or higher. See [pricing](https://pipedream.com/pricing) for details.

After connecting your account, make sure to [run the workflow within a VPC](https://pipedream.com/docs/workflows/vpc#run-workflows-within-a-vpc).