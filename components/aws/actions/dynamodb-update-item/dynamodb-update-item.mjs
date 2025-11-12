import common from "../../common/common-dynamodb.mjs";
import constants from "../../common/constants.mjs";
import {
  toSingleLineString,
  attemptToParseJSON,
} from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-dynamodb-update-item",
  name: "DynamoDB - Update Item",
  description: toSingleLineString(`
    Updates an existing item's attributes, or adds a new item to the table if it does not already exist.
    [See docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/updateitemcommand.html)
  `),
  version: "0.2.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    aws: common.props.aws,
    region: common.props.region,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    tableName: {
      ...common.props.tableName,
      reloadProps: true,
    },
    updateExpression: common.props.updateExpression,
    expressionAttributeNames: common.props.expressionAttributeNames,
    expressionAttributeValues: common.props.expressionAttributeValues,
  },
  async additionalProps() {
    const props = {};
    if (this.tableName) {
      const [
        primaryKey,
        secondaryKey,
      ] = await this.getTableAttributes(this.tableName);
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
      ExpressionAttributeNames: attemptToParseJSON(this.expressionAttributeNames),
      ExpressionAttributeValues: attemptToParseJSON(this.expressionAttributeValues),
    };

    const [
      primaryKey,
      secondaryKey,
    ] = await this.getTableAttributes(this.tableName);

    params.Key[primaryKey.AttributeName] = {
      [primaryKey.AttributeType]: this.primaryKey,
    };

    if (secondaryKey) {
      params.Key[secondaryKey.AttributeName] = {
        [secondaryKey.AttributeType]: this.secondaryKey,
      };
    }

    const response = await this.updateItem(params);
    $.export("$summary", `Successfully updated item in table ${this.tableName}`);
    return response;
  },
};
