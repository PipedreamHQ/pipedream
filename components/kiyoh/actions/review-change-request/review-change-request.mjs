import app from "../../kiyoh.app.mjs";

export default {
  key: "kiyoh-review-change-request",
  name: "Review Change Request",
  description: "Sends a request to the reviewer to update their shop review",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    locationId: {
      propDefinition: [
        app,
        "locationId",
      ],
    },
    tenantId: {
      propDefinition: [
        app,
        "tenantId",
      ],
    },
    reviewId: {
      propDefinition: [
        app,
        "reviewId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      locationId,
      tenantId,
      reviewId,
    } = this;

    const response = await app.reviewChangeRequest({
      $,
      data: {
        locationId,
        tenantId,
        reviewId,
      },
    });
    $.export("$summary", "Successfully sent change request for review.");
    return response;
  },
};
