import app from "../../booqable.app.mjs";

export default {
  key: "booqable-create-customer",
  name: "Create Customer",
  description: "Create a new customer in Booqable. [See the documentation](https://developers.booqable.com/#create-a-new-customer)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
  },
  methods: {
    createCustomer(args = {}) {
      return this.app.post({
        path: "/customers",
        ...args,
      });
    },
  },
  run({ $: step }) {
    const {
      createCustomer,
      name,
      email,
    } = this;

    return createCustomer({
      step,
      data: {
        customer: {
          name,
          email,
        },
      },
      summary: (response) => `Successfully created customer with ID: \`${response.customer.id}\``,
    });
  },
};
