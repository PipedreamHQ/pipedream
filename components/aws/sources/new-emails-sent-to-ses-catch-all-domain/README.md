# SES Catch-all Source

**This source lets you run any code on inbound emails delivered to a specific domain. It's a catch-all email handler**.

The source subscribes to all emails delivered to a specific domain configured in AWS SES. **When an email is sent to any address at the domain, this event source emits that email as a formatted event**. These events can trigger a Pipedream workflow and can be consumed via SSE or REST API. [See the event sources docs](https://docs.pipedream.com/event-sources/) for more information.

## Prerequisites

1. [Verify your domain in SES](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-getting-started-verify.html). As a part of this process, ensure you do two things:

- Once you select the option to **Verify a New Domain** in SES and enter your domain name, check the **Generate DKIM Settings** box and create the associated DNS records for validating DKIM.
- Configure an `MX` record that directs inbound email to SES. If you're using Route 53, SES may provide a way to configure this for you. Otherwise, create the inbound `MX` record [according to these instructions](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-mx-record.html).

2. If you do not already have an SES receipt rule set, follow [these instructions](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/receiving-email-receipt-rule-set.html) for creating one. You **do not** need to add a receipt rule in SES for handling inbound emails for this domain. This event source will configure that receipt rule for you, as long as you've configured a receipt rule set.

3. [Create an IAM user with the following IAM policy](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-and-attach-iam-policy.html):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SESCreateReceiptRule",
      "Effect": "Allow",
      "Action": [
        "ses:CreateReceiptRule",
        "ses:DeleteReceiptRule",
        "ses:DescribeActiveReceiptRuleSet",
        "ses:ListIdentities"
      ],
      "Resource": "*"
    },
    {
      "Sid": "SNSCreateTopicAndSubscribe",
      "Effect": "Allow",
      "Action": ["sns:CreateTopic", "sns:Subscribe", "sns:DeleteTopic"],
      "Resource": "arn:aws:sns:*:*:*"
    }
  ]
}
```

Keep the AWS access key and secret key that AWS generates for this user for the next step.

4. Visit [https://pipedream.com/apps](https://pipedream.com/apps) and click the button labeled **Click Here to Connect An App**. Search for "AWS" in the modal that appears, select the **AWS** app, and enter the access and secret key from the previous step.

## Usage

1. Visit [https://pipedream.com/sources](https://pipedream.com/sources) and click **Create Source**.
2. Select the **aws** app and choose the **SES Inbound Catch-All Handler** source.
3. You'll be prompted to enter the AWS Region string where you configured your SES domain. Then, select the SES domain you'd like to configure for inbound catch-all handling in the **Domain** prop.

## AWS Resources

This source creates 3 AWS resources when activated:

- An SNS topic
- An SES receipt rule tied to your default receipt rule set, which routes all inbound email to the SNS topic
- A subscription for your SNS topic, which directs messages to the source's HTTP endpoint.

When you delete the source, it deletes these resources from your AWS account.
