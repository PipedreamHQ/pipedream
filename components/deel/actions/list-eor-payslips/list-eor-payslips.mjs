import app from "../../deel.app.mjs";

export default {
  key: "deel-list-eor-payslips",
  name: "List EOR Payslips",
  description:
    "List payslips for a specific EOR (employer of record) employee in Deel."
    + " Returns payslip IDs, pay periods, gross/net amounts, and download links."
    + " Use **Get Contract** to find the worker ID from a contract's worker details."
    + " [See the documentation](https://developer.deel.com/docs/list-eor-payslips)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    workerId: {
      propDefinition: [
        app,
        "workerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listEorPayslips($, this.workerId);

    const payslips = response?.data ?? response ?? [];
    $.export("$summary", `Retrieved ${Array.isArray(payslips)
      ? payslips.length
      : 0} payslips for EOR worker ${this.workerId}`);
    return response;
  },
};
