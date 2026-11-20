import common from "../../common/common-sqs.mjs";
import {
  collectPages, listResult, listSummary,
} from "../../common/list-paging.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-sqs-list-queues",
  name: "SQS - List Queues",
  description: toSingleLineString(`
    Lists the SQS queue URLs in a region, optionally only those whose name starts with a prefix.
    Use it to find the \`queueUrl\` for **SQS - Send Message**.
    Check \`truncated\` first: when it is \`true\`, call again with \`nextToken\` set to the returned \`nextToken\`.
    Example result: \`{ "truncated": false, "nextToken": null, "count": 1, "queues": ["https://sqs.us-east-1.amazonaws.com/123456789012/orders"] }\`.
    [See the documentation](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_ListQueues.html)
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
    queueNamePrefix: {
      type: "string",
      label: "Queue Name Prefix",
      description: "Only list queues whose name starts with this prefix, e.g. `orders-`. Leave empty to list all queues.",
      optional: true,
    },
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
        QueueUrls, NextToken,
      } = await this.sqsListQueues({
        QueueNamePrefix: this.queueNamePrefix || undefined,
        NextToken: token,
        MaxResults: 1000,
      });
      return {
        items: QueueUrls ?? [],
        nextToken: NextToken,
      };
    }, this.maxItems, this.nextToken);
    $.export("$summary", listSummary("queue", result));
    return listResult("queues", result);
  },
};
