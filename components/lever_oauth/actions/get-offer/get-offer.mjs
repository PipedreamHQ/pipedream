import app from "../../lever_oauth.app.mjs";

export default {
  key: "lever_oauth-get-offer",
  name: "Get Offer",
  description:
    "Returns the offer details for an opportunity."
    + " Use this when asked about compensation, offer status, or whether an offer has been extended to a candidate."
    + " Returns offer fields including status, created date, salary, and any custom offer form values."
    + " Use **Search Opportunities** to find the opportunity ID."
    + " [See the documentation](https://hire.lever.co/developer/documentation#list-all-offers)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    opportunityId: {
      propDefinition: [
        app,
        "opportunityId",
      ],
      description: "The ID of the opportunity whose offer to retrieve. Use **Search Opportunities** to find opportunity IDs.",
    },
  },
  async run({ $ }) {
    const response = await this.app.getOffer(this.opportunityId, {
      $,
    });
    const offers = response.data ?? response;
    $.export("$summary", `Retrieved ${offers.length ?? 1} offer record${(offers.length ?? 1) === 1
      ? ""
      : "s"} for opportunity ${this.opportunityId}`);
    return offers;
  },
};
