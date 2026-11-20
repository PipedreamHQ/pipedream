import common from "../../common/common-lambda.mjs";
import {
  collectPages, listResult, listSummary,
} from "../../common/list-paging.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-lambda-list-functions",
  name: "Lambda - List Functions",
  description: toSingleLineString(`
    Lists the Lambda functions in a region with their name, ARN, runtime and last-modified time.
    Use it to find the \`functionName\` for **Lambda - Invoke Function**.
    Check \`truncated\` first: when it is \`true\`, call again with \`nextToken\` set to the returned \`nextToken\`.
    Example result: \`{ "truncated": false, "nextToken": null, "count": 1, "functions": [{ "name": "resize-image", "arn": "arn:aws:lambda:us-east-1:123456789012:function:resize-image", "runtime": "nodejs20.x", "lastModified": "2025-01-15T10:00:00.000+0000" }] }\`.
    [See the documentation](https://docs.aws.amazon.com/lambda/latest/api/API_ListFunctions.html)
  `),
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    aws: common.props.aws,
    region: common.props.region,
    maxItems: {
      propDefinition: [
        common.props.aws,
        "maxItems",
      ],
    },
    nextToken: {
      propDefinition: [
        common.props.aws,
        "nextToken",
      ],
    },
  },
  async run({ $ }) {
    const result = await collectPages(async (token) => {
      const {
        Functions, NextMarker,
      } = await this.listFunctions({
        Marker: token,
        MaxItems: 50,
      });
      return {
        items: (Functions ?? []).map((fn) => ({
          name: fn.FunctionName,
          arn: fn.FunctionArn,
          runtime: fn.Runtime,
          lastModified: fn.LastModified,
        })),
        nextToken: NextMarker,
      };
    }, this.maxItems, this.nextToken);
    $.export("$summary", listSummary("function", result));
    return listResult("functions", result);
  },
};
