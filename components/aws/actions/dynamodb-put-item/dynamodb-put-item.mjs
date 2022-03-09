import aws from "../../aws.app.mjs";
import constants from "../../common/constants.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "aws-dynamodb-put-item",
  name: "DynamoDB - Put Item",
  description: toSingleLineString(`
    Creates a new item, or replaces an old item with a new item.
    If an item that has the same primary key as the new item already exists in the specified table,
    the new item completely replaces the existing item.
    [See docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/putitemcommand.html)
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
  },
  methods: {
    async tableAttributeDefinitions(region, tableName) {
      const response = await this.aws.dynamodbDescribeTable(region, {
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
      props.item = {
        type: "object",
        label: "Item",
        description: "A map of attribute name/value pairs, one for each attribute. This JSON object must have the following format: `{ \"AttributeName\": { \"AttributeType\": \"AttributeValue\" } }`. Example: `{\"genre\": { \"S\": \"rock\" }, \"hits\": { \"N\": \"1050\" } }`. [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/putitemcommandinput.html#item)",
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const params = {
      TableName: this.tableName,
      ReturnValues: constants.dynamodb.returnValues.ALL_OLD,
      Item: {},
    };

    const [
      primaryKey,
      secondaryKey,
    ] = await this.tableAttributeDefinitions(this.region, this.tableName);

    params.Item[primaryKey.AttributeName] = {
      [primaryKey.AttributeType]: this.primaryKey,
    };

    if (secondaryKey) {
      params.Item[secondaryKey.AttributeName] = {
        [secondaryKey.AttributeType]: this.secondaryKey,
      };
    }

    const item = typeof(this.item) === "string"
      ? JSON.parse(this.item || "{}")
      : this.item;

    const response = await this.aws.dynamodbPutItem(this.region, {
      ...params.Item,
      ...item,
    });
    $.export("$summary", `Successfully put item in table ${this.tableName}`);
    return response;
  },
};
