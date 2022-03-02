import aws from "../../aws.app.mjs";
import { toSingleLineString } from "../../sources/common/utils.mjs";

export default {
  key: "aws-dynamodb-get-item",
  name: "AWS - DynamoDB - Get Item",
  description: toSingleLineString(`
    The Get Item operation returns a set of attributes for the item with the given primary key.
    If there is no matching item, Get Item does not return any data and there will be no Item element in the response.
    [See docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/getitemcommand.html)
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
    }
    return props;
  },
  async run({ $ }) {
    const params = {
      TableName: this.tableName,
      Key: {},
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

    const response = await this.aws.dynamodbGetItem(this.region, params);
    if (response.Item) {
      $.export("$summary", `Successfully got item in table ${this.tableName}`);
    } else {
      $.export("$summary", `Item in table ${this.tableName} was not found`);
    }
    return response;
  },
};
