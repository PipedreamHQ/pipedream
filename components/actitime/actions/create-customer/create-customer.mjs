import app from "../../actitime.app.mjs";

export default {
  key: "actitime-create-customer",
  name: "Create Customer",
  description: "Creates a new customer. [See the documentation](https://online.actitime.com/pipedream/api/v1/swagger).",
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
      type: "string",
      label: "Name",
      description: "The name of the customer.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Details about the customer.",
      optional: true,
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
  async run({ $ }) {
    const {
      createCustomer,
      name,
      description,
    } = this;

    const response = await createCustomer({
      $,
      data: {
        name,
        description,
      },
    });

    $.export("$summary", `Successfully created customer with ID \`${response.id}\`.`);
    return response;
  },
};
