## AWS Task Scheduler

### Example: Run a workflow at sunrise and sunset

### IAM Policy

At a minimum, this policy needs the ability to create and delete Step Functions State Machines, IAM roles / policies, and SNS topics:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
        "iam:PassRole",
        "sns:DeleteTopic",
        "iam:DeleteRolePolicy",
        "states:DeleteStateMachine",
        "sns:CreateTopic",
        "iam:CreateRole",
        "iam:DeleteRole",
        "states:StartExecution",
        "states:StopExecution",
        "sns:Subscribe",
        "iam:PutRolePolicy",
        "states:CreateStateMachine"
      ],
      "Resource": [
        "arn:aws:iam::[YOUR AWS ACCOUNT ID]:role/*",
        "arn:aws:states:*:*:execution:*:*",
        "arn:aws:states:*:*:stateMachine:*",
        "arn:aws:sns:*:*:*"
      ]
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
