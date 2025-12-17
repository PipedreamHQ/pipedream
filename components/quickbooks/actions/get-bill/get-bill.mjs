import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-get-bill",
  name: "Get Bill",
  description: "Returns info about a bill. [See the documentation](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/bill#read-a-bill)",
  version: "0.1.13",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    quickbooks,
    billId: {
      propDefinition: [
        quickbooks,
        "billId",
      ],
    },
  },
  async run({ $ }) {
    if (!this.billId) {
      throw new ConfigurationError("Must provide billId parameter.");
    }

    const response = await this.quickbooks.getBill({
      $,
      billId: this.billId,
    });

    if (response) {
      $.export("summary", `Successfully retrieved bill with ID ${response.Bill.Id}`);
    }

    return response;
  },
};
