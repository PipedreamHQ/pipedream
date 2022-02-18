// legacy_hash_id: a_nji8GN
import AWS from "aws-sdk";

export default {
  key: "aws-dynamodb-update-table",
  name: "DynamoDB - Update Table",
  description: "Modifies the provisioned throughput settings, global secondary indexes, or DynamoDB Streams settings for a given table.",
  version: "0.1.1",
  type: "action",
  props: {
    aws: {
      type: "app",
      app: "aws",
    },
    table_name: {
      type: "string",
      description: "The name of the table to update.",
      optional: true,
    },
    provisioned_throughput: {
      type: "object",
      description: "The new provisioned throughput settings for the specified table or index. Parameters properties are:\n* `ReadCapacityUnits`, required integer, max. number of strongly consistent reads consumed per second before DynamoDB returns a `ThrottlingException`.\n* `WriteCapacityUnits`, required integer, max. number of writes consumed per second before DynamoDB returns a `ThrottlingException`.",
      optional: true,
    },
    region: {
      type: "string",
      description: "The region to send service requests to.",
    },
    attribute_definitions: {
      type: "any",
      description: "An Array < map > of attributes that describe the key schema for the table and indexes. If you are adding a new global secondary index to the table, `AttributeDefinitions` must include the key element(s) of the new index. Each map element has the following properties:\n\n* `AttributeName`: Name for the attribute, required.\n\n* `AttributeType`:  The data type for the attribute, required; possible values: `S` for data type String, `N` for data type Number, and `B` for data type Binary.",
      optional: true,
    },
    global_secondary_index_updates: {
      type: "any",
      description: "An Array < map > of one or more global secondary indexes for the table. For each index in the array, you can request one action:\n* Create - add a new global secondary index to the table.\n* Update - modify the provisioned throughput settings of an existing global secondary index.\n* Delete - remove a global secondary index from the table.\nYou can create or delete only one global secondary index per `UpdateTable` operation.\nFor more information, see [Managing Global Secondary Indexes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.OnlineOps.html) in the *Amazon DynamoDB Developer Guide.*",
      optional: true,
    },
    billing_mode: {
      type: "string",
      description: "Controls how you are charged for read and write throughput and how you manage capacity. When switching from pay-per-request to provisioned capacity, initial provisioned capacity values must be set. The initial provisioned capacity values are estimated based on the consumed read and write capacity of your table and global secondary indexes over the past 30 minutes.\n\n* `PROVISIONED` - We recommend using `PROVISIONED` for predictable workloads. `PROVISIONED` sets the billing mode to [Provisioned Mode](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html#HowItWorks.ProvisionedThroughput.Manual).\n* `PAY_PER_REQUEST` - We recommend using `PAY_PER_REQUEST` for unpredictable workloads. `PAY_PER_REQUEST` sets the billing mode to [On-Demand Mode](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadWriteCapacityMode.html#HowItWorks.OnDemand).",
      optional: true,
      options: [
        "PROVISIONED",
        "PAY_PER_REQUEST",
      ],
    },
    stream_specification: {
      type: "object",
      description: "Represents the DynamoDB Streams configuration for the table. Note: You receive a `ResourceInUseException` if you try to enable a stream on a table that already has a stream, or if you try to disable a stream on a table that doesn't have a stream. This settings parameter consists of the following properties: \n* `StreamEnabled`: Indicates whether DynamoDB Streams is to be enabled (true) or disabled (false), boolean, required.\n* `StreamViewType`: When an item in the table is modified, `StreamViewType` determines what information is written to the table's stream. Valid values: `KEYS_ONLY`, `NEW_IMAGE`, `OLD_IMAGE`, `NEW_AND_OLD_IMAGES`",
      optional: true,
    },
    sse_specification: {
      type: "object",
      description: "The new server-side encryption settings for the specified table.",
      optional: true,
    },
    replica_updates: {
      type: "any",
      description: "Array < map > of replica update actions (create, delete, or update) for the table. This property only applies to [Version 2019.11.21](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/globaltables.V2.html) of global tables.",
      optional: true,
    },
  },
  async run() {
    //See the API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#updateTable-property

    const {
      accessKeyId,
      secretAccessKey,
    } = this.aws.$auth;

    if (!this.table_name || !this.provisioned_throughput || !this.region) {
      throw new Error("Must provide table_name, provisioned_throughput, and region parameters.");
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
      GlobalSecondaryIndexUpdates: this.global_secondary_index_updates,
      BillingMode: this.billing_mode,
      ProvisionedThroughput: this.provisioned_throughput,
      StreamSpecification: this.stream_specification,
      SSESpecification: this.sse_specification,
      ReplicaUpdates: this.replica_updates,
    };

    //Sends the request using the DynamoDB AWS object
    return await dynamodb.updateTable(dynamoDbParams).promise();
  },
};
