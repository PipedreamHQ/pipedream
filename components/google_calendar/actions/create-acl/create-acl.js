const googleCalendar = require("../../google_calendar.app");

module.exports = {
  key: "google_calendar_create_acl",
  name: "Create an Access Control Rule for a calendar",
  description: "Create an Access Control Rule for a calendar.",
  version: "0.0.1",
  type: "action",
  props: {
    googleCalendar,
    calendarId: {
      propDefinition: [
        googleCalendar,
        "calendarId",
      ],
    },
    role: {
      propDefinition: [
        googleCalendar,
        "role",
      ],
    },
    scopeType: {
      propDefinition: [
        googleCalendar,
        "scopeType",
      ],
    },
    scopeValue: {
      propDefinition: [
        googleCalendar,
        "scopeValue",
      ],
    },
  },
  async run() {
    const calendar = this.googleCalendar.calendar();
    let scope = {
      type: this.scopeType,
    };

    if (this.scopeType !== "default" && this.scopeValue.trim().length) {
      scope["value"] = this.scopeValue;
    }

    return (await calendar.acl.insert({
      calendarId: this.calendarId,
      requestBody: {
        role: this.role,
        scope: scope,
      },
    })).data;
  },
};
