import ascora from "../../ascora.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ascora-search-customers",
  name: "Search Customers",
  description: "Search for a specific customer in Ascora. [See the documentation](https://support.ascora.com.au/display/AS/API+Endpoints)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    ascora,
    customerIdentifier: {
      propDefinition: [
        ascora,
        "customerIdentifier",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.ascora.searchCustomer({
      customerIdentifier: this.customerIdentifier,
    });

    $.export("$summary", `Searched for customer with identifier: ${this.customerIdentifier}`);
    return response;
  },
};
