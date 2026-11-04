import app from "../../sell_to_state.app.mjs";

export default {
  key: "sell_to_state-get-supplier-profile",
  name: "Get Supplier Profile",
  description: "Get the public-procurement profile of one supplier: summary, trend by year, sectors and top partners. [See the docs](https://docs.selltostate.com/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    slug: {
      propDefinition: [
        app,
        "slug",
      ],
    },
    country: {
      propDefinition: [
        app,
        "entityCountry",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getSupplier({
      $,
      slug: this.slug,
      country: this.country,
    });
    $.export("$summary", `Retrieved supplier ${this.slug}`);
    return response;
  },
};
