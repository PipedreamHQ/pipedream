import app from "../../baremetrics.app.mjs";

export default {
  key: "baremetrics-create-customer",
  name: "Create Customer",
  description: "Create a customer. [See the documentation](https://developers.baremetrics.com/reference/create-customer)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    sourceId: {
      propDefinition: [
        app,
        "sourceId",
      ],
    },
    oid: {
      propDefinition: [
        app,
        "oid",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    notes: {
      propDefinition: [
        app,
        "notes",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createCustomer({
      $,
      source_id: this.sourceId,
      data: {
        name: this.name,
        notes: this.notes,
        email: this.email,
        oid: this.oid,
      },
    });

    $.export("$summary", `Successfully created the customer record with the ID '${this.oid}'`);

    return response;
  },
};
