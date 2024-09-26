import aws from "../aws.app.mjs";
import {
  LambdaClient,
  InvokeCommand,
  ListFunctionsCommand,
  CreateFunctionCommand,
} from "@aws-sdk/client-lambda";
import dedent from "dedent";
import AdmZip from "adm-zip";

export default {
  props: {
    aws,
    region: {
      propDefinition: [
        aws,
        "region",
      ],
      description: "The AWS region tied to your Lambda, e.g `us-east-1` or `us-west-2`",
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
    lambdaFunction: {
      type: "string",
      label: "Function Name",
      description: "The name of your Lambda function. Also accepts a function ARN",
      async options({ prevContext }) {
        const response = await this.listFunctions({
          Marker: prevContext.nextMarker,
        });
        return {
          options: response.Functions.map((fn) => fn.FunctionName),
          context: {
            nextMarker: response.NextMarker,
          },
        };
      },
    },
    eventData: {
      propDefinition: [
        aws,
        "eventData",
      ],
    },
  },
  methods: {
    _clientLambda() {
      return this.aws.getAWSClient(LambdaClient, this.region);
    },
    async listFunctions(params) {
      return this._clientLambda().send(new ListFunctionsCommand(params));
    },
    async createFunction(params, code) {
      params.Code = {
        ZipFile: this.createZipArchive(code),
      };
      return this._clientLambda().send(new CreateFunctionCommand(params));
    },
    async invokeFunction(params) {
      return this._clientLambda().send(new InvokeCommand(params));
    },
    createZipArchive(data) {
      const zip = new AdmZip();
      zip.addFile("index.js", Buffer.from(data, "utf-8"));
      return zip.toBuffer();
    },
  },
};
