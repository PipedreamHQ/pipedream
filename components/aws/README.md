# Overview

The AWS API on Pipedream lets you automate and integrate your cloud infrastructure seamlessly. With AWS services at your fingertips, you can orchestrate workflows that respond to events, manipulate data, and manage resources without provisioning or managing servers. Pipedream's serverless platform empowers you to connect AWS with various apps to streamline operations, from deploying applications to processing data.

# Example Use Cases

- **Automate EC2 Instance Management**: Create a workflow that listens for webhooks to trigger the start, stop, or reboot of EC2 instances. Combine this with scheduled events to optimize costs by shutting down unnecessary instances during off-peak hours.

- **S3 File Processing**: Set up an event-driven workflow that reacts to new files uploaded to an S3 bucket. Automatically process images for a gallery, convert uploaded documents to PDF, or trigger a Lambda function to analyze and move the data to a database or another storage service.

- **Lambda Function Deployer**: Construct a CI/CD pipeline within Pipedream that triggers on GitHub commits, builds the code, and deploys it to a Lambda function. Integrate with Slack to send notifications on deployment status, ensuring your team stays in the loop.
