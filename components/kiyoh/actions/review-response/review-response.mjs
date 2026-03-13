import app from "../../kiyoh.app.mjs";

export default {
  key: "kiyoh-review-response",
  name: "Review Response",
  description: "Submits a response to a shop review",
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
    response: {
      type: "string",
      label: "Response",
      description: "The response text to send to the reviewer.",
    },
    reviewResponseType: {
      type: "string",
      label: "Response Type",
      description: "Whether the response should be public or private.",
      options: [
        {
          label: "Public",
          value: "PUBLIC",
        },
        {
          label: "Private",
          value: "PRIVATE",
        },
      ],
    },
    responseEmail: {
      type: "boolean",
      label: "Send Email Notification",
      description: "Whether to send the reviewer an email notification with the response.",
    },
  },
  async run({ $ }) {
    const {
      app,
      locationId,
      tenantId,
      reviewId,
      response,
      reviewResponseType,
      responseEmail,
    } = this;

    const result = await app.reviewResponse({
      $,
      data: {
        locationId,
        tenantId,
        reviewId,
        response,
        reviewResponseType,
        responseEmail,
      },
    });
    $.export("$summary", "Successfully submitted response for review.");
    return result;
  },
};
