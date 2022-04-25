import common from "../../common/common-dynamodb.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-dynamodb-scan",
  name: "DynamoDB - Scan",
  description: toSingleLineString(`
    The Scan operation returns one or more items and item attributes by accessing every item in a table.
    [See docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/scancommand.html)
  `),
  version: "0.2.0",
  type: "action",
  props: {
    aws: common.props.aws,
    region: common.props.region,
    tableName: common.props.tableName,
    projectionExpression: common.props.projectionExpression,
    expressionAttributeNames: common.props.expressionAttributeNames,
    expressionAttributeValues: common.props.expressionAttributeValues,
  },
  async run({ $ }) {
    const params = {
      TableName: this.tableName,
      ProjectionExpression: this.projectionExpression,
      ExpressionAttributeNames: typeof (this.expressionAttributeNames) === "string"
        ? JSON.parse(this.expressionAttributeNames)
        : this.expressionAttributeNames,
      ExpressionAttributeValues: typeof (this.expressionAttributeValues) === "string"
        ? JSON.parse(this.expressionAttributeValues)
        : this.expressionAttributeValues,
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
