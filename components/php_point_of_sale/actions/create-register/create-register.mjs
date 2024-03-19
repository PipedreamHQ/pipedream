import phpPointOfSale from "../../php_point_of_sale.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "php_point_of_sale-create-register",
  name: "Create Register",
  description: "Creates a new register in the store. [See the documentation](https://phppointofsale.com/api.php#/registers/addregister)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    phpPointOfSale,
    registerData: {
      propDefinition: [
        phpPointOfSale,
        "registerData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.phpPointOfSale.addRegister({
      registerData: this.registerData,
    });
    $.export("$summary", "Successfully created a new register");
    return response;
  },
};
