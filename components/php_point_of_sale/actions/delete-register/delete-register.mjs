import phpPointOfSale from "../../php_point_of_sale.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "php_point_of_sale-delete-register",
  name: "Delete a Register",
  description: "Deletes a register from PHP Point of Sale. [See the documentation](https://phppointofsale.com/api.php#/registers/deleteregister)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    phpPointOfSale,
    registerId: {
      propDefinition: [
        phpPointOfSale,
        "registerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.phpPointOfSale.deleteRegister({
      registerId: this.registerId,
    });

    $.export("$summary", `Successfully deleted register with ID: ${this.registerId}`);
    return response;
  },
};
