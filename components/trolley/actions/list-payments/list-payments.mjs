import trolley from "../../trolley.app.mjs";

export default {
  key: "trolley-list-payments",
  name: "List Payments",
  description: "List all payments within a batch. [See the documentation](https://developers.trolley.com/api/#list-all-payments-in-batch)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    trolley,
    batchId: {
      propDefinition: [
        trolley,
        "batchId",
      ],
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number to retrieve (1-indexed).",
      optional: true,
      default: 1,
      min: 1,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Number of results per page (max `1000`).",
      optional: true,
      default: 10,
      min: 1,
      max: 1000,
    },
  },
  async run({ $ }) {
    const response = await this.trolley.listPayments({
      $,
      batchId: this.batchId,
      params: {
        page: this.page,
        pageSize: this.pageSize,
      },
    });
    const count = response.payments?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} payment(s) for batch ${this.batchId}`);
    return response;
  },
};
