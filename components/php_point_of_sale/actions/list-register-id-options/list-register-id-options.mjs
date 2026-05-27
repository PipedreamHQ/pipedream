import php_point_of_sale from "../../php_point_of_sale.app.mjs";

export default {
  key: "php_point_of_sale-list-register-id-options",
  name: "List Register ID Options",
  description: "Retrieves available options for the Register ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    php_point_of_sale,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await php_point_of_sale.propDefinitions.registerId.options
      .call(this.php_point_of_sale, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
