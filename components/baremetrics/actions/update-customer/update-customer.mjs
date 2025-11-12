import app from "../../baremetrics.app.mjs";

export default {
  key: "baremetrics-update-customer",
  name: "Update Customer",
  description: "Update a customer. [See the documentation](https://developers.baremetrics.com/reference/update-customer)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
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
    customerOid: {
      propDefinition: [
        app,
        "customerOid",
        (c) => ({
          sourceId: c.sourceId,
        }),
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
    const response = await this.app.updateCustomer({
      $,
      source_id: this.sourceId,
      customer_oid: this.customerOid,
      data: {
        name: this.name,
        notes: this.notes,
        email: this.email,
      },
    });

    $.export("$summary", `Successfully updated the customer record with the ID '${this.customerOid}'`);

    return response;
  },
};
