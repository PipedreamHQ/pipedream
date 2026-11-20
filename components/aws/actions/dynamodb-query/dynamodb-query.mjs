import common from "../../common/common-dynamodb.mjs";
import constants from "../../common/constants.mjs";
import {
  toSingleLineString,
  attemptToParseJSON,
} from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-dynamodb-query",
  name: "DynamoDB - Query",
  description: toSingleLineString(`
    Finds items in a DynamoDB table (or one of its secondary indexes, via \`indexName\`) by primary key values,
    optionally narrowed with a \`filterExpression\`.
    Run **DynamoDB - Describe Table** first to find the key attribute names for \`keyConditionExpression\` and any index names.
    Attribute names that are DynamoDB reserved words (e.g. \`status\`, \`name\`, \`total\`, \`data\`, \`timestamp\`, \`size\`) can't be written
    directly in \`keyConditionExpression\`, \`filterExpression\` or \`projectionExpression\`: use a placeholder such as \`#s\` and define it in
    \`expressionAttributeNames\`, e.g. \`{ "#s": "status" }\` with \`#s = :v\`.
    Returns every matching item unless you set \`maxItems\`; set it (e.g. 100) when you only need a sample or many items may match, so the result stays small.
    Check \`truncated\` first: when it is \`true\`, more items exist (the \`maxItems\` cap was reached, or the call hit its request limit), so call
    this action again with the same inputs and \`continuationKey\` set to \`nextContinuationKey\` to read the next page,
    and repeat until \`truncated\` is \`false\`.
    The filter is applied after items are read, so a page can hold fewer matches than were read; this action keeps reading until
    it has \`maxItems\` matches (a few more with a filter), the data runs out, or it has made ${constants.dynamodb.MAX_REQUESTS} requests (then \`truncated\` is \`true\` with a key to resume from).
    Example: \`keyConditionExpression\` \`customerId = :c\`, \`expressionAttributeValues\` \`{ ":c": { "S": "c-1" } }\` returns
    \`{ "truncated": false, "nextContinuationKey": null, "Count": 1, "ScannedCount": 1, "Items": [{ "customerId": { "S": "c-1" }, "total": { "N": "42" } }] }\`.
    [See the documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/querycommand.html)
  `),
  version: "0.6.0",
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
    indexName: common.props.indexName,
    keyConditionExpression: common.props.keyConditionExpression,
    filterExpression: common.props.filterExpression,
    projectionExpression: common.props.projectionExpression,
    expressionAttributeNames: common.props.expressionAttributeNames,
    expressionAttributeValues: common.props.expressionAttributeValues,
    limit: common.props.limit,
    maxItems: common.props.maxItems,
    continuationKey: common.props.continuationKey,
  },
  async run({ $ }) {
    const params = {
      TableName: this.tableName,
      IndexName: this.indexName || undefined,
      KeyConditionExpression: this.keyConditionExpression,
      FilterExpression: this.filterExpression || undefined,
      ProjectionExpression: this.projectionExpression,
      ExpressionAttributeNames: attemptToParseJSON(this.expressionAttributeNames),
      ExpressionAttributeValues: attemptToParseJSON(this.expressionAttributeValues),
    };

    const pages = await this.readPages({
      fn: this.query,
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
    $.export("$summary", `Query returned ${pages.items.length} item${s}${pages.nextKey
      ? " (more available: pass nextContinuationKey as Continuation Key to read the next page)"
      : ""}`);
    return this.formatPages(pages);
  },
};
