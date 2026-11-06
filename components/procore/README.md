# Overview

The Procore API empowers developers to interact with its construction management software programmatically, enabling automation of tasks, data synchronization, and enhanced reporting. With APIs covering project management, quality and safety, construction financials, and field productivity, you can craft workflows that streamline operations, reduce manual entry, and provide real-time insights. On Pipedream, these capabilities can be harnessed to create workflows that react to events in Procore or orchestrate actions between Procore and other apps, optimizing construction project workflows.

# Getting Started

## Connecting Your Procore Account

After you connect your Procore account to Pipedream, you may see a `403` error such as `App is not connected to this company` when making company- or project-scoped requests. Procore only allows a third-party app to access a company's data after a company admin has installed the app in that company's account. Requests that aren't scoped to a company, such as `/me` and `/companies`, will work without this step.

To fix this, a Procore company admin must install the Pipedream app as a custom app using the Pipedream installation key below.

### Installation Key

- **Production**: `5b9bfb6b-4c63-4157-9d66-a4a619135f27`

### Installation Steps

1. Sign in to Procore as a company admin.
2. Follow Procore's instructions to [install a custom app](https://v2.support.procore.com/product-manuals/admin-company/tutorials/install-a-custom-app), and enter the Production installation key above when prompted.
3. Once the app is installed, retry your request in Pipedream.

> **Note:** This installation key is for Procore production accounts. If you are using a Procore sandbox account, use the [Procore Sandbox](https://pipedream.com/apps/procore-sandbox) app instead, which has its own installation key.

# Example Use Cases

- **Automate Incident Reporting**: Trigger a workflow on Pipedream when a safety incident is reported in Procore. Use this trigger to immediately send an email notification to safety managers, log the incident in a Google Sheet for record-keeping, and create a follow-up task in a project management tool like Asana.

- **Sync Project Financials with Accounting Software**: Set up a scheduled Pipedream workflow that retrieves updated project budget and cost data from Procore and syncs it with an accounting platform like QuickBooks. Ensure financial records are always up to date and allow for real-time budget analysis and reporting.

- **Streamline RFIs and Submittals Management**: When a new Request for Information (RFI) or Submittal is created in Procore, trigger a Pipedream workflow to cross-post the details to a Slack channel dedicated to project communications. This keeps the team informed and facilitates quick responses, ensuring project timelines are met with fewer delays.
