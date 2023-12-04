import { axios } from "@pipedream/platform";
import exhibitday from "../../exhibitday.app.mjs";

export default {
  key: "exhibitday-create-event",
  name: "Create Event",
  description: "Creates a new event in ExhibitDay. [See the documentation](https://api.exhibitday.com/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    exhibitday,
    eventName: {
      type: "string",
      label: "Event Name",
      description: "The name of the event",
    },
    eventDate: {
      type: "string",
      label: "Event Date",
      description: "The date of the event",
    },
    eventLocation: {
      type: "string",
      label: "Event Location",
      description: "The location of the event",
    },
    eventDescription: {
      type: "string",
      label: "Event Description",
      description: "The description of the event",
      optional: true,
    },
    attendees: {
      type: "string[]",
      label: "Attendees",
      description: "The attendees of the event",
      optional: true,
    },
    cost: {
      type: "integer",
      label: "Cost",
      description: "The cost of the event",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await axios($, {
      method: "POST",
      url: "https://api.exhibitday.com/create-event",
      headers: {
        Authorization: `Bearer ${this.exhibitday.$auth.api_key}`,
      },
      data: {
        name: this.eventName,
        date: this.eventDate,
        location: this.eventLocation,
        description: this.eventDescription,
        attendees: this.attendees,
        cost: this.cost,
      },
    });
    $.export("$summary", `Created event ${this.eventName}`);
    return response;
  },
};
