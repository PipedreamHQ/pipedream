import bilflo from "../../bilflo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "bilflo-assign-contract-job-to-invoice",
  name: "Assign Contract Job to Invoice Group",
  description: "Assigns a contract job to a specified invoice group for a client. [See the documentation](https://developer.bilflo.com/documentation)",
  version: "0.0.1",
  type: "action",
  props: {
    bilflo,
    contractJobIdentifier: {
      propDefinition: [
        bilflo,
        "contractJobIdentifier",
      ],
    },
    invoiceGroupIdentifier: {
      propDefinition: [
        bilflo,
        "invoiceGroupIdentifier",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.bilflo.assignContractJobToInvoiceGroup({
      contractJobIdentifier: this.contractJobIdentifier,
      invoiceGroupIdentifier: this.invoiceGroupIdentifier,
    });
    $.export("$summary", `Successfully assigned contract job ${this.contractJobIdentifier} to invoice group ${this.invoiceGroupIdentifier}`);
    return response;
  },
};
