import common from "../../common/common-dynamodb.mjs";
import {
  collectPages, listResult, listSummary,
} from "../../common/list-paging.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-dynamodb-list-tables",
  name: "DynamoDB - List Tables",
  description: toSingleLineString(`
    Lists the names of the DynamoDB tables in a region. Use it to find the \`tableName\` for **DynamoDB - Scan**, **DynamoDB - Query**,
    **DynamoDB - Get Item**, **DynamoDB - Put Item**, **DynamoDB - Update Item** and **DynamoDB - Update Table**.
    Check \`truncated\` first: when it is \`true\`, call again with \`nextToken\` set to the returned \`nextToken\`.
    Example result: \`{ "truncated": false, "nextToken": null, "count": 2, "tables": ["Orders", "Customers"] }\`.
    [See the documentation](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_ListTables.html)
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
    maxItems: {
      propDefinition: [
        common.props.aws,
        "maxItems",
      ],
    },
    nextToken: {
      propDefinition: [
        common.props.aws,
        "nextToken",
      ],
    },
  },
  async run({ $ }) {
    const result = await collectPages(async (token) => {
      const {
        TableNames, LastEvaluatedTableName,
      } = await this.listTables({
        ExclusiveStartTableName: token,
        Limit: 100,
      });
      return {
        items: TableNames ?? [],
        nextToken: LastEvaluatedTableName,
      };
    }, this.maxItems, this.nextToken);
    $.export("$summary", listSummary("table", result));
    return listResult("tables", result);
  },
};
