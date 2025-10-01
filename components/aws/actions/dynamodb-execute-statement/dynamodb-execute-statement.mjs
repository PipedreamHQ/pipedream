import common from "../../common/common-dynamodb.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  ...common,
  key: "aws-dynamodb-execute-statement",
  name: "DynamoDB - Execute Statement",
  description: toSingleLineString(`
    This operation allows you to perform transactional reads or writes on data stored in DynamoDB, using PartiQL.
    [See docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/executestatementcommand.html)
  `),
  version: "0.2.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    aws: common.props.aws,
    region: common.props.region,
    statement: common.props.statement,
    parameters: common.props.parameters,
  },
  async run({ $ }) {
    const params = {
      Statement: this.statement,
    };

    if (this.parameters?.length > 0) {
      const p = this.parameters.filter((param) => param);
      if (p.length > 0) params.Parameters = p;
    }

    const response = await this.aws.pagination(
      this.executeTransaction,
      params,
      "NextToken",
    );

    const s = response.Items.length === 1
      ? ""
      : "s";
    $.export("$summary", `Statement returned ${response.Items.length} item${s}`);
    return response;
  },
};
