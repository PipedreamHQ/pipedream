import app from "../../xola.app.mjs";

export default {
  key: "xola-remove-event-guide",
  name: "Remove Event Guide",
  description: "Removes a guide from an event. [See the documentation](https://xola.github.io/xola-docs/#tag/events/operation/removeEventGuide)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    eventId: {
      propDefinition: [
        app,
        "eventId",
      ],
    },
    guideId: {
      propDefinition: [
        app,
        "guideId",
      ],
    },
  },
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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

    $.export("$summary", `Successfully removed guide ${guideId} from event ${eventId}`);
    return response;
  },
};
