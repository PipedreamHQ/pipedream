import phpPointOfSale from "../../php_point_of_sale.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "php_point_of_sale-get-registers",
  name: "Get Registers",
  description: "Search/list registers in PHP Point Of Sale. [See the documentation](https://phppointofsale.com/api.php#/registers/searchregisters)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    phpPointOfSale,
    searchParams: {
      propDefinition: [
        phpPointOfSale,
        "searchParams",
      ],
    },
  },
  async run({ $ }) {
    const results = await this.phpPointOfSale.paginate(this.phpPointOfSale.searchRegisters, this.searchParams);
    $.export("$summary", "Successfully retrieved registers");
    return results;
  },
};
