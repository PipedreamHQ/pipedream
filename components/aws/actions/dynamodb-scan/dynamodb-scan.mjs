import common from "../../common/common-dynamodb.mjs";
import {
  toSingleLineString,
  attemptToParseJSON,
} from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-dynamodb-scan",
  name: "DynamoDB - Scan",
  description: toSingleLineString(`
    The Scan operation returns one or more items and item attributes by accessing every item in a table.
    [See docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/scancommand.html)
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
    tableName: common.props.tableName,
    projectionExpression: common.props.projectionExpression,
    filterExpression: common.props.filterExpression,
    expressionAttributeNames: common.props.expressionAttributeNames,
    expressionAttributeValues: common.props.expressionAttributeValues,
    limit: common.props.limit,
  },
  async run({ $ }) {
    const params = {
      TableName: this.tableName,
      ProjectionExpression: this.projectionExpression,
      FilterExpression: this.filterExpression,
      ExpressionAttributeNames: attemptToParseJSON(this.expressionAttributeNames),
      ExpressionAttributeValues: attemptToParseJSON(this.expressionAttributeValues),
      Limit: this.limit,
    };

    const response = await this.aws.pagination(
      this.scan,
      params,
      "ExclusiveStartKey",
      "LastEvaluatedKey",
    );

    const s = response.Items.length === 1
      ? ""
      : "s";
    $.export("$summary", `Scan returned ${response.Items.length} item${s}`);
    return response;
  },
};
