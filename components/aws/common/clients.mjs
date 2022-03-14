import { EC2Client } from "@aws-sdk/client-ec2";
import { LambdaClient } from "@aws-sdk/client-lambda";
import { SSMClient } from "@aws-sdk/client-ssm";
import { IAMClient } from "@aws-sdk/client-iam";
import { S3Client } from "@aws-sdk/client-s3";
import { CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";
import { EventBridgeClient } from "@aws-sdk/client-eventbridge";
import { SQSClient } from "@aws-sdk/client-sqs";
import { SNSClient } from "@aws-sdk/client-sns";
import { SESClient } from "@aws-sdk/client-ses";
import { SFNClient } from "@aws-sdk/client-sfn";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const clients = {
  ec2: EC2Client,
  lambda: LambdaClient,
  ssm: SSMClient,
  iam: IAMClient,
  s3: S3Client,
  cloudWatchLogs: CloudWatchLogsClient,
  eventBridge: EventBridgeClient,
  sqs: SQSClient,
  sns: SNSClient,
  ses: SESClient,
  sfn: SFNClient,
  dynamodb: DynamoDBClient,
};

export {
  clients,
};
