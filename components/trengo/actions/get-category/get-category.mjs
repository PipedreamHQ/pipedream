import app from "../../trengo.app.mjs";

export default {
  key: "trengo-get-category",
  name: "Get Category",
  description: "Get a specific category. [See the documentation](https://developers.trengo.com/reference/get-a-category)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    helpCenterId: {
      propDefinition: [
        app,
        "helpCenterId",
      ],
    },
    categoryId: {
      propDefinition: [
        app,
        "categoryId",
        ({ helpCenterId }) => ({
          helpCenterId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getCategory({
      $,
      helpCenterId: this.helpCenterId,
      categoryId: this.categoryId,
    });
    $.export("$summary", "Successfully retrieved category");
    return response;
  },
};
