import aws from "../../aws.app.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "aws-lambda-invoke-function",
  name: "Lambda - Invoke Function",
  description: toSingleLineString(`
    Invoke a Lambda function using the AWS API.
    [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/index.html)
  `),
  version: "0.1.2",
  type: "action",
  props: {
    aws,
    region: {
      propDefinition: [
        aws,
        "region",
      ],
      description: "The AWS region tied to your Lambda, e.g us-east-1 or us-west-2",
    },
    lambdaFunction: {
      propDefinition: [
        aws,
        "lambdaFunction",
        (c) => ({
          region: c.region,
        }),
      ],
    },
    eventData: {
      propDefinition: [
        aws,
        "eventData",
      ],
    },
  },
  async run({ $ }) {
    // This invokes the Lambda synchronously so you can view the response
    // details associated with each invocation. This can be changed. See
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#invoke-property
    // This also assumes the eventData passed to the step is JSON.
    // Please modify the code accordingly if your data is in a different format.
    const response = await this.aws.lambdaInvokeFunction(this.region, {
      FunctionName: this.lambdaFunction,
      Payload: JSON.stringify(this.eventData || {}),
      InvocationType: "RequestResponse",
      LogType: "Tail",
    });
    $.export("$summary", `Invoked ${this.lambdaFunction} lambda function`);
    this.aws.decodeResponsePayload(response);
    return response;
  },
};
