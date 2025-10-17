import app from "../../xola.app.mjs";

export default {
  key: "xola-patch-event",
  name: "Patch Event",
  description: "Updates specific fields of an event. [See the documentation](https://xola.github.io/xola-docs/#tag/events/operation/patchEvent)",
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
    name: {
      type: "string",
      label: "Name",
      description: "The name of the event",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the event",
      optional: true,
    },
    start: {
      type: "string",
      label: "Start Date/Time",
      description: "Start date and time in ISO 8601 format. Example: `2024-01-01T09:00:00Z`",
      optional: true,
    },
    end: {
      type: "string",
      label: "End Date/Time",
      description: "End date and time in ISO 8601 format. Example: `2024-01-01T17:00:00Z`",
      optional: true,
    },
    capacity: {
      type: "integer",
      label: "Capacity",
      description: "The maximum number of participants for the event",
      optional: true,
    },
  },
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  async run({ $ }) {
    const {
      app,
      eventId,
      name,
      description,
      start,
      end,
      capacity,
    } = this;

    const response = await app.patchEvent({
      $,
      eventId,
      data: {
        ...name && {
          name,
        },
        ...description && {
          description,
        },
        ...start && {
          start,
        },
        ...end && {
          end,
        },
        ...capacity && {
          capacity,
        },
      },
    });

    $.export("$summary", `Successfully patched event ${eventId}`);
    return response;
  },
};
