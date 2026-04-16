import pubrio from "../../pubrio.app.mjs";

export default {
  key: "pubrio-query-batch-redeem",
  name: "Query Batch Redeem",
  description: "Query the status and results of a batch redeem request. [See the documentation](https://docs.pubrio.com/en/api-reference/endpoint/redeem/people/batch/query)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    pubrio,
    redeemQueryId: {
      type: "string",
      label: "Redeem Query ID",
      description: "The batch redeem query ID to check",
    },
  },
  async run({ $ }) {
    const response = await this.pubrio.queryBatchRedeem({
      $,
      data: {
        redeem_query_id: this.redeemQueryId,
      },
    });
    $.export("$summary", "Successfully queried batch redeem status");
    return response;
  },
};
