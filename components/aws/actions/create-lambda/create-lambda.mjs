import aws from "../../aws.app.mjs";
import dedent from "dedent";

export default {
  key: "aws-create-lambda",
  name: "AWS - Lambda - Create Function",
  description: "Create a Lambda function from source code. This action creates a zip file and deploys it to AWS Lambda. [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/classes/createfunctioncommand.html).",
  version: "0.0.1",
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
    role: {
      propDefinition: [
        aws,
        "role",
        (c) => ({
          region: c.region,
        }),
      ],
    },
    functionName: {
      type: "string",
      label: "Function Name",
      description: "The name of your Lambda function",
    },
    code: {
      type: "string",
      label: "Code",
      description: "The function code in Node.js. [See docs](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html)",
      default: dedent`exports.handler = async (event) => {
                        console.log("Received event");
                        const response = {
                            statusCode: 200,
                        };
                        return response;
                      };`,
    },
  },
  async run({ $ }) {
    const response = await this.aws.createLambdaFunction(
      this.region,
      this.role,
      this.functionName,
      this.code,
    );
    $.export("$summary", `Created ${this.functionName} lambda function`);
    return response;
  },
};
