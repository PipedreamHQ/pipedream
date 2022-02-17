// legacy_hash_id: a_OOibob
import AWS from "aws-sdk";

export default {
  key: "aws-dynamodb-query",
  name: "DynamoDB - Query",
  description: "The query operation finds items based on primary key values.",
  version: "0.4.1",
  type: "action",
  props: {
    aws: {
      type: "app",
      app: "aws",
    },
    key_condition_expression: {
      type: "string",
      description: "The condition that specifies the key values for items to be retrieved by the `Query` action. The condition must perform an equality test on a single partition key value. The condition can optionally perform one of several comparison tests on a single sort key value. This allows `Query` to retrieve one item with a given partition key value and sort key value, or several items that have the same partition key value but different sort key values.",
      optional: true,
    },
    key_conditions: {
      type: "object",
      description: "This is a legacy parameter. Use `KeyConditionExpression` instead. For more information, see [KeyConditions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/LegacyConditionalParameters.KeyConditions.html) in the *Amazon DynamoDB Developer Guide.*",
      optional: true,
    },
    table_name: {
      type: "string",
      description: "The name of the table containing the requested items.",
    },
    region: {
      type: "string",
      description: "The region to send service requests to.",
    },
    index_name: {
      type: "string",
      description: "The name of an index to query. This index can be any local secondary index or global secondary index on the table. Note that if you use the `IndexName` parameter, you must also provide `TableName`.",
      optional: true,
    },
    select: {
      type: "string",
      description: "The attributes to be returned in the result. You can retrieve all item attributes, specific item attributes, the count of matching items, or in the case of an index, some or all of the attributes projected into the index. Possible values: `ALL_ATTRIBUTES`, `ALL_PROJECTED_ATTRIBUTES`, `COUNT`, `SPECIFIC_ATTRIBUTES`",
      optional: true,
    },
    attributes_to_get: {
      type: "string",
      description: "This is a legacy parameter. Use `ProjectionExpression` instead. For more information, see [AttributesToGet](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/LegacyConditionalParameters.AttributesToGet.html) in the *Amazon DynamoDB Developer Guide.*",
      optional: true,
    },
    limit: {
      type: "integer",
      description: "The maximum number of items to evaluate (not necessarily the number of matching items). If DynamoDB processes the number of items up to the limit while processing the results, it stops the operation and returns the matching values up to that point, and a key in `LastEvaluatedKey` to apply in a subsequent operation, so that you can pick up where you left off. Also, if the processed dataset size exceeds 1 MB before DynamoDB reaches this limit, it stops the operation and returns the matching values up to the limit, and a key in `LastEvaluatedKey` to apply in a subsequent operation to continue the operation. For more information, see [Query and Scan](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/QueryAndScan.html) in the *Amazon DynamoDB Developer Guide.*",
      optional: true,
    },
    consistent_read: {
      type: "boolean",
      description: "Determines the read consistency model: If set to `true`, then the operation uses strongly consistent reads; otherwise, the operation uses eventually consistent reads. Strongly consistent reads are not supported on global secondary indexes. If you query a global secondary index with `ConsistentRead` set to `true`, you will receive a `ValidationException`.",
      optional: true,
    },
    query_filter: {
      type: "object",
      description: "This is a legacy parameter. Use `FilterExpression` instead. For more information, see [QueryFilter](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/LegacyConditionalParameters.QueryFilter.html) in the *Amazon DynamoDB Developer Guide.*",
      optional: true,
    },
    conditional_operator: {
      type: "string",
      description: "This is a legacy parameter. Use `FilterExpression` instead. For more information, see [ConditionalOperator](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/LegacyConditionalParameters.ConditionalOperator.html) in the *Amazon DynamoDB Developer Guide.*",
      optional: true,
    },
    scan_index_forward: {
      type: "boolean",
      description: "Specifies the order for index traversal: If `true` (default), the traversal is performed in ascending order; if `false`, the traversal is performed in descending order.",
      optional: true,
    },
    exclusive_startKey: {
      type: "object",
      description: "The primary key of the first item that this operation will evaluate. Use the value that was returned for `LastEvaluatedKey` in the previous operation.",
      optional: true,
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
    projection_expression: {
      type: "string",
      description: "A string that identifies one or more attributes to retrieve from the table. These attributes can include scalars, sets, or elements of a JSON document. The attributes in the expression must be separated by commas. If no attribute names are specified, then all attributes will be returned. If any of the requested attributes are not found, they will not appear in the result. For more information, see [Accessing Item Attributes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.AccessingItemAttributes.html) in the *Amazon DynamoDB Developer Guide.*",
      optional: true,
    },
    filter_expression: {
      type: "string",
      description: "A string that contains conditions that DynamoDB applies after the `Query` operation, but before the data is returned to you. Items that do not satisfy the `FilterExpression` criteria are not returned.\n\nA `FilterExpression` does not allow key attributes. You cannot define a filter expression based on a partition key or a sort key.",
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
    //See the API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#query-property

    const {
      accessKeyId,
      secretAccessKey,
    } = this.aws.$auth;

    if ( !(this.key_condition_expression
      ? !this.key_conditions
      : this.key_conditions ) || !this.table_name || !this.region) {
      throw new Error("Must provide exclusively key_condition_expression or key_conditions, and table_name, region  parameters.");
    }

    const dynamodb = new AWS.DynamoDB({
      accessKeyId,
      secretAccessKey,
      region: this.region,
    });

    //Prepares parameters of the request
    var dynamoDbParams = {
      TableName: this.table_name,
      IndexName: this.index_name,
      Select: this.select,
      AttributesToGet: this.attributes_to_get,
      Limit: this.limit,
      ConsistentRead: this.consistent_read,
      KeyConditions: this.key_conditions,
      QueryFilter: this.query_filter,
      ConditionalOperator: this.conditional_operator,
      ScanIndexForward: this.scan_index_forward,
      ExclusiveStartKey: this.exclusive_startKey,
      ReturnConsumedCapacity: this.return_consumed_capacity,
      ProjectionExpression: this.projection_expression,
      FilterExpression: this.filter_expression,
      KeyConditionExpression: this.key_condition_expression,
      ExpressionAttributeNames: this.expression_attributeNames,
      ExpressionAttributeValues: this.expression_attribute_values,
    };

    //Sends the request using the DynamoDB AWS object
    return await dynamodb.query(dynamoDbParams).promise();
  },
};
