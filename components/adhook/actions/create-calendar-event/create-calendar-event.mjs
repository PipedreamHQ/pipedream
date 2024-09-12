import adhook from "../../adhook.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "adhook-create-calendar-event",
  name: "Create Calendar Event",
  description: "Generates a personalized calendar event in AdHook. [See the documentation](https://app.adhook.io/api-doc/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    adhook,
    eventName: {
      propDefinition: [
        adhook,
        "eventName",
      ],
    },
    startDate: {
      propDefinition: [
        adhook,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        adhook,
        "endDate",
      ],
    },
    eventDescription: {
      propDefinition: [
        adhook,
        "eventDescription",
      ],
      optional: true,
    },
    attendees: {
      propDefinition: [
        adhook,
        "attendees",
      ],
      optional: true,
    },
    attachments: {
      propDefinition: [
        adhook,
        "attachments",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.adhook.createCalendarEvent({
      data: {
        eventName: this.eventName,
        startDate: this.startDate,
        endDate: this.endDate,
        eventDescription: this.eventDescription,
        attendees: this.attendees,
        attachments: this.attachments,
      },
    });

    $.export("$summary", `Successfully created calendar event: ${this.eventName}`);
    return response;
  },
};
