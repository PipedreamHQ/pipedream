import aws from "../../aws.app.mjs";
import { toSingleLineString } from "../../common/utils.mjs";

export default {
  key: "aws-dynamodb-execute-statement",
  name: "DynamoDB - Execute Statement",
  description: toSingleLineString(`
    This operation allows you to perform transactional reads or writes on data stored in DynamoDB, using PartiQL.
    [See docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/classes/executestatementcommand.html)
  `),
  version: "0.2.0",
  type: "action",
  props: {
    aws,
    region: {
      propDefinition: [
        aws,
        "region",
      ],
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
      this.aws.dynamodbExecuteTransaction,
      this.region,
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
