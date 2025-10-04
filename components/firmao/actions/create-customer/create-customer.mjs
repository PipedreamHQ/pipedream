import app from "../../firmao.app.mjs";

export default {
  key: "firmao-create-customer",
  name: "Create Customer",
  description: "Create a new company customer. [See the documentation](https://firmao.net/API-Documentation_EN.pdf)",
  version: "0.0.2",
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
      description: "The name of the customer",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the customer",
      optional: true,
    },
    emails: {
      type: "string[]",
      label: "Email",
      description: "The list of emails of the customer",
      optional: true,
    },
    phones: {
      type: "string[]",
      label: "Phone",
      description: "The list of phone numbers of the customer",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      name: this.name,
      emails: this.emails,
      phones: this.phones,
      description: this.description,
    };

    const customer = await this.app.createCustomer({
      $,
      data,
    });
    $.export("$summary", `Successfully created customer "${this.name}"`);

    return customer;
  },
};
