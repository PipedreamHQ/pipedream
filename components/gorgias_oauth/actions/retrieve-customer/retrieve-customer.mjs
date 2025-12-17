import gorgias_oauth from "../../gorgias_oauth.app.mjs";

export default {
  key: "gorgias_oauth-retrieve-customer",
  name: "Retrieve a Customer",
  description: "Retrieve a customer. [See the docs](https://developers.gorgias.com/reference/get_api-customers-id-)",
  version: "0.0.10",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    gorgias_oauth,
    customerId: {
      propDefinition: [
        gorgias_oauth,
        "customerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gorgias_oauth.retrieveCustomer({
      $,
      id: this.customerId,
    });
    $.export("$summary", `Succesfully retrieved customer ${this.customerId}`);
    return response;
  },
};
