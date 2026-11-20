import common from "../../common/common-dynamodb.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-dynamodb-describe-table",
  name: "DynamoDB - Describe Table",
  description: toSingleLineString(`
    Returns a DynamoDB table's structure: its key schema (partition and sort key names and types), billing mode, item count and secondary indexes.
    Use it to find the \`indexName\` for **DynamoDB - Query**, and the key attribute names to use in its \`keyConditionExpression\`.
    Secondary indexes come back in \`globalSecondaryIndexes\` and \`localSecondaryIndexes\`, each with its \`name\` and \`keySchema\`; both are empty arrays when the table has none.
    Find the \`tableName\` with **DynamoDB - List Tables**.
    \`itemCount\` is approximate: DynamoDB refreshes it about every six hours, so don't use it as an exact count.
    Example result: \`{ "name": "Orders", "status": "ACTIVE", "billingMode": "PAY_PER_REQUEST", "itemCount": 250, "keySchema": [{ "attribute": "customerId", "keyType": "HASH", "type": "S" }, { "attribute": "orderId", "keyType": "RANGE", "type": "S" }], "globalSecondaryIndexes": [{ "name": "status-index", "keySchema": [{ "attribute": "status", "keyType": "HASH", "type": "S" }], "projection": "ALL", "status": "ACTIVE" }], "localSecondaryIndexes": [] }\`.
    [See the documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DescribeTable.html)
  `),
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    aws: common.props.aws,
    region: common.props.region,
    tableName: common.props.tableName,
  },
  async run({ $ }) {
    const { Table: table } = await this.describeTable({
      TableName: this.tableName,
    });

    // Key schemas only name the attributes; their types live in AttributeDefinitions
    const types = Object.fromEntries((table.AttributeDefinitions ?? []).map(({
      AttributeName: attribute, AttributeType: type,
    }) => [
      attribute,
      type,
    ]));
    const keySchema = (schema) => (schema ?? []).map(({
      AttributeName: attribute, KeyType: keyType,
    }) => ({
      attribute,
      keyType,
      type: types[attribute],
    }));
    const indexes = (list) => (list ?? []).map((index) => ({
      name: index.IndexName,
      keySchema: keySchema(index.KeySchema),
      projection: index.Projection?.ProjectionType,
      ...(index.IndexStatus && {
        status: index.IndexStatus,
      }),
    }));

    const result = {
      name: table.TableName,
      status: table.TableStatus,
      billingMode: table.BillingModeSummary?.BillingMode ?? "PROVISIONED",
      itemCount: table.ItemCount,
      keySchema: keySchema(table.KeySchema),
      globalSecondaryIndexes: indexes(table.GlobalSecondaryIndexes),
      localSecondaryIndexes: indexes(table.LocalSecondaryIndexes),
    };

    const count = result.globalSecondaryIndexes.length + result.localSecondaryIndexes.length;
    $.export("$summary", `Described table ${result.name} (${count} secondary index${count === 1
      ? ""
      : "es"})`);
    return result;
  },
};
