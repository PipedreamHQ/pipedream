import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-update-acl",
  name: "Update Access Control Rule",
  description: "Update Access Control Rule Metadata of a google calendar. [See the docs here](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Acl.html#update)",
  version: "0.1.0",
  type: "action",
  props: {
    googleCalendar,
    calendarId: {
      propDefinition: [
        googleCalendar,
        "calendarId",
      ],
    },
    ruleId: {
      propDefinition: [
        googleCalendar,
        "ruleId",
        (c) => ({
          calendarId: c.calendarId,
        }),
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
  async run({ $ }) {
    const scope = {
      type: this.scopeType,
    };

    if (this.scopeType !== "default" && this.scopeValue.trim().length) {
      scope.value = this.scopeValue;
    }

    const response = await this.googleCalendar.updateAcl({
      calendarId: this.calendarId,
      ruleId: this.ruleId,
      requestBody: {
        scope,
        role: this.role,
      },
    });

    $.export("$summary", `Successfully updated ACL ${response.id}`);

    return response;
  },
};
