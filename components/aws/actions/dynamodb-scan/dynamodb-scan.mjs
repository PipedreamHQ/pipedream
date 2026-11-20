import common from "../../common/common-dynamodb.mjs";
import constants from "../../common/constants.mjs";
import {
  toSingleLineString,
  attemptToParseJSON,
} from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-dynamodb-scan",
  name: "DynamoDB - Scan",
  description: toSingleLineString(`
    Reads items from a DynamoDB table by scanning it, optionally filtered. Items come back in no guaranteed order.
    Returns every matching item unless you set \`maxItems\`; set it (e.g. 100) when you only need a sample or the table may be large, so the result stays small.
    \`maxItems\` returns an arbitrary sample, not the first items by key: use **DynamoDB - Query** when you need items in sort-key order.
    Check \`truncated\` first: when it is \`true\`, more items exist (the \`maxItems\` cap was reached, or the call hit its request limit), so call
    this action again with the same inputs and \`continuationKey\` set to \`nextContinuationKey\` to read the next page,
    and repeat until \`truncated\` is \`false\`.
    A scan reads every item and applies the filter afterwards, so it is slow and costly on big tables;
    prefer **DynamoDB - Query** when you know the partition key.
    Attribute names that are DynamoDB reserved words (e.g. \`status\`, \`name\`, \`total\`, \`data\`, \`timestamp\`, \`size\`) can't be written
    directly in \`filterExpression\` or \`projectionExpression\`: use a placeholder such as \`#s\` and define it in
    \`expressionAttributeNames\`, e.g. \`{ "#s": "status" }\` with \`#s = :v\`.
    If the filter is very selective, a single call stops after ${constants.dynamodb.MAX_REQUESTS} requests and returns \`truncated: true\` with a key to resume from.
    Example with \`maxItems\` 100 on a bigger table: \`{ "truncated": true, "nextContinuationKey": { "id": { "S": "42" } }, "Count": 100, "ScannedCount": 100, "Items": [{ "id": { "S": "1" } }] }\`.
    [See the documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/scancommand.html)
  `),
  version: "0.3.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    aws: common.props.aws,
    region: common.props.region,
    tableName: common.props.tableName,
    projectionExpression: common.props.projectionExpression,
    filterExpression: common.props.filterExpression,
    expressionAttributeNames: common.props.expressionAttributeNames,
    expressionAttributeValues: common.props.expressionAttributeValues,
    limit: common.props.limit,
    maxItems: common.props.maxItems,
    continuationKey: common.props.continuationKey,
  },
  async run({ $ }) {
    const params = {
      TableName: this.tableName,
      ProjectionExpression: this.projectionExpression,
      FilterExpression: this.filterExpression,
      ExpressionAttributeNames: attemptToParseJSON(this.expressionAttributeNames),
      ExpressionAttributeValues: attemptToParseJSON(this.expressionAttributeValues),
    };

    const pages = await this.readPages({
      fn: this.scan,
      params,
      maxItems: this.maxItems,
      filtered: Boolean(this.filterExpression),
      pageSize: this.limit,
      startKey: attemptToParseJSON(this.continuationKey),
      startKeyAttr: "ExclusiveStartKey",
      nextKeyAttr: "LastEvaluatedKey",
    });

    const s = pages.items.length === 1
      ? ""
      : "s";
    $.export("$summary", `Scan returned ${pages.items.length} item${s}${pages.nextKey
      ? " (more available: pass nextContinuationKey as Continuation Key to read the next page)"
      : ""}`);
    return this.formatPages(pages);
  },
};
