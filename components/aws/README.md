# Overview

The AWS API on Pipedream enables you to tap into the vast array of services offered by AWS directly from your Pipedream workflows. Automate tasks, orchestrate AWS services, and respond to events across your infrastructure in real-time. With Pipedream, you can connect AWS to hundreds of other apps, trigger workflows on various events, and execute serverless code to interact with AWS services.

# Example Use Cases

- **Automated Deployment Trigger**: Trigger a workflow in Pipedream when a new commit is pushed to a GitHub repository. The workflow can then deploy the updated code to AWS Elastic Beanstalk, ensuring your application is always up-to-date.

- **Serverless Image Processing**: Combine AWS Lambda with Amazon S3 on Pipedream. When a new image is uploaded to an S3 bucket, trigger a Pipedream workflow that invokes a Lambda function to process the image, such as resizing or adding watermarks.

- **Data Backup Automation**: Use Pipedream to automate the backing up of critical data from your app to AWS. When a user triggers a backup action in your app, Pipedream can manage the process of transferring data to Amazon S3, providing reliable and secure storage.
