import common from "../../common/common-dynamodb.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

const isSelect = (statement) => /^\s*select\b/i.test(statement);

export default {
  ...common,
  key: "aws-dynamodb-execute-statement",
  name: "DynamoDB - Execute Statement",
  description: toSingleLineString(`
    Runs a PartiQL statement (SELECT, INSERT, UPDATE or DELETE) against DynamoDB.
    A \`SELECT\` returns every matching item unless you set \`maxItems\`; set it (e.g. 100) when you only need a sample or the table may be large, so the result stays small.
    Check \`truncated\` first: when it is \`true\`, more items exist (the \`maxItems\` cap was reached, or the call hit its request limit), so call
    this action again with the same statement and \`nextToken\` set to the returned \`nextToken\` to read the next page,
    and repeat until \`truncated\` is \`false\`. Write statements run once and return no items.
    To read one table, prefer **DynamoDB - Query** or **DynamoDB - Scan**.
    Example: \`statement\` \`SELECT * FROM "Orders" WHERE customerId = ?\`, \`parameters\` \`[{"S": "c-1"}]\` returns
    \`{ "truncated": false, "nextToken": null, "Count": 1, "Items": [{ "customerId": { "S": "c-1" } }] }\`.
    [See the documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/executestatementcommand.html)
  `),
  version: "0.3.0",
  annotations: {
    // a PartiQL statement can be a DELETE or UPDATE
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    aws: common.props.aws,
    region: common.props.region,
    statement: common.props.statement,
    parameters: common.props.parameters,
    maxItems: common.props.maxItems,
    nextToken: common.props.nextToken,
  },
  async run({ $ }) {
    const params = {
      Statement: this.statement,
    };

    if (this.parameters?.length > 0) {
      const p = this.parameters.filter((param) => param);
      if (p.length > 0) params.Parameters = p;
    }

    // Write statements don't page and don't accept a Limit
    if (!isSelect(this.statement)) {
      const response = await this.executeTransaction(params);
      const items = response.Items ?? [];
      $.export("$summary", "Statement executed");
      return {
        truncated: false,
        nextToken: null,
        Count: items.length,
        Items: items,
        $metadata: response.$metadata,
      };
    }

    const pages = await this.readPages({
      fn: this.executeTransaction,
      params,
      maxItems: this.maxItems,
      filtered: /\bwhere\b/i.test(this.statement),
      startKey: this.nextToken || undefined,
      startKeyAttr: "NextToken",
      nextKeyAttr: "NextToken",
    });

    const s = pages.items.length === 1
      ? ""
      : "s";
    $.export("$summary", `Statement returned ${pages.items.length} item${s}${pages.nextKey
      ? " (more available: pass nextToken to read the next page)"
      : ""}`);
    return {
      truncated: Boolean(pages.nextKey),
      nextToken: pages.nextKey ?? null,
      Count: pages.items.length,
      Items: pages.items,
      $metadata: pages.metadata,
    };
  },
};
