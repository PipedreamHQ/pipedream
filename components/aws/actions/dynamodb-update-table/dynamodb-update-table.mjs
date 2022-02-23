import aws from "../../aws.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "aws-dynamodb-update-table",
  name: "AWS - DynamoDB - Update Table",
  description: "Modifies the settings for a given table. Only one type of modification is permitted per request. [See docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/updatetablecommand.html)",
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
        (c) => ({
          region: c.region,
        }),
      ],
    },
    billingMode: {
      propDefinition: [
        aws,
        "billingMode",
      ],
      reloadProps: true,
    },
    streamSpecificationEnabled: {
      propDefinition: [
        aws,
        "streamSpecificationEnabled",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
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
    };

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

    const response = this.aws.dynamoDBUpdateTable(this.region, params);
    $.export("$summary", `Updated DynamoDB table ${this.tableName}`);
    return response;
  },
};
