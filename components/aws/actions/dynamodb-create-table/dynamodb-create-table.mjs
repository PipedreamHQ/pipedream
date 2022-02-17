// legacy_hash_id: a_dvirB4
import AWS from "aws-sdk";

export default {
  key: "aws-dynamodb-create-table",
  name: "DynamoDB - Create Table",
  description: "Adds a new table to your account.",
  version: "0.1.1",
  type: "action",
  props: {
    aws: {
      type: "app",
      app: "aws",
    },
    stream_specification: {
      type: "object",
      description: "The settings parameter for DynamoDB Streams on the table. This settings parameter consists of the following properties: \n* `StreamEnabled`: Indicates whether DynamoDB Streams is to be enabled (true) or disabled (false), boolean, required.\n* `StreamViewType`: When an item in the table is modified, `StreamViewType` determines what information is written to the table's stream. Valid values: `KEYS_ONLY`, `NEW_IMAGE`, `OLD_IMAGE`, `NEW_AND_OLD_IMAGES`",
      optional: true,
    },
    attribute_definitions: {
      type: "any",
      description: "An Array < map > of attributes that describe the key schema for the table and indexes. Each map element has the following properties:\n\n* `AttributeName`: Name for the attribute, required.\n\n* `AttributeType`:  The data type for the attribute, required; possible values: `S` for data type String, `N` for data type Number, and `B` for data type Binary.",
      optional: true,
    },
    table_name: {
      type: "string",
      description: "The name of the table to create.",
      optional: true,
    },
    key_schema: {
      type: "any",
      description: "An Array < map > that specifies the attributes that make up the primary key for a table or an index. The attributes in `KeySchema` must also be defined in the `AttributeDefinitions` array. For more information, see [Data Model](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DataModel.html) in the *Amazon DynamoDB Developer Guide*. Each `KeySchemaElement` in the array is composed of:\n\n* `AttributeName`, The name of this key attribute.\n\n* `KeyType` - The role that key attribute will assume. Possible values: `HASH` - for partition key, and `RANGE` for sort key.",
      optional: true,
    },
    region: {
      type: "string",
      description: "The region to send service requests to.",
    },
    provisioned_throughput: {
      type: "object",
      description: "Represents the provisioned throughput settings for a specified table or index. If you set BillingMode as PROVISIONED, you must specify this property. Parameters properties are:\n* `ReadCapacityUnits`, required integer, max. number of strongly consistent reads consumed per second before DynamoDB returns a `ThrottlingException`.\n* `WriteCapacityUnits`, required integer, max. number of writes consumed per second before DynamoDB returns a `ThrottlingException`.",
      optional: true,
    },
    local_secondary_indexes: {
      type: "any",
      description: "An Array < map > that specifies that one or more local secondary indexes (the maximum is 5) to be created on the table. Each index is scoped to a given partition key value. There is a 10 GB size limit per partition key value; otherwise, the size of a local secondary index is unconstrained.",
      optional: true,
    },
    global_secondary_indexes: {
      type: "any",
      description: "An Array < map > that specifies that one or more global secondary indexes (the maximum is 20) to be created on the table.",
      optional: true,
    },
    billing_mode: {
      type: "string",
      description: "Controls how you are charged for read and write throughput and how you manage capacity. This setting can be changed later.\n\n* `PROVISIONED` - We recommend using `PROVISIONED` for predictable workloads. `PROVISIONED` sets the billing mode to [Provisioned Mode](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html#HowItWorks.ProvisionedThroughput.Manual).\n\n* `PAY_PER_REQUEST` - We recommend using `PAY_PER_REQUEST` for unpredictable workloads. `PAY_PER_REQUEST` sets the billing mode to [On-Demand Mode](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html#HowItWorks.OnDemand).",
      optional: true,
      options: [
        "PROVISIONED",
        "PAY_PER_REQUEST",
      ],
    },
    sse_specification: {
      type: "object",
      description: "Represents the settings used to enable server-side encryption.",
      optional: true,
    },
    tags: {
      type: "any",
      description: "A list of key-value pairs to label the table. For more information, see [Tagging for DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Tagging.html). \n* `Key`: The key of the tag. Tag keys are case sensitive. Each DynamoDB table can only have up to one tag with the same key. If you try to add an existing tag (same key), the existing tag value will be updated to the new value.\n* `Value`: The value of the tag. Tag values are case-sensitive and can be null.",
      optional: true,
    },
  },
  async run() {
    // See the API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#createTable-property

    const {
      accessKeyId,
      secretAccessKey,
    } = this.aws.$auth;
    const streamSpecification = this.stream_specification;

    if (!this.attribute_definitions || !this.table_name || !this.key_schema ||
          !this.region || (typeof streamSpecification.StreamEnabled == "undefined") || !this.provisioned_throughput) {
      throw new Error("Must provide attribute_definitions, table_name, key_schema, region, stream_specification.StreamEnabled, provisioned_throughput parameters.");
    }

    const dynamodb = new AWS.DynamoDB({
      accessKeyId,
      secretAccessKey,
      region: this.region,
    });

    //Prepares parameters of the request
    var dynamoDbParams = {
      AttributeDefinitions: this.attribute_definitions,
      TableName: this.table_name,
      KeySchema: this.key_schema,
      LocalSecondaryIndexes: this.local_secondary_indexes,
      GlobalSecondaryIndexes: this.global_secondary_indexes,
      BillingMode: this.billing_mode,
      ProvisionedThroughput: this.provisioned_throughput,
      StreamSpecification: this.stream_specification,
      SSESpecification: this.sse_specification,
      Tags: this.tags,
    };

    //Sends the request using the DynamoDB AWS object
    return await dynamodb.createTable(dynamoDbParams).promise();
  },
};
