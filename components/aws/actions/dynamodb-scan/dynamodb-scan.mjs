// legacy_hash_id: a_bKirwV
import AWS from "aws-sdk";

export default {
  key: "aws-dynamodb-scan",
  name: "DynamoDB - Scan",
  description: "The Scan operation returns one or more items and item attributes by accessing every item in a table or a secondary index.",
  version: "0.1.1",
  type: "action",
  props: {
    aws: {
      type: "app",
      app: "aws",
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
      description: "The name of a secondary index to scan. This index can be any local secondary index or global secondary index. Note that if you use the `IndexName` parameter, you must also provide `TableName`.",
      optional: true,
    },
    select: {
      type: "string",
      description: "The attributes to be returned in the result. You can retrieve all item attributes, specific item attributes, the count of matching items, or in the case of an index, some or all of the attributes projected into the index. Possible values: `ALL_ATTRIBUTES`, `ALL_PROJECTED_ATTRIBUTES`, `COUNT`, `SPECIFIC_ATTRIBUTES`",
      optional: true,
      options: [
        "ALL_ATTRIBUTES",
        "ALL_PROJECTED_ATTRIBUTES",
        "COUNT",
        "SPECIFIC_ATTRIBUTES",
      ],
    },
    attributes_to_get: {
      type: "any",
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
      description: "A Boolean value that determines the read consistency model during the scan:\nIf `ConsistentRead` is `false`, then the data returned from `Scan` might not contain the results from other recently completed write operations (`PutItem`, `UpdateItem`, or `DeleteItem`).\n\nIf `ConsistentRead` is `true`, then all of the write operations that completed before the `Scan` began are guaranteed to be contained in the `Scan` response.",
      optional: true,
    },
    total_segments: {
      type: "integer",
      description: "For a parallel `Scan` request, `TotalSegments` represents the total number of segments into which the `Scan` operation will be divided. The value of `TotalSegments` corresponds to the number of application workers that will perform the parallel scan. For example, if you want to use four application threads to scan a table or an index, specify a `TotalSegments` value of 4. The value for `TotalSegments` must be greater than or equal to 1, and less than or equal to 1000000. If you specify a `TotalSegments` value of 1, the `Scan` operation will be sequential rather than parallel.\n\nIf you specify `TotalSegments,` you must also specify `Segment`.",
      optional: true,
    },
    segment: {
      type: "boolean",
      description: "For a parallel `Scan` request, `Segment` identifies an individual segment to be scanned by an application worker.\n\nSegment IDs are zero-based, so the first segment is always 0. For example, if you want to use four application threads to scan a table or an index, then the first thread specifies a `Segment` value of 0, the second thread specifies 1, and so on.\n\nThe value of `LastEvaluatedKey` returned from a parallel Scan request must be used as ExclusiveStartKey with the same segment ID in a subsequent `Scan` operation.\n\nThe value for `Segment` must be greater than or equal to 0, and less than the value provided for `TotalSegments`.\n\nIf you provide `Segment`, you must also provide `TotalSegments`.",
      optional: true,
    },
    scan_filter: {
      type: "object",
      description: "This is a legacy parameter. Use `FilterExpression` instead. For more information, see `ScanFilter` in the *Amazon DynamoDB Developer Guide.*",
      optional: true,
    },
    conditional_operator: {
      type: "string",
      description: "This is a legacy parameter. Use `FilterExpression` instead. For more information, see [ConditionalOperator](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/LegacyConditionalParameters.ConditionalOperator.html) in the *Amazon DynamoDB Developer Guide.*",
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
      description: "A string that identifies one or more attributes to retrieve from the specified table or index. These attributes can include scalars, sets, or elements of a JSON document. The attributes in the expression must be separated by commas.\n\nIf no attribute names are specified, then all attributes will be returned. If any of the requested attributes are not found, they will not appear in the result.\n\nFor more information, see [Specifying Item Attributes](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.AccessingItemAttributes.html) in the *Amazon DynamoDB Developer Guide.*",
      optional: true,
    },
    filter_expression: {
      type: "string",
      description: "A string that contains conditions that DynamoDB applies after the `Scan` operation, but before the data is returned to you. Items that do not satisfy the `FilterExpression` criteria are not returned. Note: A `FilterExpression` is applied after the items have already been read; the process of filtering does not consume any additional read capacity units. For more information, see [Filter Expressions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/QueryAndScan.html#FilteringResults) in the *Amazon DynamoDB Developer Guide.*",
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
    //See the API docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#scan-property

    const {
      accessKeyId,
      secretAccessKey,
    } = this.aws.$auth;

    if (!this.table_name || !this.region) {
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
      Limit: parseInt(this.limit),
      ConsistentRead: this.consistent_read,
      TotalSegments: parseInt(this.total_segments),
      Segment: parseInt(this.segment),
      ScanFilter: this.scan_filter,
      ConditionalOperator: this.conditional_operator,
      ExclusiveStartKey: this.exclusive_startKey,
      ReturnConsumedCapacity: this.return_consumed_capacity,
      ProjectionExpression: this.projection_expression,
      FilterExpression: this.filter_expression,
      ExpressionAttributeNames: this.expression_attributeNames,
      ExpressionAttributeValues: this.expression_attribute_values,

    };

    //Sends the request using the DynamoDB AWS object
    return await dynamodb.scan(dynamoDbParams).promise();
  },
};
