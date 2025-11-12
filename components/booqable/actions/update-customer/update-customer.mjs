import app from "../../booqable.app.mjs";

export default {
  key: "booqable-update-customer",
  name: "Update Customer",
  description: "Updates the details of an existing customer in Booqable. [See the documentation](https://developers.booqable.com/#update-customer)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
    },
    name: {
      optional: true,
      propDefinition: [
        app,
        "name",
      ],
    },
    email: {
      optional: true,
      propDefinition: [
        app,
        "email",
      ],
    },
  },
  methods: {
    updateCustomer({
      customerId, ...args
    } = {}) {
      return this.app.put({
        path: `/customers/${customerId}`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      updateCustomer,
      customerId,
      name,
      email,
    } = this;

    return updateCustomer({
      step,
      customerId,
      data: {
        customer: {
          name,
          email,
        },
      },
      summary: (response) => `Successfully updated customer with ID: \`${response.customer.id}\``,
    });
  },
};
