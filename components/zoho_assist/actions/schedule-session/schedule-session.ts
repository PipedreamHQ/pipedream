import { defineAction } from "@pipedream/types";
import app from "../../app/zoho_assist.app";
import { ScheduleSessionParams } from "../../common/types";

export default defineAction({
  name: "Schedule Session",
  description: "Schedule a remote support session. [See the documentation](https://www.zoho.com/assist/api/schedulesession.html)",
  key: "zoho_assist-schedule-session",
  version: "0.0.1",
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
      type: "integer",
      label: "Schedule Time",
      description:
        "Time (in milliseconds) when the session is scheduled.",
    },
    utcOffset: {
      type: "string",
      label: "UTC Offset",
      description:
        "Coordinated Universal Time in the respective time zone. Example: `+05:30`",
    },
    timeZone: {
      type: "string",
      label: "Time Zone",
      description:
        "The time zone in which the session is scheduled. Example: `Asia/Kolkata`",
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
  async run({ $ }) {
    const {
      title,
      customerEmail,
      scheduleTime,
      utcOffset,
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
        schedule_time: scheduleTime,
        utc_offset: utcOffset,
        time_zone: timeZone,
        reminder,
        department_id: departmentId,
        notes,
      },
    };

    const response = await this.app.scheduleSession(params);

    $.export("$summary", "Successfully scheduled session");

    return response;
  },
});
