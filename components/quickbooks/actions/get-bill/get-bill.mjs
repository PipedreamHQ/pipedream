import { ConfigurationError } from "@pipedream/platform";
import quickbooks from "../../quickbooks.app.mjs";

export default {
  key: "quickbooks-get-bill",
  name: "Get Bill",
  description: "Returns info about a bill. [See docs here](https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/bill#read-a-bill)",
  version: "0.1.4",
  type: "action",
  props: {
    quickbooks,
    billId: {
      label: "Bill ID",
      type: "string",
      description: "Id of the bill to get details of.",
    },
    minorVersion: {
      propDefinition: [
        quickbooks,
        "minorVersion",
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
      params: {
        minorversion: this.minorVersion,
      },
    });

    if (response) {
      $.export("summary", `Successfully retrieved bill with id ${response.Bill.Id}`);
    }

    return response;
  },
};
