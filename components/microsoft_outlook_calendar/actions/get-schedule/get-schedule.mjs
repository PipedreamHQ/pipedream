import microsoftOutlook from "../../microsoft_outlook_calendar.app.mjs";

export default {
  key: "microsoft_outlook_calendar-get-schedule",
  name: "Get Free/Busy Schedule",
  description: "Get the free/busy availability information for a collection of users, distributions lists, or resources (rooms or equipment) for a specified time period. [See the documentation](https://learn.microsoft.com/en-us/graph/api/calendar-getschedule)",
  version: "0.0.1",
  type: "action",
  props: {
    microsoftOutlook,
    schedules: {
      type: "string[]",
      label: "Schedules",
      description: "A collection of SMTP addresses of users, distribution lists, or resources to get availability information for",
    },
    start: {
      propDefinition: [
        microsoftOutlook,
        "start",
      ],
    },
    end: {
      propDefinition: [
        microsoftOutlook,
        "end",
      ],
    },
    timeZone: {
      propDefinition: [
        microsoftOutlook,
        "timeZone",
      ],
    },
    availabilityViewInterval: {
      type: "integer",
      label: "Availability View Interval",
      description: "Represents the duration of a time slot in minutes in an availabilityView in the response. The default is 30 minutes, minimum is 5, maximum is 1440.",
      optional: true,
    },
  },
  methods: {
    getSchedule(opts = {}) {
      return this.microsoftOutlook._makeRequest({
        method: "POST",
        path: "/me/calendar/getSchedule",
        ...opts,
      });
    },
  },
  async run({ $ }) {
    const { value } = await this.getSchedule({
      $,
      data: {
        schedules: this.schedules,
        startTime: {
          dateTime: this.start,
          timeZone: this.timeZone,
        },
        endTime: {
          dateTime: this.end,
          timeZone: this.timeZone,
        },
        availabilityViewInterval: this.availabilityViewInterval,
      },
    });

    $.export("$summary", `Successfully retrieved schedules for \`${this.schedules.join("`, `")}\``);

    return value;
  },
};
