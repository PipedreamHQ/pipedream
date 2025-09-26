import app from "../../paazl.app.mjs";

export default {
  key: "paazl-delete-order",
  name: "Delete Order",
  description: "Deletes an order. [See the documentation](https://support.paazl.com/hc/en-us/articles/360008633973-REST-API-reference#/Order/saveOrderUsingPOST)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    reference: {
      propDefinition: [
        app,
        "reference",
      ],
      description: "Your reference for the order you want to delete",
    },
  },
  async run({ $ }) {
    const {
      app,
      reference,
    } = this;

    const response = await app.deleteOrder({
      $,
      reference,
    });

    $.export("$summary", `Successfully deleted order with reference: ${reference}`);
    return response;
  },
};
