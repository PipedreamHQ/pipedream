import productboard from "../../productboard.app.mjs";

export default {
  key: "productboard-get-feature",
  name: "Get Feature",
  description: "Retrieve a feature by ID. [See the docs here](https://developer.productboard.com/#operation/getFeature)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    productboard,
    feature: {
      propDefinition: [
        productboard,
        "feature",
      ],
    },
  },
  async run({ $ }) {
    const { data } = await this.productboard.getFeature(this.feature, $);

    $.export("$summary", `Successfully retrieved feature with ID ${data.id}`);

    return data;
  },
};
