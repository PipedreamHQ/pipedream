import altoviz from "../../altoviz.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "altoviz-create-customer",
  name: "Create Customer",
  description: "Creates a new customer in Altoviz. [See the documentation](https://developer.altoviz.com/docs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    altoviz,
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the customer",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the customer",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "Address of the customer",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Phone number of the customer",
      optional: true,
    },
  },
  async run({ $ }) {
    const customer = {
      email: this.email,
      name: this.name,
      address: this.address,
      phone: this.phone,
    };
    const response = await this.altoviz.createCustomer(customer);
    $.export("$summary", `Successfully created customer with email: ${this.email}`);
    return response;
  },
};
