# Overview

The AWS API unlocks endless possibilities for automation with Pipedream. With this powerful combo, you can manage your AWS services and resources, automate deployment workflows, process data, and react to events across your AWS infrastructure. Pipedream offers a serverless platform for creating workflows triggered by various events that can execute AWS SDK functions, making it an efficient tool to integrate, automate, and orchestrate tasks across AWS services and other apps.

# Getting Started

To get started, first [log in to the AWS console](https://signin.aws.amazon.com/signin).

Once you've logged in, navigate to the Identity and Access Management (IAM) service. Then click the **Users** section:

![Open the users management area in the AWS IAM service](https://res.cloudinary.com/pipedreamin/image/upload/v1715097590/marketplace/apps/aws/CleanShot_2024-05-07_at_11.59.24_mgqvr5.png)

From within the users management section, create a new user by clicking **Create User** in the top right:

![Creating a new user from within the AWS IAM console](https://res.cloudinary.com/pipedreamin/image/upload/v1715097847/marketplace/apps/aws/CleanShot_2024-05-07_at_12.03.52_rm4kae.png)

On the next page, you'll be prompted to name the user. We recommend naming the user `pipedream` so you can easily remember which service this user is tied to:

![Naming the new IAM user](https://res.cloudinary.com/pipedreamin/image/upload/v1715097913/marketplace/apps/aws/CleanShot_2024-05-07_at_12.04.30_acgthh.png)

Next, you'll be prompted to define this user's *permissions*. You have three options:
1. Attach the user to a group - the new user will inherit the group's permission policies.
2. Copy permissions - copy the permission policies from another existing IAM user.
3. Attach policies directly - attach a policy directly to the new user.

If you're unfamiliar with defining permissions in AWS, consider using a pre-made permission policy. For example, if you need Pipedream to integrate with S3, you can choose the `S3FullAccessPolicy` by searching for "s3" in the search bar:

![Searching for s3 in the permissions search bar within IAM to attach the S3FullAccessPolicy directly to the pipedream user](https://res.cloudinary.com/pipedreamin/image/upload/v1715098770/marketplace/apps/aws/CleanShot_2024-05-07_at_12.19.01_zwgldj.png)

Alternatively, you can craft specific policies within IAM that only grant specific access to specific AWS resources to this new `pipedream` user.

Click **Create Policy** to create a new custom policy, and from within this view, you can use either JSON or the UI to include permissions to specific services and resources.

After you’ve created your IAM user, it will display a **Client Key** and **Secret**. Copy these fields into Pipedream to connect your AWS account.

Please note, the AWS Client Secret will not be shown again after closing the window. So make sure that your credentials are properly copied into Pipedream before closing the IAM window.

# Troubleshooting

## Permissions issues

The most common issue when integrating Pipedream with AWS is permissions issues.

The IAM user you create for Pipedream must have access to the AWS resources it’s attempting to use within your triggers, actions, Node.js, or Python code steps.

You can use the AWS IAM console to attach additional policies to your IAM user associated with Pipedream.



# Example Use Cases

- **Automated Backup to S3**: Trigger a workflow when a new row is added to a Google Sheets document, process the data within Pipedream, and automatically back it up to an AWS S3 bucket. This ensures important data is stored safely without manual intervention.

- **CloudWatch Alerts Handler**: Receive AWS CloudWatch alerts in Pipedream, process the data to determine the severity, and send notifications to a Slack channel. Additionally, create Jira tickets for high-severity alerts to streamline incident management.

- **Serverless Image Processing**: On image upload to S3, trigger a Pipedream workflow that uses AWS Lambda to resize the image, then store the processed image back in another S3 bucket, and finally update a database record through AWS RDS to reflect the change. This creates a seamless media management pipeline.
