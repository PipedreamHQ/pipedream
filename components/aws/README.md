# Overview

The AWS API on Pipedream provides a direct pipeline to AWS services, empowering developers to automate cloud operations, streamline data processes, and integrate with other services seamlessly. Utilizing Pipedream's serverless platform, you can orchestrate workflows that respond to events, schedule tasks, and handle complex logic without provisioning servers.

# Example Use Cases

- **Automated Image Processing:** When a new image is uploaded to an S3 bucket, trigger a Pipedream workflow to resize the image using AWS Lambda, then save the processed image back to S3.

- **CloudWatch Logs to Slack Notifications:** Use CloudWatch to monitor logs and metrics, triggering a Pipedream workflow that sends a summary or alert to a Slack channel when specific patterns or thresholds are detected.

- **Scheduled Database Backup:** Set up a Pipedream workflow to periodically invoke an AWS RDS instance snapshot, storing database backups securely in S3, and notify you via email using Amazon SES when the backup is complete.
