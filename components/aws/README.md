# Overview

The AWS API unlocks endless possibilities for automation with Pipedream. With this powerful combo, you can manage your AWS services and resources, automate deployment workflows, process data, and react to events across your AWS infrastructure. Pipedream offers a serverless platform for creating workflows triggered by various events that can execute AWS SDK functions, making it an efficient tool to integrate, automate, and orchestrate tasks across AWS services and other apps.

# Example Use Cases

- **Automated Backup to S3**: Trigger a workflow when a new row is added to a Google Sheets document, process the data within Pipedream, and automatically back it up to an AWS S3 bucket. This ensures important data is stored safely without manual intervention.

- **CloudWatch Alerts Handler**: Receive AWS CloudWatch alerts in Pipedream, process the data to determine the severity, and send notifications to a Slack channel. Additionally, create Jira tickets for high-severity alerts to streamline incident management.

- **Serverless Image Processing**: On image upload to S3, trigger a Pipedream workflow that uses AWS Lambda to resize the image, then store the processed image back in another S3 bucket, and finally update a database record through AWS RDS to reflect the change. This creates a seamless media management pipeline.
