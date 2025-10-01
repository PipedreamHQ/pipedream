import common from "../../common/common-dynamodb.mjs";
import constants from "../../common/constants.mjs";
import {
  toSingleLineString,
  attemptToParseJSON,
} from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-dynamodb-put-item",
  name: "DynamoDB - Put Item",
  description: toSingleLineString(`
    Creates a new item, or replaces an old item with a new item.
    If an item that has the same primary key as the new item already exists in the specified table,
    the new item completely replaces the existing item.
    [See docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/putitemcommand.html)
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
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    tableName: {
      ...common.props.tableName,
      reloadProps: true,
    },
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
      props.item = {
        type: "string",
        label: "Item",
        description: "A valid JSON of attribute name/value pairs, one for each attribute. This object must have the following format: `{ \"AttributeName\": { \"AttributeType\": \"AttributeValue\" } }`. Example: `{\"genre\": { \"S\": \"rock\" }, \"hits\": { \"N\": \"1050\" } }`. [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/putitemcommandinput.html#item)",
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const item = {};
    const params = {
      TableName: this.tableName,
      ReturnValues: constants.dynamodb.returnValues.ALL_OLD,
    };

    const [
      primaryKey,
      secondaryKey,
    ] = await this.getTableAttributes(this.tableName);

    item[primaryKey.AttributeName] = {
      [primaryKey.AttributeType]: this.primaryKey,
    };

    if (secondaryKey) {
      item[secondaryKey.AttributeName] = {
        [secondaryKey.AttributeType]: this.secondaryKey,
      };
    }

    params.Item = {
      ...item,
      ...attemptToParseJSON(this.item),
    };

    const response = await this.putItem(params);
    $.export("$summary", `Successfully put item in table ${this.tableName}`);
    return response;
  },
};
