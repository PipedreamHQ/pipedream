import app from "../../xola.app.mjs";

export default {
  key: "xola-remove-event-guide",
  name: "Remove Event Guide",
  description: "Removes a guide from an event. [See the documentation](https://xola.github.io/xola-docs/#tag/events/operation/removeEventGuide)",
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
      propDefinition: [
        app,
        "sellerId",
      ],
      async options() {
        const {
          id: value,
          name: label,
        } = await this.getUser();
        return [
          {
            label,
            value,
          },
        ];
      },
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
    guideId: {
      propDefinition: [
        app,
        "guideId",
        ({ sellerId }) => ({
          sellerId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      eventId,
      guideId,
    } = this;

    const response = await app.removeEventGuide({
      $,
      eventId,
      guideId,
    });

    $.export("$summary", "Successfully removed guide from event");
    return response;
  },
};
