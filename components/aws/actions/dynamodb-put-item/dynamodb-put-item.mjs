// legacy_hash_id: a_RAiXL5
import AWS from "aws-sdk";

export default {
  key: "aws-dynamodb-put-item",
  name: "DynamoDB - Put Item",
  description: "Creates a new item, or replaces an old item with a new item.",
  version: "0.1.1",
  type: "action",
  props: {
    aws: {
      type: "app",
      app: "aws",
    },
    table_name: {
      type: "string",
      description: "The name of the table to contain the item.",
    },
    item: {
      type: "object",
      description: "A map of attribute name/value pairs, one for each attribute. Only the primary key attributes are required; you can optionally provide other attribute name-value pairs for the item.\n\nYou must provide all of the attributes for the primary key. For example, with a simple primary key, you only need to provide a value for the partition key. For a composite primary key, you must provide both values for both the partition key and the sort key.\n\nIf you specify any attributes that are part of an index key, then the data types for those attributes must match those of the schema in the table's attribute definition.",
      optional: true,
    },
    region: {
      type: "string",
      description: "The region to send service requests to.",
      optional: true,
    },
    expected: {
      type: "object",
      description: "This is a legacy parameter. Use |ConditionExpression| instead. For more information, see [Expected](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/LegacyConditionalParameters.Expected.html) in the *Amazon DynamoDB Developer Guide.*",
      optional: true,
    },
    return_values: {
      type: "string",
      description: "Use `ReturnValues` if you want to get the item attributes as they appeared before they were updated with the `PutItem` request. For `PutItem`, the valid values are:\n\n`NONE` - If `ReturnValues` is not specified, or if its value is `NONE`, then nothing is returned. (This setting is the default for `ReturnValues`.)\n\n`ALL_OLD` - If `PutItem` overwrote an attribute name-value pair, then the content of the old item is returned.",
      optional: true,
      options: [
        "NONE",
        "ALL_OLD",
      ],
    },
    return_consumed_capacity: {
      type: "string",
      description: "Determines the level of detail about provisioned throughput consumption that is returned in the response. Possible values include: `INDEXES`, `TOTAL`, `NONE`.",
      optional: true,
      options: [
        "INDEXES",
        "TOTAL",
        "NONE",
      ],
    },
    return_item_collection_metrics: {
      type: "string",
      description: "Determines whether item collection metrics are returned. If set to `SIZE`, the response includes statistics about item collections, if any, that were modified during the operation are returned in the response. If set to `NONE` (the default), no statistics are returned. Possible values include: `SIZE`, `NONE`.",
      optional: true,
      options: [
        "SIZE",
        "NONE",
      ],
    },
    conditional_operator: {
      type: "string",
      description: "This is a legacy parameter. Use `ConditionExpression` instead. For more information, see [ConditionalOperator](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/LegacyConditionalParameters.ConditionalOperator.html) in the *Amazon DynamoDB Developer Guide*.",
      optional: true,
    },
    condition_expression: {
      type: "string",
      description: "A condition that must be satisfied in order for a conditional `PutItem` to succeed. An expression can contain any of the following: functions, comparison operators, logical operators. For more information about condition expressions, see [Condition Expressions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.SpecifyingConditions.html) in the *Amazon DynamoDB Developer Guide*.",
      optional: true,
    },
    expression_attributeNames: {
      type: "object",
      description: "One or more substitution tokens for attribute names in an expression. The following are some use cases for using `ExpressionAttributeNames`:\n\n* To access an attribute whose name conflicts with a DynamoDB reserved word.\n* To create a placeholder for repeating occurrences of an attribute name in an expression.\n* To prevent special characters in an attribute name from being misinterpreted in an expression.\n\nUse the # character in an expression to dereference an attribute name.",
      optional: true,
    },
    expression_attribute_values: {
      type: "object",
      description: "One or more values that can be substituted in an expression. Use the : (colon) character in an expression to dereference an attribute value. For more information on expression attribute values, see [Condition Expressions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.SpecifyingConditions.html) in the *Amazon DynamoDB Developer Guide*.",
      optional: true,
    },
  },
  async run() {
    //See the API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#putItem-property

    const {
      accessKeyId,
      secretAccessKey,
    } = this.aws.$auth;

    if (!this.table_name || !this.item || !this.region) {
      throw new Error("Must provide table_name, item, and region parameters.");
    }

    const dynamodb = new AWS.DynamoDB({
      accessKeyId,
      secretAccessKey,
      region: this.region,
    });

    //Prepares parameters of the request
    var dynamoDbParams = {
      TableName: this.table_name,
      Item: this.item,
      Expected: this.expected,
      ReturnValues: this.return_values,
      ReturnConsumedCapacity: this.return_consumed_capacity,
      ReturnItemCollectionMetrics: this.return_item_collection_metrics,
      ConditionalOperator: this.conditional_operator,
      ConditionExpression: this.condition_expression,
      ExpressionAttributeNames: this.expression_attributeNames,
      ExpressionAttributeValues: this.expression_attribute_values,
    };

    //Sends the request using the DynamoDB AWS object
    return await dynamodb.putItem(dynamoDbParams).promise();
  },
};
