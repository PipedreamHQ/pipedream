import { defineAction } from "@pipedream/types";
import app from "../../app/zoho_assist.app";
import { ScheduleSessionParams } from "../../common/types";
import { getValidDate } from "../../common/methods";
import { TIMEZONE_OPTIONS } from "../../common/constants";

export default defineAction({
  name: "Schedule Session",
  description: "Schedule a remote support session. [See the documentation](https://www.zoho.com/assist/api/schedulesession.html)",
  key: "zoho_assist-schedule-session",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    title: {
      type: "string",
      label: "Title",
      description: "Title of the scheduled session",
    },
    customerEmail: {
      type: "string",
      label: "Customer Email",
      description:
        "The customer's email address to whom the session will be scheduled.",
    },
    scheduleTime: {
      propDefinition: [
        app,
        "date",
      ],
      label: "Schedule Time",
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description:
        "The time zone in which the session is scheduled.",
      options: TIMEZONE_OPTIONS,
    },
    reminder: {
      type: "integer",
      label: "Reminder",
      description:
        "A reminder time for joining the session.",
    },
    departmentId: {
      propDefinition: [
        app,
        "departmentId",
      ],
    },
    notes: {
      type: "string",
      label: "Notes",
      description:
        "Schedule session description.",
      optional: true,
    },
  },
  methods: {
    getValidDate,
    getUtcOffset(tz: string) {
      return tz.match(/[+-][0-9]{2}:[0-9]{2}/)?.[0] ?? "00:00";
    },
  },
  async run({ $ }) {
    const {
      title,
      customerEmail,
      scheduleTime,
      timeZone,
      reminder,
      departmentId,
      notes,
    } = this;

    const params: ScheduleSessionParams = {
      $,
      data: {
        mode: "SCHEDULE",
        title,
        customer_email: customerEmail,
        schedule_time: this.getValidDate(scheduleTime),
        utc_offset: this.getUtcOffset(timeZone),
        time_zone: timeZone,
        reminder,
        department_id: departmentId,
        notes,
      },
    };

    const { representation } = await this.app.scheduleSession(params);

    $.export("$summary", `Successfully scheduled session (ID: ${representation.schedule_id})`);

    return representation;
  },
});
