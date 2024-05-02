# Overview

The Purple Sonar API offers real-time threat intelligence and URL analysis, crucial for enhancing cybersecurity measures. By integrating with Pipedream, you can create workflows that automate the process of monitoring, analyzing, and responding to potential threats. Use cases include triaging alerts, enriching incident reports with additional data, or even proactively scanning URLs in company communications to pre-emptively block malicious links.

# Example Use Cases

- **Automated Alert Triage**: Create a workflow that triggers when your security system flags a suspicious URL. Purple Sonar can analyze the URL, and if it’s deemed malicious, the workflow can automatically update your firewall rules to block it, send notifications to your security team, and log the incident in your SIEM system.

- **Incident Report Enrichment**: Set up a Pipedream workflow that runs when new incidents are reported. The workflow calls Purple Sonar to gather detailed threat intelligence on the URLs involved. This data is then appended to the incident ticket in your tracking system (like JIRA), providing richer context for the analysts.

- **Proactive Communication Scanning**: Harness a workflow that scans URLs within emails or chat messages as they're sent or received. Using Purple Sonar, the workflow assesses the risks of the links, and if a link is found to be harmful, it can automatically alert the sender, receiver, and IT department, or even remove the message from the communication platform.
