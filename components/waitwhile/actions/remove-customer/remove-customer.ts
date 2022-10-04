import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Remove Customer",
  version: "0.0.1",
  key: "waitwhile-remove-customer",
  description: "Remove a customer",
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
    const data = await this.waitwhile.removeCustomer(this.customerId);
    $.export("summary", "Successfully removed a customer");
    return data;
  },
});
