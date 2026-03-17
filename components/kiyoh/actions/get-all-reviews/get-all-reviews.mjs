import app from "../../kiyoh.app.mjs";

export default {
  key: "kiyoh-get-all-reviews",
  name: "Get All Reviews",
  description: "Retrieves all shop reviews for a given location",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
    idempotentHint: true,
  },
  props: {
    app,
    locationId: {
      propDefinition: [
        app,
        "locationId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      locationId,
    } = this;
    const response = await app.getAllReviews({
      $,
      params: {
        locationId,
      },
    });
    $.export("$summary", `Successfully retrieved reviews for location ID \`${response?.locationId}\``);
    return response;
  },
};
