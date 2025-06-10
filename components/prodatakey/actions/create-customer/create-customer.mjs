import prodatakey from "../../prodatakey.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "prodatakey-create-customer",
  name: "Create Customer",
  description: "Creates a new customer in the ProdataKey system. [See the documentation](https://developer.pdk.io/web/2.0/rest/organizations)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    prodatakey,
    dealerId: {
      propDefinition: [
        prodatakey,
        "dealerId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the customer to be created",
    },
    useBluetoothCredentials: {
      propDefinition: [
        prodatakey,
        "useBluetoothCredentials",
      ],
      optional: true,
    },
    useTouchMobileApp: {
      propDefinition: [
        prodatakey,
        "useTouchMobileApp",
      ],
      optional: true,
    },
    allowCredentialResets: {
      propDefinition: [
        prodatakey,
        "allowCredentialResets",
      ],
      optional: true,
    },
    type: {
      propDefinition: [
        prodatakey,
        "type",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.prodatakey.createCustomer({
      dealerId: this.dealerId,
      name: this.name,
      useBluetoothCredentials: this.useBluetoothCredentials,
      useTouchMobileApp: this.useTouchMobileApp,
      allowCredentialResets: this.allowCredentialResets,
      type: this.type,
    });

    $.export("$summary", `Successfully created customer with ID: ${response.id}`);
    return response;
  },
};
