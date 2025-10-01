import common from "../../common/common-lambda.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-lambda-invoke-function",
  name: "Lambda - Invoke Function",
  description: toSingleLineString(`
    Invoke a Lambda function using the AWS API.
    [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/index.html)
  `),
  version: "0.2.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    aws: common.props.aws,
    region: common.props.region,
    lambdaFunction: common.props.lambdaFunction,
    eventData: common.props.eventData,
  },
  methods: {
    ...common.methods,
    decodeResponsePayload(payload) {
      return JSON.parse(new TextDecoder("utf-8").decode(payload));
    },
  },
  async run({ $ }) {
    // This invokes the Lambda synchronously so you can view the response
    // details associated with each invocation. This can be changed. See
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#invoke-property
    // This also assumes the eventData passed to the step is JSON.
    // Please modify the code accordingly if your data is in a different format.
    const response = await this.invokeFunction({
      FunctionName: this.lambdaFunction,
      Payload: JSON.stringify(this.eventData || {}),
      InvocationType: "RequestResponse",
      LogType: "Tail",
    });
    $.export("$summary", `Invoked ${this.lambdaFunction} lambda function`);
    return {
      ...response,
      Payload: this.decodeResponsePayload(response.Payload),
    };
  },
};
