import { ConfigurationError } from "@pipedream/platform";
import microsoftOutlook from "../../microsoft_outlook_calendar.app.mjs";
import utils from "../../common/utils.mjs";
import { DateTime } from "luxon";
import { findIana } from "windows-iana";

export default {
  key: "microsoft_outlook_calendar-get-schedule",
  name: "Get Free/Busy Schedule",
  description: "Get the free/busy availability information for a collection of users, distributions lists, or resources (rooms or equipment) for a specified time period. [See the documentation](https://learn.microsoft.com/en-us/graph/api/calendar-getschedule)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    microsoftOutlook,
    schedules: {
      type: "string[]",
      label: "Schedules",
      description: "A list of emails of users, distribution lists, or resources. For example: `[ \"adelev@contoso.com\" , \"meganb@contoso.com\" ]`",
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
    convertWorkingHoursToItemTimezone(response) {
      const workingHours = response?.workingHours;

      if (!workingHours) return undefined;

      // Extract the Windows-style names
      const sourceWinTz = workingHours.timeZone.name;
      const targetWinTz = this.timeZone;

      // Convert to IANA time zones
      const sourceIana = findIana(sourceWinTz)?.[0]?.valueOf() || "UTC";
      const targetIana = findIana(targetWinTz)?.[0]?.valueOf() || "UTC";

      const startTime = DateTime.fromISO(`2025-01-01T${workingHours.startTime}`, {
        zone: sourceIana,
      }).setZone(targetIana);

      const endTime = DateTime.fromISO(`2025-01-01T${workingHours.endTime}`, {
        zone: sourceIana,
      }).setZone(targetIana);

      return {
        ...workingHours,
        startTime: startTime.toFormat("HH:mm:ss.SSSSSSS"),
        endTime: endTime.toFormat("HH:mm:ss.SSSSSSS"),
        timeZone: {
          name: targetWinTz,
        },
      };
    },
  },
  async run({ $ }) {
    if (this.schedules === null || this.schedules === undefined || this.schedules?.length === 0) {
      throw new ConfigurationError("The **Schedules** property is required");
    }

    const schedules = utils.parseArray(this.schedules);

    const { value } = await this.getSchedule({
      $,
      data: {
        schedules,
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
      headers: {
        Prefer: `outlook.timezone="${this.timeZone}"`,
      },
    });

    if (value?.length > 0 && value[0].workingHours) {
      const convertedHours = this.convertWorkingHoursToItemTimezone(value[0]);
      if (convertedHours) {
        value[0].workingHours = convertedHours;
      }
    }

    $.export("$summary", `Successfully retrieved schedules for \`${schedules.join("`, `")}\``);

    return value;
  },
};
