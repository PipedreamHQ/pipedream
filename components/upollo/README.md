# Overview

The Upollo API offers real-time user behavior analysis to prevent fraud and account sharing. It's designed to detect and respond to suspicious activities by scoring user actions and sessions. In Pipedream, you can harness this API to craft workflows that automate responses to these activities, integrate with other services for enriched functionality, and streamline user management processes.

# Example Use Cases

- **User Risk Scoring and Alerting**: Create a workflow that triggers when a new user action occurs, uses the Upollo API to score the risk level, and sends alerts via email or Slack if the risk threshold is exceeded.

- **Automated Fraud Detection and Account Flagging**: Build a workflow where, upon detecting a high-risk score from Upollo, it automatically flags the user account in your database and triggers additional verification steps through email or SMS.

- **Enhanced Security with Two-Factor Authentication (2FA)**: Implement a workflow that, after receiving a high-risk assessment from Upollo, triggers a 2FA process with an app like Twilio, ensuring another layer of security before granting account access.
