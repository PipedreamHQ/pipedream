import app from "../../xola.app.mjs";

export default {
  key: "xola-add-event-guide",
  name: "Add Event Guide",
  description: "Adds a guide to an event. [See the documentation](https://developers.xola.com/reference/assign-a-guide-to-a-trip)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    forceConfirm: {
      type: "boolean",
      label: "Force Confirm",
      description: "Force assignment even if guide has conflicts",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      eventId,
      guideId,
      forceConfirm,
    } = this;

    const response = await app.addEventGuide({
      $,
      eventId,
      data: {
        guide: {
          id: guideId,
          forceConfirm,
        },
      },
    });

    $.export("$summary", `Successfully added guide to event with ID \`${response.id}\``);
    return response;
  },
};
