import aws from "../../aws.app.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "aws-dynamodb-scan",
  name: "DynamoDB - Scan",
  description: toSingleLineString(`
    The Scan operation returns one or more items and item attributes by accessing every item in a table.
    [See docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/scancommand.html)
  `),
  version: "0.1.2",
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
      ProjectionExpression: this.projectionExpression,
      ExpressionAttributeNames: typeof (this.expressionAttributeNames) === "string"
        ? JSON.parse(this.expressionAttributeNames)
        : this.expressionAttributeNames,
      ExpressionAttributeValues: typeof (this.expressionAttributeValues) === "string"
        ? JSON.parse(this.expressionAttributeValues)
        : this.expressionAttributeValues,
    };

    const response = await this.aws.pagination(
      this.aws.dynamodbScan,
      this.region,
      params,
      "ExclusiveStartKey",
      "LastEvaluatedKey",
    );

    $.export("$summary", `Scan returned ${response.Items.length} items`);
    return response;
  },
};
