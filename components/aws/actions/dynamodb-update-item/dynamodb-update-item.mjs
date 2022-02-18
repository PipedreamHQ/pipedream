// legacy_hash_id: a_WYi4nE
import AWS from "aws-sdk";

export default {
  key: "aws-dynamodb-update-item",
  name: "DynamoDB - Update Item",
  description: "Updates an existing item's attributes, or adds a new item to the table if it does not already exist.",
  version: "0.1.1",
  type: "action",
  props: {
    aws: {
      type: "app",
      app: "aws",
    },
    table_name: {
      type: "string",
      description: "The name of the table containing the item to update.",
    },
    table_keys: {
      type: "object",
      description: "The primary key of the item to be updated. Each element consists of an attribute name and a value for that attribute.\n\nFor the primary key, you must provide all of the attributes. For example, with a simple primary key, you only need to provide a value for the partition key. For a composite primary key, you must provide values for both the partition key and the sort key.",
    },
    region: {
      type: "string",
      description: "The region to send service requests to.",
    },
    attribute_updates: {
      type: "object",
      description: "This is a legacy parameter. Use `UpdateExpression` instead. For more information, see [AttributeUpdates](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/LegacyConditionalParameters.AttributeUpdates.html) in the *Amazon DynamoDB Developer Guide*.",
      optional: true,
    },
    expected: {
      type: "object",
      description: "This is a legacy parameter. Use `ConditionExpression` instead. For more information, see [Expected](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/LegacyConditionalParameters.Expected.html) in the *Amazon DynamoDB Developer Guide*.",
      optional: true,
    },
    conditional_operator: {
      type: "string",
      description: "This is a legacy parameter. Use `ConditionExpression` instead. For more information, see [ConditionalOperator](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/LegacyConditionalParameters.ConditionalOperator.html) in the *Amazon DynamoDB Developer Guide*.",
      optional: true,
    },
    return_values: {
      type: "string",
      description: "Use `ReturnValues` if you want to get the item attributes as they appear before or after they are updated. For `UpdateItem`, the valid, possible values are:\n\n* `NONE` - If `ReturnValues` is not specified, or if its value is `NONE`, then nothing is returned. (This setting is the default for `ReturnValues`.)\n\n* `ALL_OLD` - Returns all of the attributes of the item, as they appeared before the `UpdateItem` operation.\n\n* `UPDATED_OLD` - Returns only the updated attributes, as they appeared before the `UpdateItem` operation.\n\n* `ALL_NEW` - Returns all of the attributes of the item, as they appear after the `UpdateItem` operation.\n\n* `UPDATED_NEW` - Returns only the updated attributes, as they appear after the UpdateItem operation.",
      optional: true,
      options: [
        "NONE",
        "ALL_OLD",
        "UPDATED_OLD",
        "ALL_NEW",
        "UPDATED_NEW",
      ],
    },
    return_consumed_capacity: {
      type: "string",
      description: "Determines the level of detail about provisioned throughput consumption that is returned in the response. Possible values include:  `INDEXES`, `TOTAL`, `NONE`.",
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
        "NOTE",
      ],
    },
    update_expression: {
      type: "string",
      description: "An expression that defines one or more attributes to be updated, the action to be performed on them, and new values for them. The following action values are available for `UpdateExpression`: `SET`, `REMOVE`, `ADD`, `DELETE`. You can have many actions in a single expression, such as the following: `SET a=:value1, b=:value2 DELETE :value3, :value4, :value5`\n\nFor more information on update expressions, see [Modifying Items and Attributes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.Modifying.html) in the *Amazon DynamoDB Developer Guide*.",
      optional: true,
    },
    condition_expression: {
      type: "string",
      description: "A condition that must be satisfied in order for a conditional update to succeed. An expression can contain any of the following: functions, comparison operators, logical operators. For more information about condition expressions, see [Condition Expressions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.SpecifyingConditions.html) in the *Amazon DynamoDB Developer Guide*.",
      optional: true,
    },
    expression_attribute_names: {
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
    // See the API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#updateItem-property

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

    //Prepares parameters of the request
    var dynamoDbParams = {
      Key: this.table_keys,
      TableName: this.table_name,
      AttributeUpdates: this.attribute_updates,
      Expected: this.expected,
      ConditionalOperator: this.conditional_operator,
      ReturnValues: this.return_values,
      ReturnConsumedCapacity: this.return_consumed_capacity,
      ReturnItemCollectionMetrics: this.return_item_collection_metrics,
      UpdateExpression: this.update_expression,
      ConditionExpression: this.condition_expression,
      ExpressionAttributeNames: this.expression_attribute_names,
      ExpressionAttributeValues: this.expression_attribute_values,
    };

    //Sends the request using the DynamoDB AWS object
    return await dynamodb.updateItem(dynamoDbParams).promise();
  },
};
