import app from "../../usersketch.app.mjs";

export default {
  name: "Create User",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "usersketch-create-user",
  description: "Create an user. [See the documentation](https://usersketch.readme.io/reference/post_api-customer-create)",
  type: "action",
  props: {
    app,
    email: {
      type: "string",
      label: "Email",
      description: "Email of the customer",
    },
    firstName: {
      type: "string",
      label: "First name",
      description: "First name of the customer",
    },
    lastName: {
      type: "string",
      label: "Last name",
      description: "Last name of the customer",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Additional notes about the customer",
    },
  },
  async run({ $ }) {
    const response = await this.app.createUser({
      $,
      data: {
        customerData: {
          email: this.email,
          firstName: this.firstName,
          lastName: this.lastName,
          notes: this.notes,
        },
      },
    });

    if (response.success) {
      $.export("$summary", "Successfully created user");
    }

    return response;
  },
};
