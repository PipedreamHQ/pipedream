## SNS to Pipedream Subscription

This source creates an SNS topic in the linked AWS account. Once the topic is created, the source creates an HTTPS subscription to this source's HTTP endpoint. Any messages published to this SNS topic are emitted by this source.

### IAM Policy

At a minimum, this policy needs the ability to create and (optionally) delete SNS topics and subscriptions.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "sns:DeleteTopic",
                "sns:CreateTopic",
                "sns:Subscribe"
            ],
            "Resource": "arn:aws:sns:*:*:*"
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": "sns:Unsubscribe",
            "Resource": "*"
        }
    ]
}
```
