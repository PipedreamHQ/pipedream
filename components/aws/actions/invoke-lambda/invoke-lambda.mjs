// legacy_hash_id: a_8Ki7Xv
import AWS from "aws-sdk";

export default {
  key: "aws-invoke-lambda",
  name: "AWS - Lambda - Invoke Function",
  description: "Invoke a Lambda function using the AWS API",
  version: "0.1.1",
  type: "action",
  props: {
    aws: {
      type: "app",
      app: "aws",
    },
    region: {
      type: "string",
      label: "AWS Region",
      description: "The AWS region tied to your Lambda, e.g us-east-1 or us-west-2",
    },
    FunctionName: {
      type: "string",
      label: "Lambda Function Name",
      description: "The name of your Lambda function. Also accepts a function ARN",
    },
    eventData: {
      type: "string",
      label: "Event data",
      description: "A variable reference to the event data you want to send to the event bus (e.g. event.body)",
    },
  },
  async run({ $ }) {
    const {
      accessKeyId,
      secretAccessKey,
    } = this.aws.$auth;
    const {
      region,
      FunctionName,
      eventData,
    } = this;

    const lambda = new AWS.Lambda({
      accessKeyId,
      secretAccessKey,
      region,
    });

    // This invokes the Lambda synchronously so you can view the response
    // details associated with each invocation. This can be changed. See
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#invoke-property
    // This also assumes the eventData passed to the step is JSON.
    // Please modify the code accordingly if your data is in a different format.
    const lambdaParams = {
      Payload: JSON.stringify(eventData),
      FunctionName,
      InvocationType: "RequestResponse",
      LogType: "Tail",
    };

    $.export("res", await lambda.invoke(lambdaParams).promise());
  },
};
