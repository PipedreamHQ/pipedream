import mailcheck from "../../mailcheck.app.mjs";

export default {
  key: "mailcheck-get-batch-operation-status",
  name: "Get Batch Operation Status",
  description: "Get batch check operation status. [See the documentation](https://app.mailcheck.co/docs?from=docs#get-/v1/emails/-operation_name-)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    mailcheck,
    operationName: {
      propDefinition: [
        mailcheck,
        "operationName",
      ],
    },
  },
  async run({ $ }) {

    const response = await this.mailcheck.getBatchOperationStatus({
      $,
      operationName: this.operationName,
    });

    $.export("$summary", `Successfully fetched data for operation with name: ${this.operationName}`);
    return response;
  },
};
