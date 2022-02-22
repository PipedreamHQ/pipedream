// legacy_hash_id: a_3Li6pk
import AWS from "aws-sdk";

export default {
  key: "aws-dynamodb-get-item",
  name: "DynamoDB - Get Item",
  description: "The GetItem operation returns a set of attributes for the item with the given primary key. If there is no matching item, GetItem does not return any data and there will be no Item element in the response.",
  version: "0.1.1",
  type: "action",
  props: {
    aws: {
      type: "app",
      app: "aws",
    },
    table_name: {
      type: "string",
      description: "Name of table where item to get is located.",
    },
    table_keys: {
      type: "string",
      description: "A map of attribute names to `AttributeValue` objects, representing the primary key of the item to retrieve.\n\nFor the primary key, you must provide all of the attributes. For example, with a simple primary key, you only need to provide a value for the partition key. For a composite primary key, you must provide values for both the partition key and the sort key.",
    },
    region: {
      type: "string",
      description: "The AWS region to send service requests to.",
    },
  },
  async run() {
    //See the API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#getItem-property

    const {
      table_name,
      table_keys,
      region,
    } = this;
    const {
      accessKeyId,
      secretAccessKey,
    } = this.aws.$auth;

    if (!table_name || !table_keys || !region) {
      throw new Error("Must provide table_name, table_keys, and region parameters.");
    }

    const dynamodb = new AWS.DynamoDB({
      accessKeyId,
      secretAccessKey,
      region,
    });

    //Prepares requets parameters and sends the AWS service request
    const dynamoDbParams = {
      Key: table_keys,
      TableName: table_name,
    };

    return await dynamodb.getItem(dynamoDbParams).promise();
  },
};
