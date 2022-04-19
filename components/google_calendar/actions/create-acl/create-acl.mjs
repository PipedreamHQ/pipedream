import googleCalendar from "../../google_calendar.app.mjs";

export default {
  key: "google_calendar-create-acl",
  name: "Create an Access Control Rule for a calendar",
  description: "Create an Access Control Rule for a calendar. [See the docs here](https://googleapis.dev/nodejs/googleapis/latest/calendar/classes/Resource$Acl.html#insert)",
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

    const response = await this.googleCalendar.createAcl({
      calendarId: this.calendarId,
      requestBody: {
        role: this.role,
        scope,
      },
    });

    $.export("$summary", `Successfully created ACL ${response.id}`);

    return response;
  },
};
