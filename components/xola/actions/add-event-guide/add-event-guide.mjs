import app from "../../xola.app.mjs";

export default {
  key: "xola-add-event-guide",
  name: "Add Event Guide",
  description: "Adds a guide to an event. [See the documentation](https://xola.github.io/xola-docs/#tag/events/operation/addEventGuide)",
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

    $.export("$summary", "Successfully added guide to event");
    return response;
  },
};
