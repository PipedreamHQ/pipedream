import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Remove Customer",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "waitwhile-remove-customer",
  description: "Remove a customer. [See the doc here](https://developers.waitwhile.com/reference/deletecustomerscustomerid)",
  props: {
    waitwhile,
    customerId: {
      propDefinition: [
        waitwhile,
        "customerId",
      ],
    },
  },
  type: "action",
  methods: {},
  async run({ $ }) {
    try {
      const data = await this.waitwhile.removeCustomer(this.customerId);
      $.export("summary", "Successfully removed a customer");
      return data;
    } catch (error) {
      const statusCode = error[Object.getOwnPropertySymbols(error)[1]].status;
      const statusText = error[Object.getOwnPropertySymbols(error)[1]].statusText;
      throw new Error(`Error status code: ${statusCode}. Error status response: ${statusText}. You might need a Waitwhile Paid Plan to use this action`);
    }
  },
});
