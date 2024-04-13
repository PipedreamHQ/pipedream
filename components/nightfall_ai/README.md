# Overview

The Nightfall.ai API excels in identifying and managing sensitive information exposed in text and file payloads. With Pipedream's serverless integration platform, you can wire Nightfall.ai into a variety of workflows to automate data protection and compliance processes. By tapping into Nightfall's machine learning capabilities, you can build workflows that scan and react to data in motion, ensuring sensitive info like credit card numbers, passwords, or Personally Identifiable Information (PII) is caught and handled securely.

# Example Use Cases

- **Content Compliance on Social Media**: Use Nightfall.ai with Twitter's API to monitor and filter out sensitive content from user posts. When Pipedream detects a tweet containing PII, Nightfall.ai can assess it, and if needed, trigger a moderation action or alert.

- **Data Leakage Prevention in Cloud Storage**: Integrate Nightfall.ai with Google Drive to scan documents for sensitive data. When a new file is uploaded to Drive, Pipedream triggers Nightfall.ai to analyze it, and if it contains sensitive info, the workflow can automatically move the file to a secure location and notify administrators.

- **Email Filtering and Alerting**: Combine Nightfall.ai with the email service, like Gmail, to safeguard against sensitive information leaks in emails. When inbound emails are received, Pipedream can invoke Nightfall.ai to scan the content. If high-risk information is found, Pipedream can flag the email and send an alert to the security team for review.
