# CloudWatch Logs Insights Query

**This source runs a CloudWatch Logs Insights query on a schedule, emitting the results to listeners**.

## Prerequisites

You'll need to create an AWS IAM user that you'll link to this source to run Insights queries. At a minimum, this user needs a policy that allows it to describe the CloudWatch Logs groups you'd like to query, and permission to run queries:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": "logs:StartQuery",
      "Resource": "arn:aws:logs:*:*:log-group:*"
    },
    {
      "Sid": "VisualEditor1",
      "Effect": "Allow",
      "Action": "logs:DescribeLogGroups",
      "Resource": "arn:aws:logs:*:*:log-group:*"
    },
    {
      "Sid": "VisualEditor2",
      "Effect": "Allow",
      "Action": ["logs:GetQueryResults", "logs:StopQuery"],
      "Resource": "*"
    }
  ]
}
```

## Usage

1. [**Click here to create this source**](https://pipedream.com/sources?action=create&key=aws-new-records-returned-by-cloudwatch-logs-insights-query), or visit [https://pipedream.com/sources](https://pipedream.com/sources) and click **Create Source**, select the **aws** app and choose the **CloudWatch Logs Insights** source.
2. Press the **Connect Account** button and add the AWS access and secret key for the IAM user you created above.
3. Change the **AWS Region** prop to the region where your logs live.
4. The **CloudWatch Log Groups** prop accepts one or _multiple_ log groups. Select your target log groups from the drop-down menu (Pipedream uses the credentials from the linked user to list these log groups using the `DescribeLogGroups` API operation).
5. Enter your query in **Logs Insights Query** prop. [See this doc](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html) for help with the query syntax.
6. The **Emit query results as a single event** prop defaults to `true`, emitting your query results as a single event - an array of result rows. However, if you'd like to operate on each row of results independently (running a workflow on each row, for example), you can set this prop to `false`. In that case, the source will emit each row of results as its own event.
7. Finally - this source is configured to run at a default schedule, which you can change. Each time the source runs, it queries data _since the last time it ran_.

Here's an example of the fully-configured source:

![Setup CloudWatch Logs Insights Query source](https://res.cloudinary.com/pipedreamin/image/upload/v1592866015/docs/Screen_Shot_2020-06-22_at_3.14.32_PM_krlhhb.png)
