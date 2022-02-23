import aws from "../../aws.app.mjs";
import { toSingleLineString } from "../../sources/common/utils.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "aws-dynamodb-update-item",
  name: "AWS - DynamoDB - Update Item",
  description: toSingleLineString(`
    Updates an existing item's attributes, or adds a new item to the table if it does not already exist.
    [See docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/updateitemcommand.html)
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
      reloadProps: true,
    },
    updateExpression: {
      type: "string",
      label: "Update Expression",
      description: toSingleLineString(`
        An expression that defines one or more attributes to be updated, the action to be performed on them, and new values for them.
        Example:
        \`SET command = :echo, #execs = :oneh\`
        [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/modules/updateiteminput.html#updateexpression)
      `),
      optional: true,
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
  methods: {
    async tableAttributeDefinitions(region, tableName) {
      const response = await this.aws.dynamoDBDescribeTable(region, {
        TableName: tableName,
      });
      return response.Table.AttributeDefinitions;
    },
  },
  async additionalProps() {
    const props = {};
    if (this.tableName) {
      const [
        primaryKey,
        secondaryKey,
      ] = await this.tableAttributeDefinitions(this.region, this.tableName);
      props.primaryKey = {
        type: "string",
        label: primaryKey.AttributeName,
        description: "Value for the primary key",
      };
      if (secondaryKey) {
        props.secondaryKey = {
          type: "string",
          label: secondaryKey.AttributeName,
          description: "Value for the sort key",
        };
      }
    }
    return props;
  },
  async run({ $ }) {
    const params = {
      TableName: this.tableName,
      ReturnValues: constants.dynamodb.returnValues.ALL_OLD,
      Key: {},
      UpdateExpression: this.updateExpression,
      ExpressionAttributeNames: typeof (this.expressionAttributeNames) === "string"
        ? JSON.parse(this.expressionAttributeNames)
        : this.expressionAttributeNames,
      ExpressionAttributeValues: typeof (this.expressionAttributeValues) === "string"
        ? JSON.parse(this.expressionAttributeValues)
        : this.expressionAttributeValues,
    };

    const [
      primaryKey,
      secondaryKey,
    ] = await this.tableAttributeDefinitions(this.region, this.tableName);

    params.Key[primaryKey.AttributeName] = {
      [primaryKey.AttributeType]: this.primaryKey,
    };

    if (secondaryKey) {
      params.Key[secondaryKey.AttributeName] = {
        [secondaryKey.AttributeType]: this.secondaryKey,
      };
    }

    const response = await this.aws.dynamoDBUpdateItem(this.region, params);
    $.export("$summary", `Successfully updated item in table ${this.tableName}`);
    return response;
  },
};
