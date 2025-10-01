import app from "../../engage.app.mjs";

export default {
  key: "engage-add-customer",
  name: "Add Customer",
  description: "Adds Customer to Accounts. [See the documentation](https://docs.engage.so/en-us/a/62bbdd015bfea4dca4834042-users#add-customer-to-accounts)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    uid: {
      propDefinition: [
        app,
        "uid",
      ],
    },
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.addCustomer({
      $,
      uid: this.uid,
      data: {
        accounts: [
          {
            id: this.customerId,
          },
        ],
      },
    });
    $.export("$summary", "add-customer executed successfully");
    return response;
  },
};
