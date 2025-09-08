import plentyone from "../../plentyone.app.mjs";

export default {
  key: "plentyone-add-order-note",
  name: "Add Order Note",
  description: "Adds a note to an order in PlentyONE. [See the documentation](https://developers.plentymarkets.com/en-gb/plentymarkets-rest-api/index.html#/Comment/post_rest_comments)",
  version: "0.0.1",
  type: "action",
  props: {
    plentyone,
    orderId: {
      propDefinition: [
        plentyone,
        "orderId",
      ],
    },
    text: {
      type: "string",
      label: "Note Text",
      description: "The text of the note to add.",
    },
    isVisibleForContact: {
      type: "boolean",
      label: "Is Visible for Contact",
      description: "Whether the note is visible to the contact.",
    },
  },
  async run({ $ }) {
    const response = await this.plentyone.addOrderNote({
      $,
      data: {
        referenceType: "order",
        referenceValue: this.orderId,
        text: this.text,
        isVisibleForContact: this.isVisibleForContact,
      },
    });

    $.export("$summary", `Successfully added note to order: ${this.orderId}`);
    return response;
  },
};
