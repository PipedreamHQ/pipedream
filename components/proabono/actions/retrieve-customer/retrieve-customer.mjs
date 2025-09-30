import proabono from "../../proabono.app.mjs";

export default {
  key: "proabono-retrieve-customer",
  name: "Retrieve Customer",
  description: "Fetches an existing customer from the proabono system. [See the documentation](https://docs.proabono.com/api/#retrieve-a-customer)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    proabono,
    customerId: {
      propDefinition: [
        proabono,
        "customerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.proabono.getCustomer({
      params: {
        ReferenceCustomer: this.customerId,
      },
    });
    $.export("$summary", `Successfully fetched customer with ID: ${this.customerId}`);
    return response;
  },
};
