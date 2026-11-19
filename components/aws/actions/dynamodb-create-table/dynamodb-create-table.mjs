import common from "../../common/common-dynamodb.mjs";
import constants from "../../common/constants.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-dynamodb-create-table",
  name: "DynamoDB - Create Table",
  description: toSingleLineString(`
    Creates a new table to your account.
    [See docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/createtablecommand.html)
  `),
  version: "0.2.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    aws: common.props.aws,
    region: common.props.region,
    tableName: {
      type: common.props.tableName.type,
      label: common.props.tableName.label,
      description: common.props.tableName.description,
    },
    keyPrimaryAttributeName: common.props.keyPrimaryAttributeName,
    keyPrimaryAttributeType: common.props.keyPrimaryAttributeType,
    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    keySecondaryAttributeName: {
      ...common.props.keySecondaryAttributeName,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};

    if (this.keySecondaryAttributeName) {
      props.keySecondaryAttributeType = {
        type: "string",
        label: "Key Range Attribute Type",
        description: "The data type of the sort key",
        options: constants.dynamodb.keyAttributeTypes,
      };
    }

    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    props.billingMode = {
      ...common.props.billingMode,
      reloadProps: true,
    };

    if (this.billingMode === constants.dynamodb.billingModes.PROVISIONED) {
      props.readCapacityUnits = {
        type: "integer",
        label: "Read Capacity Units",
        description: "The maximum number of strongly consistent reads consumed per second before DynamoDB returns a `ThrottlingException`",
      };
      props.writeCapacityUnits = {
        type: "integer",
        label: "Write Capacity Units",
        description: "The maximum number of writes consumed per second before DynamoDB returns a `ThrottlingException`",
      };
    }

    // eslint-disable-next-line pipedream/props-label, pipedream/props-description
    props.streamSpecificationEnabled = {
      ...common.props.streamSpecificationEnabled,
      reloadProps: true,
    };

    if (this.streamSpecificationEnabled) {
      props.streamSpecificationViewType = {
        type: "string",
        label: "Stream Specification View Type",
        description: "When an item in the table is modified, StreamViewType determines what information is written to the table's stream. [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/createtablecommandinput.html#streamspecification)",
        options: constants.dynamodb.streamSpecificationViewTypes,
      };
    }

    return props;
  },
  async run({ $ }) {
    const params = {
      TableName: this.tableName,
      AttributeDefinitions: [
        {
          AttributeName: this.keyPrimaryAttributeName,
          AttributeType: this.keyPrimaryAttributeType,
        },
      ],
      KeySchema: [
        {
          AttributeName: this.keyPrimaryAttributeName,
          KeyType: constants.dynamodb.keyTypes.HASH,
        },
      ],
    };

    if (this.keySecondaryAttributeName && this.keySecondaryAttributeType) {
      params.AttributeDefinitions.push({
        AttributeName: this.keySecondaryAttributeName,
        AttributeType: this.keySecondaryAttributeType,
      });
      params.KeySchema.push({
        AttributeName: this.keySecondaryAttributeName,
        KeyType: constants.dynamodb.keyTypes.RANGE,
      });
    }

    if (this.billingMode) {
      params.BillingMode = this.billingMode;
      if (this.billingMode === constants.dynamodb.billingModes.PROVISIONED) {
        params.ProvisionedThroughput = {
          ReadCapacityUnits: this.readCapacityUnits,
          WriteCapacityUnits: this.writeCapacityUnits,
        };
      }
    }

    if (typeof (this.streamSpecificationEnabled) === "boolean") {
      params.StreamSpecification = {
        StreamEnabled: this.streamSpecificationEnabled,
      };
      if (this.streamSpecificationViewType) {
        params.StreamSpecification.StreamViewType = this.streamSpecificationViewType;
      }
    }

    const response = await this.createTable(params);
    $.export("$summary", `Created DynamoDB table ${this.tableName}`);
    return response;
  },
};
