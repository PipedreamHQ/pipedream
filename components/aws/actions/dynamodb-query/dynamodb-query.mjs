import common from "../../common/common-dynamodb.mjs";
import {
  toSingleLineString,
  attemptToParseJSON,
} from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-dynamodb-query",
  name: "DynamoDB - Query",
  description: toSingleLineString(`
    The query operation finds items based on primary key values.
    [See docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/querycommand.html)
  `),
  version: "0.5.4",
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
    keyConditionExpression: common.props.keyConditionExpression,
    projectionExpression: common.props.projectionExpression,
    expressionAttributeNames: common.props.expressionAttributeNames,
    expressionAttributeValues: common.props.expressionAttributeValues,
  },
  async run({ $ }) {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: this.keyConditionExpression,
      ProjectionExpression: this.projectionExpression,
      ExpressionAttributeNames: attemptToParseJSON(this.expressionAttributeNames),
      ExpressionAttributeValues: attemptToParseJSON(this.expressionAttributeValues),
    };

    const response = await this.aws.pagination(
      this.query,
      params,
      "ExclusiveStartKey",
      "LastEvaluatedKey",
    );

    const s = response.Items.length === 1
      ? ""
      : "s";
    $.export("$summary", `Query returned ${response.Items.length} item${s}`);
    return response;
  },
};
