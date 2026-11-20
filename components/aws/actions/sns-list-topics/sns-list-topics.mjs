import common from "../../common/common-sns.mjs";
import {
  collectPages, listResult, listSummary,
} from "../../common/list-paging.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-sns-list-topics",
  name: "SNS - List Topics",
  description: toSingleLineString(`
    Lists the SNS topics in a region with their ARN and name.
    Use it to find the topic ARN for **SNS - Send Message**.
    Check \`truncated\` first: when it is \`true\`, call again with \`nextToken\` set to the returned \`nextToken\`.
    Example result: \`{ "truncated": false, "nextToken": null, "count": 1, "topics": [{ "arn": "arn:aws:sns:us-east-1:123456789012:alerts", "name": "alerts" }] }\`.
    [See the documentation](https://docs.aws.amazon.com/sns/latest/api/API_ListTopics.html)
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
        Topics, NextToken,
      } = await this.snsListTopics({
        NextToken: token,
      });
      return {
        items: (Topics ?? []).map(({ TopicArn: arn }) => ({
          arn,
          name: arn.split(":").pop(),
        })),
        nextToken: NextToken,
      };
    }, this.maxItems, this.nextToken);
    $.export("$summary", listSummary("topic", result));
    return listResult("topics", result);
  },
};
