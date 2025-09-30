import retently from "../../retently.app.mjs";

export default {
  key: "retently-create-customer",
  name: "Create Customer",
  description: "Creates a new customer. [See the documentation](https://www.retently.com/api/#api-create-or-update-customers-post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    retently,
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the new customer",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the new customer",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the new customer",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "Company of the new customer",
      optional: true,
    },
    tags: {
      propDefinition: [
        retently,
        "tags",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const { data } = await this.retently.createCustomer({
      data: {
        subscribers: [
          {
            email: this.email,
            first_name: this.firstName,
            last_name: this.lastName,
            company: this.company,
            tags: this.tags,
          },
        ],
      },
      $,
    });

    if (data[this.email].status === "failed" && data[this.email].reason === "exists") {
      throw new Error("Email address already exists.");
    }

    if (data[this.email].id) {
      $.export("$summary", `Successfully created customer with ID ${data[this.email].id}.`);
    }

    return data;
  },
};
