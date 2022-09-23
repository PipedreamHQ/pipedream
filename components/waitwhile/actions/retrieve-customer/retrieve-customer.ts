import waitwhile from "../../app/waitwhile.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Retrieve Customer",
  version: "0.0.1",
  key: "waitwhile-retrieve-customer",
  description: "Retrieve a customer",
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
    const data = await this.waitwhile.retrieveCustomer(this.customerId);
    $.export("summary", "Successfully retrieved a customer");
    return data;
  },
});
