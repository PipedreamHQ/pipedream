# Overview

The Detectify API provides a powerful interface for automating and integrating continuous web application security testing into your development cycle. With this API, you can programmatically start scans, fetch scan profiles, retrieve findings, and manage your Detectify domain assets. When leveraged through Pipedream, you can create serverless workflows that trigger actions in other apps based on the results from Detectify, ensuring timely responses to security threats and streamlining your DevSecOps processes.

# Example Use Cases

- **Automate Scanning After Deployment**: Trigger a Detectify scan automatically post-deployment from your CI/CD pipeline. Use a webhook to signal a Pipedream workflow that deploys code, and then start a security scan on the updated application.

- **Slack Alerts for Critical Findings**: Set up a workflow to check for new findings from Detectify on a schedule. Filter for critical security issues and send a summary directly to your security team's Slack channel, facilitating immediate action.

- **Triage Issues with Jira**: Automatically create Jira tickets for new security findings classified as high risk. This workflow can parse the output from Detectify, create a ticket in Jira with relevant details, and assign it to the appropriate team for resolution.
