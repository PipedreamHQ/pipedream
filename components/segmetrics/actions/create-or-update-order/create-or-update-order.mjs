import app from "../../segmetrics.app.mjs";

export default {
  name: "Create Or Update Order",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "segmetrics-create-or-update-order",
  description: "Creates a client. [See documentation here](https://developers.segmetrics.io/#orders)",
  type: "action",
  props: {
    app,
    integrationId: {
      label: "Integration ID",
      type: "string",
      description: "The ID of the integration from your Account Settings Page",
    },
    invoiceId: {
      label: "Invoice ID",
      description: "Unique identifier for the invoice",
      type: "string",
    },
    email: {
      label: "Contact's Email",
      description: "Email address of the contact",
      type: "string",
    },
    amount: {
      label: "Invoice Total in Cents",
      description: "Total amount of the invoice in cents",
      type: "integer",
    },
    paid: {
      label: "Invoice Amount Paid in Cents",
      description: "Amount paid for the invoice in cents",
      type: "integer",
    },
    dateCreated: {
      label: "Invoice Date",
      description: "Date when the invoice was created. E.g `2018-10-03 11:14:32`",
      type: "string",
    },
    items: {
      label: "Array of Invoice Items",
      description: "An array containing details of individual items within the invoice. E.g. `[ { \"name\": \"Round Tuit\", \"product_id\": 1556402307145, \"amount\": 4000, \"total_paid\": 4000 } ]`",
      type: "string",
    },
  },
  async run({ $ }) {
    const items = typeof this.items === "string"
      ? JSON.parse(this.items)
      : this.items;

    const response = await this.app.createOrUpdateOrder({
      $,
      integrationId: this.integrationId,
      data: {
        id: this.invoiceId,
        email: this.email,
        amount: this.amount,
        paid: this.paid,
        date_created: this.dateCreated,
        items,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created or updated order with ID ${this.invoiceId}`);
    }

    return response;
  },
};
