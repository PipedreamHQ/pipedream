const googleCalendar = require("../../google_calendar.app");

module.exports = {
  key: "google_calendar_update_acl",
  name: "Update Access Control Rule",
  description: "Update Access Control Rule Metadata of a google calendar.",
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
      label: "Role",
      type: "string",
      description: "The role assigned to the scope.",
      optional: true,
      options() {
        const roles = [
          "none",
          "freeBusyReader",
          "reader",
          "writer",
          "owner",
        ];
        const options = roles.map((role) => {
          return {
            label: role,
            value: role,
          };
        });
        return options;
      },
    },
    scopeType: {
      label: "Type of the Scope",
      type: "string",
      description: "The extent to which calendar access is granted by this ACL rule.",
      optional: true,
      default: "default",
      options() {
        const types = [
          "user",
          "group",
          "domain",
        ];
        const options = types.map((type) => {
          return {
            label: type,
            value: type,
          };
        });
        return options;
      },
    },
    scopeValue: {
      label: "Type of the Scope",
      type: "string",
      description: "The email address of a user or group, or the name of a domain, depending on the scope type. Omitted for type 'default'",
      optional: true,
      default: "",
    },
  },
  async run() {
    const calendar = this.googleCalendar.calendar();

    let scope = {
      type: this.scopeType,
    };

    if (this.scopeType !== "default") {
      scope["value"] = this.scopeValue;
    }

    return (await calendar.acl.update({
      calendarId: this.calendarId,
      ruleId: this.ruleId,
      requestBody: {
        scope,
        role: this.role,
      },
    })).data;
  },
};
