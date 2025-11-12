import common from "../../common/common-lambda.mjs";
import commonIam from "../../common/common-iam.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  ...commonIam,
  key: "aws-lambda-create-function",
  name: "Lambda - Create Function",
  description: toSingleLineString(`
    Create a Lambda function from source code. This action creates a zip file and deploys it to AWS Lambda.
    [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/classes/createfunctioncommand.html)
  `),
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    aws: common.props.aws,
    region: common.props.region,
    role: commonIam.props.role,
    functionName: common.props.functionName,
    code: common.props.code,
  },
  methods: {
    ...common.methods,
    ...commonIam.methods,
  },
  async run({ $ }) {
    const response = await this.createFunction({
      Role: this.role,
      FunctionName: this.functionName,
      Runtime: "nodejs12.x",
      Handler: "index.handler",
    }, this.code);
    $.export("$summary", `Created ${this.functionName} lambda function`);
    return response;
  },
};
