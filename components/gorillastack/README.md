# Overview

The GorillaStack API enables automation and integration of cloud cost management and optimization tools. With GorillaStack, you can automate real-time actions, get insights into your cloud usage, and set up rules to control cloud costs. Using this API within Pipedream, you can create powerful serverless workflows that respond to various triggers and perform actions like shutting down unused resources, notifying teams about cost spikes, or adjusting resources based on load.

# Example Use Cases

- **Cost Alerting and Notification Workflow**: Automate notifications via Slack or email in Pipedream when GorillaStack detects cost anomalies or threshold breaches in your cloud environment. This helps keep teams informed and react quickly to unexpected cost changes.

- **Resource Management Workflow**: Implement a system where GorillaStack flags idle resources, and Pipedream triggers Lambda functions to stop or terminate these resources after office hours or during low-usage periods. You can even incorporate approval steps with human intervention before taking action.

- **Cost Optimization Reporting Workflow**: Generate and send regular cost optimization reports by aggregating data from GorillaStack. Use Pipedream to process this data and compile comprehensive reports, then distribute them through channels like Google Sheets or Data Studio for easy access and analysis.
