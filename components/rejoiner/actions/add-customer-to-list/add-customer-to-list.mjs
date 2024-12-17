import rejoiner from "../../rejoiner.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "rejoiner-add-customer-to-list",
  name: "Add Customer to List",
  description: "Adds a customer to a specific list. [See the documentation](https://docs.rejoiner.com/docs/getting-started)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    rejoiner,
    customerId: {
      propDefinition: [
        rejoiner,
        "customerId",
      ],
    },
    listId: {
      propDefinition: [
        rejoiner,
        "listId",
      ],
    },
    listSource: {
      propDefinition: [
        rejoiner,
        "listSource",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.rejoiner.addCustomerToList();
    $.export("$summary", `Added customer ${this.customerId} to list ${this.listId}`);
    return response;
  },
};
