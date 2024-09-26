import aws from "../aws.app.mjs";
import {
  DynamoDBClient,
  ListTablesCommand,
  DescribeTableCommand,
  CreateTableCommand,
  UpdateTableCommand,
  ExecuteStatementCommand,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import constants from "./constants.mjs";
import { toSingleLineString } from "./utils.mjs";

export default {
  props: {
    aws,
    region: {
      propDefinition: [
        aws,
        "region",
      ],
    },
    tableName: {
      type: "string",
      label: "Table Name",
      description: "The name of the table",
      async options({ prevContext }) {
        const {
          TableNames,
          LastEvaluatedTableName,
        } = await this.listTables({
          ExclusiveStartTableName: prevContext.lastEvaluatedTableName,
        });
        return {
          options: TableNames,
          context: {
            lastEvaluatedTableName: LastEvaluatedTableName,
          },
        };
      },
    },
    keyPrimaryAttributeName: {
      type: "string",
      label: "Key Hash Attribute Name",
      description: "The name of the partition key",
    },
    keyPrimaryAttributeType: {
      type: "string",
      label: "Key Hash Attribute Type",
      description: "The data type of the primary key",
      options: constants.dynamodb.keyAttributeTypes,
    },
    keySecondaryAttributeName: {
      type: "string",
      label: "Key Range Attribute Name",
      description: "The name of the sort key",
      optional: true,
    },
    keySecondaryAttributeType: {
      type: "string",
      label: "Key Range Attribute Type",
      description: "The data type of the sort key",
      options: constants.dynamodb.keyAttributeTypes,
      optional: true,
    },
    billingMode: {
      type: "string",
      label: "Billing Mode",
      description: "Controls how you are charged for read and write throughput and how you manage capacity",
      options: Object.keys(constants.dynamodb.billingModes),
    },
    streamSpecificationEnabled: {
      type: "boolean",
      label: "Stream Specification Enabled",
      description: "Indicates whether DynamoDB Streams is to be enabled (`true`) or disabled (`false`)",
      optional: true,
    },
    streamSpecificationViewType: {
      type: "string",
      label: "Stream Specification View Type",
      description: toSingleLineString(`
        When an item in the table is modified, StreamViewType determines what information is written to the table's stream.
        [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/createtablecommandinput.html#streamspecification)
      `),
      optional: true,
      options: constants.dynamodb.streamSpecificationViewTypes,
    },
    updateExpression: {
      type: "string",
      label: "Update Expression",
      description: toSingleLineString(`
        An expression that defines one or more attributes to be updated, the action to be performed on them, and new values for them.
        Example:
        \`SET command = :echo, #execs = :oneh\`
        [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/modules/updateiteminput.html#updateexpression)
      `),
      optional: true,
    },
    expressionAttributeNames: {
      type: "string",
      label: "Expression Attribute Names",
      description: toSingleLineString(`
        One or more substitution tokens for attribute names in an expression.
        Example:
        \`
        {
          "#execs": "execs"
        }
        \`
        [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/modules/updateiteminput.html#expressionattributenames)
      `),
      optional: true,
    },
    expressionAttributeValues: {
      type: "string",
      label: "Expression Attribute Values",
      description: toSingleLineString(`
        One or more values that can be substituted in an expression.
        Use the : (colon) character in an expression to dereference an attribute value.
        Example:
        \`
        {
          ":echo": {
              "S": "echo"
            },
          ":oneh": {
            "N": "100"
          }
        }
        \`
        [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/modules/updateiteminput.html#expressionattributevalues)
      `),
      optional: true,
    },
    keyConditionExpression: {
      type: "string",
      label: "Key Condition Expression",
      description: toSingleLineString(`
        The condition that specifies the key values for items to be retrieved by the Query action.
        Example:
        \`
        partitionKeyName = :partitionkeyval AND sortKeyName = :sortkeyval
        \`
        [See the docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/interfaces/querycommandinput.html#keyconditionexpression)
      `),
    },
    projectionExpression: {
      type: "string",
      label: "Projection Expression",
      description: toSingleLineString(`
        A string that identifies one or more attributes to retrieve from the specified table or index.
        If no attribute names are specified, then all attributes will be returned.
        If any of the requested attributes are not found, they will not appear in the result.
      `),
      optional: true,
    },
    statement: {
      type: "string",
      label: "Statement",
      description: "The PartiQL statement representing the operation to run",
    },
    parameters: {
      type: "string[]",
      label: "Parameters",
      description: "The parameters for the PartiQL statement, if any",
      optional: true,
    },
    filterExpression: {
      type: "string",
      label: "Filter Expression",
      description: toSingleLineString(`
        A string expression that determines which items should be returned.
        [See the docs](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html#Query.FilterExpression)
      `),
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of items to evaluate (not necessarily the number of matching items)",
      optional: true,
    },
  },
  methods: {
    _clientDynamodb() {
      return this.aws.getAWSClient(DynamoDBClient, this.region);
    },
    async listTables(params) {
      return this._clientDynamodb().send(new ListTablesCommand(params));
    },
    async describeTable(params) {
      return this._clientDynamodb().send(new DescribeTableCommand(params));
    },
    async getTableAttributes(tableName) {
      const response = await this.describeTable({
        TableName: tableName,
      });
      return response.Table.AttributeDefinitions;
    },
    async createTable(params) {
      return this._clientDynamodb().send(new CreateTableCommand(params));
    },
    async updateTable(params) {
      return this._clientDynamodb().send(new UpdateTableCommand(params));
    },
    async executeTransaction(params) {
      return this._clientDynamodb().send(new ExecuteStatementCommand(params));
    },
    async getItem(params) {
      return this._clientDynamodb().send(new GetItemCommand(params));
    },
    async putItem(params) {
      return this._clientDynamodb().send(new PutItemCommand(params));
    },
    async query(params) {
      return this._clientDynamodb().send(new QueryCommand(params));
    },
    async scan(params) {
      return this._clientDynamodb().send(new ScanCommand(params));
    },
    async updateItem(params) {
      return this._clientDynamodb().send(new UpdateItemCommand(params));
    },
  },
};
