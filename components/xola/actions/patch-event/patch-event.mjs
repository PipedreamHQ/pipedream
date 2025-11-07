import app from "../../xola.app.mjs";

export default {
  key: "xola-patch-event",
  name: "Patch Event",
  description: "Partially update an event's properties. [See the documentation](https://xola.github.io/xola-docs/#tag/events/operation/patchEvent)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    sellerId: {
      label: "Seller ID",
      description: "The unique identifier of the seller",
      propDefinition: [
        app,
        "userId",
      ],
    },
    eventId: {
      propDefinition: [
        app,
        "eventId",
        ({ sellerId }) => ({
          sellerId,
        }),
      ],
    },
    max: {
      type: "integer",
      label: "Max",
      description: "Maximum capacity override",
      min: 0,
    },
    manual: {
      type: "boolean",
      label: "Manual",
      description: "Flag to reopen a closed event as manual",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      eventId,
      max,
      manual,
    } = this;

    const response = await app.patchEvent({
      $,
      eventId,
      data: {
        max,
        manual,
      },
    });

    $.export("$summary", "Successfully patched event");
    return response;
  },
};
