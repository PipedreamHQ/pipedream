# SES Catch-all Source

**This source lets you run any code on inbound emails delivered to a specific
domain. It's a catch-all email handler**.

The source subscribes to all emails delivered to a specific domain configured in
AWS SES. **When an email is sent to any address at the domain, this event source
emits that email as a formatted event**. These events can trigger a Pipedream
workflow and can be consumed via SSE or REST API. [See the event sources
docs](https://docs.pipedream.com/event-sources/) for more information.

## Prerequisites

1. [Verify your domain in
   SES](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-getting-started-verify.html).
   As a part of this process, ensure you do two things:

   - Once you select the option to **Verify a New Domain** in SES and enter your
     domain name, check the **Generate DKIM Settings** box and create the
     associated DNS records for validating DKIM.
   - Configure an `MX` record that directs inbound email to SES. If you're using
     Route 53, SES may provide a way to configure this for you. Otherwise,
     create the inbound `MX` record [according to these
     instructions](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-mx-record.html).

2. If you do not already have an SES receipt rule set, follow [these
   instructions](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-receipt-rule-set.html)
   for creating one. Make sure that the rule set is set to **Active**. In case
   there is no active rule set in the account, the event source will try to
   create a new one and set it to **Active**. Please note that you **do not**
   need to add a receipt rule in SES for handling inbound emails for this
   domain. This event source will configure that receipt rule for you, as long
   as you've configured a receipt rule set.

3. [Create an IAM user with the following IAM
   policy](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-and-attach-iam-policy.html):

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "SNS",
         "Effect": "Allow",
         "Action": [
           "sns:DeleteTopic",
           "sns:CreateTopic",
           "sns:Subscribe"
         ],
         "Resource": [
           "arn:aws:sns:*:*:*"
         ]
       },
       {
         "Sid": "S3",
         "Effect": "Allow",
         "Action": ["s3:GetObject", "s3:PutBucketPolicy", "s3:CreateBucket"],
         "Resource": "arn:aws:s3:::pd-*"
       },
       {
         "Sid": "SES",
         "Effect": "Allow",
         "Action": [
           "ses:CreateReceiptRule",
           "ses:DescribeActiveReceiptRuleSet",
           "ses:CreateReceiptRuleSet",
           "ec2:DescribeRegions",
           "ses:DeleteReceiptRule",
           "sns:Unsubscribe",
           "sts:GetCallerIdentity",
           "ses:ListIdentities",
           "ses:SetActiveReceiptRuleSet"
         ],
         "Resource": "*"
       },
       {
         "Sid": "SNSUnsubscribe",
         "Effect": "Allow",
         "Action": "sns:Unsubscribe",
         "Resource": "arn:aws:sns:*:*:*"
       }
     ]
   }
   ```

   Keep the AWS access key and secret key that AWS generates for this user for
   the next step.

4. Visit the [Pipedream Accounts](https://pipedream.com/accounts) page and click
   the button labeled **CONNECT AN APP**. Search for "AWS" in the modal that
   appears, select the **AWS** app, and enter the access and secret key from the
   previous step.

## Usage

1. [Create the SES Source here](https://pipedream.com/sources/new?key=aws-new-emails-sent-to-ses-catch-all-domain).
2. You'll be prompted to enter the AWS Region where you configured your
   SES domain. Then, select the SES domain you'd like to configure for inbound
   catch-all handling in the **SES Domain** prop.

## AWS Resources

This source creates at least 4 AWS resources when activated:

1. An SNS topic
2. An S3 bucket where your incoming email will be stored
3. An SES receipt rule tied to your default receipt rule set, which routes all
   inbound email to the SNS topic
4. A subscription for your SNS topic, which directs messages to the source's
   HTTP endpoint.
5. If no active rule set is available in the AWS account, the event source will
   create it first

When you delete the source, it deletes these resources from your AWS account
**with the exception of the 5th item** (deleting an existing rule set might
break other applications relying on rules within it).
