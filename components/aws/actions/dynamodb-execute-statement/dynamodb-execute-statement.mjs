// legacy_hash_id: a_l0i7r1
import AWS from "aws-sdk";

export default {
  key: "aws-dynamodb-execute-statement",
  name: "DynamoDB - Execute Statement",
  description: "This operation allows you to perform transactional reads or writes on data stored in DynamoDB, using PartiQL.",
  version: "0.1.1",
  type: "action",
  props: {
    aws: {
      type: "app",
      app: "aws",
    },
    transact_statements: {
      type: "any",
      description: "Array < map > of PartiQL statements representing the transaction to run. Each element in the  array is composed of:\n* Statement - A PartiQL statment that uses parameters (required).\n* Parameters - Array <map>with the parameter values.",
    },
    region: {
      type: "string",
      description: "The region to send service requests to.",
      optional: true,
    },
    client_request_token: {
      type: "string",
      description: "Set this value to get remaining results, if `NextToken` was returned in the statement response.",
      optional: true,
    },
  },
  async run() {
    //See the API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#executeTransaction-property

    const {
      accessKeyId,
      secretAccessKey,
    } = this.aws.$auth;

    if (!this.transact_statements || !this.region) {
      throw new Error("Must provide transact_statements, and region parameters.");
    }

    const dynamodb = new AWS.DynamoDB({
      accessKeyId,
      secretAccessKey,
      region: this.region,
    });

    //Prepares parameters of the request
    var dynamoDbParams = {
      TransactStatements: this.transact_statements,
      ClientRequestToken: this.client_request_token,
    };

    //Sends the request using the DynamoDB AWS object
    return await dynamodb.executeTransaction(dynamoDbParams).promise();
  },
};
