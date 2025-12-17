import app from "../../printavo.app.mjs";

export default {
  name: "Delete Customer",
  description: "Delete a customer. [See the docs here](https://printavo.docs.apiary.io/#reference/customers/customer/customer-delete)",
  key: "printavo-delete-customer",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
    },
  },
  async run({ $ }) {
    await this.app.deleteCustomer(this.customerId, $);
    $.export("$summary", `Customer successfully deleted with id ${this.customerId}`);
  },
};
