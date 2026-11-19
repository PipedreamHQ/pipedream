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
      description: "The name of the table. Run **DynamoDB - List Tables** to find table names.",
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
        Required for any attribute whose name is a DynamoDB reserved word (e.g. \`status\`, \`name\`, \`total\`, \`data\`, \`timestamp\`):
        write \`#s\` in the expression and map it here.
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
        Write attribute names that are DynamoDB reserved words (e.g. \`status\`, \`name\`, \`total\`, \`data\`) as a placeholder like \`#s\`
        and define it in \`expressionAttributeNames\`, e.g. \`#s = :status\` with \`{ "#s": "status" }\`.
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
        Write attribute names that are DynamoDB reserved words (e.g. \`status\`, \`name\`, \`total\`, \`data\`) as a placeholder like \`#s\`
        and define it in \`expressionAttributeNames\`.
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
        A string expression that determines which items should be returned, e.g. \`#t > :min\`.
        Write attribute names that are DynamoDB reserved words (e.g. \`status\`, \`name\`, \`total\`, \`data\`) as a placeholder like \`#t\`
        and define it in \`expressionAttributeNames\`, e.g. \`{ "#t": "total" }\`.
        [See the docs](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html#Query.FilterExpression)
      `),
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The maximum number of items DynamoDB reads per request (the page size), before any filter expression is applied. It does not cap the total returned: use `Max Items` for that. When omitted, DynamoDB reads up to 1 MB per request.",
      optional: true,
    },
    maxItems: {
      type: "integer",
      label: "Max Items",
      description: `The maximum number of items to return in total, e.g. \`100\`. When omitted, every matching item is returned (a single call stops after ${constants.dynamodb.MAX_REQUESTS} requests). Set it when you only need a sample or the table may be large, so the result stays small. When more items are available, the result has \`truncated\` set to \`true\` and a \`nextContinuationKey\` to pass as \`Continuation Key\` to read the next page. With a filter expression the result can hold a few more items than this.`,
      optional: true,
      min: 1,
    },
    continuationKey: {
      type: "string",
      label: "Continuation Key",
      description: "The `nextContinuationKey` from the previous result, as JSON, e.g. `{\"id\": {\"S\": \"123\"}}`. Leave empty to start from the beginning.",
      optional: true,
    },
    indexName: {
      type: "string",
      label: "Index Name",
      description: "The name of a local or global secondary index to query instead of the table itself. The key condition then applies to that index's keys. Leave empty to query the table.",
      optional: true,
    },
    nextToken: {
      type: "string",
      label: "Next Token",
      description: "The `nextToken` from the previous result of a `SELECT` statement. Leave empty to start from the beginning.",
      optional: true,
    },
  },
  methods: {
    /**
     * Reads pages from a Scan, Query or ExecuteStatement call until `maxItems`
     * items are collected (no limit when it is omitted), the data runs out, or
     * `MAX_REQUESTS` requests have been made.
     *
     * Without a filter, pages are sized so one never returns more than the items
     * still needed, which keeps the returned continuation key exact: reading from
     * it resumes right after the last returned item, with nothing skipped. With a
     * filter (`filtered`), DynamoDB's `Limit` counts items read rather than
     * matches, so pages are never sized below `FILTER_PAGE_FLOOR`; the last page
     * can then hold a few more than `maxItems`, and the key is still exact.
     *
     * @returns {Promise<object>} `{ items, scannedCount, nextKey, requests, metadata }`;
     * `nextKey` is set whenever data may remain, including when the request cap
     * stopped the read early
     */
    async readPages({
      fn, params, maxItems = Infinity, pageSize, filtered = false, startKey, startKeyAttr, nextKeyAttr,
    }) {
      const items = [];
      let scannedCount = 0;
      let requests = 0;
      let key = startKey;
      let metadata;
      do {
        const remaining = maxItems - items.length;
        const needed = filtered
          ? Math.max(remaining, constants.dynamodb.FILTER_PAGE_FLOOR)
          : remaining;
        const limit = Math.min(pageSize ?? needed, needed);
        const response = await fn.call(this, {
          ...params,
          ...(Number.isFinite(limit) && {
            Limit: limit,
          }),
          ...(key && {
            [startKeyAttr]: key,
          }),
        });
        requests++;
        items.push(...(response.Items ?? []));
        scannedCount += response.ScannedCount ?? 0;
        key = response[nextKeyAttr];
        metadata = response.$metadata;
      } while (key && items.length < maxItems && requests < constants.dynamodb.MAX_REQUESTS);
      return {
        items,
        scannedCount,
        nextKey: key,
        requests,
        metadata,
      };
    },
    /**
     * Builds the result of a paged read, with the "is there more" fields first
     * so they are seen before a long list of items.
     */
    formatPages({
      items, scannedCount, nextKey, metadata,
    }) {
      return {
        truncated: Boolean(nextKey),
        nextContinuationKey: nextKey ?? null,
        Count: items.length,
        ScannedCount: scannedCount,
        Items: items,
        // kept from the previous output (the last request's) for workflows that read it
        $metadata: metadata,
      };
    },
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
