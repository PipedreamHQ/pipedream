import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-create-calendar",
  name: "Create a Calendar in an user account",
  description: "Create a Calendar in an user account. [See the docs here](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Calendars.html#insert)",
  version: "0.1.9",
  type: "action",
  props: {
    googleCalendar,
    summary: {
      type: "string",
      description: "Title of the calendar.",
      label: "Title",
    },
    description: {
      type: "string",
      description: "Description of the calendar.",
      label: "Description",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.googleCalendar.createCalendar({
      requestBody: {
        summary: this.summary,
        description: this.description,
      },
    });

    $.export("$summary", `Successfully created calendar ${response.id}`);

    return response;
  },
};
