import gorgias from "../../gorgias.app.mjs";

export default {
  key: "gorgias-retrieve-customer",
  name: "Retrieve a Customer",
  description: "Retrieve a customer. [See the docs](https://developers.gorgias.com/reference/get_api-customers-id-)",
  version: "0.0.1",
  type: "action",
  props: {
    gorgias,
    customerId: {
      propDefinition: [
        gorgias,
        "customerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gorgias.retrieveCustomer({
      $,
      id: this.customerId,
    });
    $.export("$summary", `Succesfully retrieved customer ${this.customerId}`);
    return response;
  },
};
