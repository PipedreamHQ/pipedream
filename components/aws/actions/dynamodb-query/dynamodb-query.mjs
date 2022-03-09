import aws from "../../aws.app.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "aws-dynamodb-query",
  name: "DynamoDB - Query",
  description: toSingleLineString(`
    The query operation finds items based on primary key values.
    [See docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/querycommand.html)
  `),
  version: "0.4.2",
  type: "action",
  props: {
    aws,
    region: {
      propDefinition: [
        aws,
        "region",
      ],
    },
    tableName: {
      propDefinition: [
        aws,
        "tableName",
      ],
    },
    keyConditionExpression: {
      propDefinition: [
        aws,
        "keyConditionExpression",
      ],
    },
    projectionExpression: {
      propDefinition: [
        aws,
        "projectionExpression",
      ],
    },
    expressionAttributeNames: {
      propDefinition: [
        aws,
        "expressionAttributeNames",
      ],
    },
    expressionAttributeValues: {
      propDefinition: [
        aws,
        "expressionAttributeValues",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: this.keyConditionExpression,
      ProjectionExpression: this.projectionExpression,
      ExpressionAttributeNames: typeof (this.expressionAttributeNames) === "string"
        ? JSON.parse(this.expressionAttributeNames)
        : this.expressionAttributeNames,
      ExpressionAttributeValues: typeof (this.expressionAttributeValues) === "string"
        ? JSON.parse(this.expressionAttributeValues)
        : this.expressionAttributeValues,
    };

    const response = await this.aws.pagination(
      this.aws.dynamodbQuery,
      this.region,
      params,
      "ExclusiveStartKey",
      "LastEvaluatedKey",
    );

    $.export("$summary", `Query returned ${response.Items.length} items`);
    return response;
  },
};
