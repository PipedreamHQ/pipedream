import app from "../../sell_to_state.app.mjs";

export default {
  key: "sell_to_state-get-buyer-profile",
  name: "Get Buyer Profile",
  description: "Get the public-procurement profile of one buyer: summary, trend by year, sectors and top partners. [See the docs](https://docs.selltostate.com/)",
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
    const response = await this.app.getBuyer({
      $,
      slug: this.slug,
      country: this.country,
    });
    $.export("$summary", `Retrieved buyer ${this.slug}`);
    return response;
  },
};
