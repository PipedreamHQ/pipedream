# Overview

The ServiceNow API lets developers access and manipulate records, manage workflows, and integrate with other services on its IT service management platform. These capabilities support automating tasks, syncing data across platforms, and boosting operational efficiencies.

# Getting Started

Before using the ServiceNow REST API from a workflow, configure **two** OAuth apps in your ServiceNow instance. These apps will grant access tokens to your users and authenticate requests to its REST API.

## Create an External Client OAuth App

First, sign into your [ServiceNow Developer Portal](https://developer.servicenow.com/dev.do#!/home) account to create or access an instance.

1. Go to **System OAuth > Application Registry**.

   ![Find the OAuth Client option under the ServiceNow application registry](https://res.cloudinary.com/pipedreamin/image/upload/v1715264549/marketplace/apps/servicenow/CleanShot_2024-05-09_at_10.18.36_ntausg.png)

2. Create a new app by selecting **New** in the top right corner.

   ![Create a new ServiceNow application under the OAuth Clients section in the Application Registry](https://res.cloudinary.com/pipedreamin/image/upload/v1715265062/marketplace/apps/servicenow/CleanShot_2024-05-09_at_10.30.51_jpi4ct.png)

3. Choose **Create an OAuth API endpoint for external clients**:

   ![Create a new app, and make sure to choose the OAuth API endpoint for external clients option](https://res.cloudinary.com/pipedreamin/image/upload/v1715264615/marketplace/apps/servicenow/CleanShot_2024-05-09_at_10.19.09_pgezqf.png)

4. Name your app, such as `Pipedream`. Use the default settings but specify the **Redirect URL**: `https://api.pipedream.com/connect/oauth/oa_g2oiqA/callback`.

5. Click **Create**. It will appear in the Application Registry once created.

   ![You should see the Pipedream app listed in the ServiceNow Registry after making those changes](https://res.cloudinary.com/pipedreamin/image/upload/v1715264960/marketplace/apps/servicenow/CleanShot_2024-05-09_at_10.21.12_iwlxgq.png)

### Create the OAuth Validator app

1. Copy the client ID and secret from the `Pipedream` app you created above.
2. Name this app `Pipedream OAuth Validator` and add the previously copied client ID and secret. 
3. Set the grant type to **Authorization Code** and the **Token URL** to `oauth_token.do`.
4. Use the same **Redirect URL** as before.

5. Visit [Pipedream's account page](https://pipedream.com/accounts), and click **Click Here to Connect An App**. Search for **ServiceNow** and select it. Enter the client ID, client secret, and your instance name (e.g., `dev98042` from `https://dev98042.service-now.com/`).

6. Press **Connect**. A new window will prompt you to login to your ServiceNow instance, authorizing Pipedream's access to the ServiceNow REST API.

## ServiceNow Authorization Reference

[This ServiceNow doc](https://docs.servicenow.com/bundle/orlando-platform-administration/page/administer/security/concept/c_OAuthAuthorizationCodeFlow.html) outlines the flow you should implement.

## Additional Guidance For Hardened or Mature Instances

The standard instructions may not apply perfectly to customized or hardened ServiceNow instances. If you face a **504 Gateway Time-out** error or similar, consider these tips:

* Assign a dedicated role and service account for this integration.
* Ensure the role has ACLs configured for the `oauth_credential` table and other necessary tables.

# Example Use Cases

- **Incident Management Automation**: Automatically create incidents in ServiceNow from alerts in Datadog or New Relic.
- **HR Onboarding Workflow**: Trigger a Pipedream workflow to set up new employee accounts in ServiceNow from HR systems like Workday.
- **Customer Support Ticket Sync**: Keep customer support tickets synced between ServiceNow and CRM platforms like Salesforce.

# Troubleshooting

If you encounter a **504 Gateway Time-out** error, refer to the 'Additional Guidance For Hardened or Mature Instances' section for solutions.
