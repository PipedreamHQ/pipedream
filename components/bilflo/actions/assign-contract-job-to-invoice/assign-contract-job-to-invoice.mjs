import bilflo from "../../bilflo.app.mjs";

export default {
  key: "bilflo-assign-contract-job-to-invoice",
  name: "Assign Contract Job to Invoice Group",
  description: "Assigns a contract job to a specified invoice group for a client. [See the documentation](https://developer.bilflo.com/documentation#operations-tag-Clients)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bilflo,
    jobId: {
      type: "integer",
      label: "Contract Job Identifier",
      description: "The unique identifier for the contract job.",
    },
    invoiceGroupId: {
      type: "integer",
      label: "Invoice Group Identifier",
      description: "The unique identifier for the invoice group.",
    },
  },
  async run({ $ }) {
    const response = await this.bilflo.assignContractJobToInvoiceGroup({
      $,
      data: {
        jobId: this.jobId,
        invoiceGroupId: this.invoiceGroupId,
      },
    });
    $.export("$summary", `Successfully assigned contract job ${this.jobId} to invoice group ${this.invoiceGroupId}`);
    return response;
  },
};
