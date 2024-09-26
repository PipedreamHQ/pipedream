import app from "../../php_point_of_sale.app.mjs";

export default {
  key: "php_point_of_sale-get-registers",
  name: "Get Registers",
  description: "Search for registers in PHP Point Of Sale. [See the documentation](https://phppointofsale.com/api.php#/registers/searchregisters)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    search: {
      propDefinition: [
        app,
        "search",
      ],
    },
  },
  async run({ $ }) {
    const results = await this.app.searchRegisters({
      $,
      params: {
        search: this.search,
      },
    });

    $.export("$summary", "Successfully retrieved registers");

    return results;
  },
};
