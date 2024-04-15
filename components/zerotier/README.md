# Overview

The ZeroTier API enables automation of network management tasks, offering a programmatic way to access and control virtual networks. With Pipedream's serverless integration platform, you can leverage this API to construct workflows that trigger on various events or schedules. These workflows can create, manage, and maintain ZeroTier networks, members, and access rules, adding a layer of dynamism to your network operations. By combining ZeroTier with Pipedream, you can seamlessly connect various services, react to network changes in real-time, and automate routine network admin tasks.

# Example Use Cases

- **Automated Network Provisioning**: Configure a workflow on Pipedream that listens for webhook events from your infrastructure-as-code tooling (e.g., Terraform Cloud). When a new cloud instance is provisioned, the workflow can automatically add the instance to a ZeroTier network, securing and simplifying the connection to your other instances.

- **Dynamic Access Control Updates**: Set up a Pipedream workflow that integrates with an identity provider like Okta. Whenever a user's status changes (e.g., onboarding, offboarding, or moving departments), the workflow updates the user's access permissions in ZeroTier, ensuring that network access policies stay in sync with HR events.

- **Real-time Network Monitoring Alerts**: Create a Pipedream workflow that periodically checks the status of your ZeroTier networks. If it detects anomalies or specific conditions (like offline nodes), it can send instant notifications through email, Slack, or another communication app to alert the necessary teams for quick response.
