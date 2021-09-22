const googleCalendar = require("../../google_calendar.app");

module.exports = {
  key: "google_calendar_create_calendar",
  name: "Create a Calendar in an user account",
  description: "Create a Calendar in an user account.",
  version: "0.0.1",
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
  async run() {
    const calendar = this.googleCalendar.calendar();
    return (await calendar.calendars.insert({
      requestBody: {
        summary: this.summary,
        description: this.description,
      },
    })).data;
  },
};
