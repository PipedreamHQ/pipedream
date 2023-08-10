import { defineAction } from "@pipedream/types";
import app from "../../app/zoho_assist.app";
import { ScheduleSessionParams } from "../../common/types";
import { getValidDate } from "../../common/methods";

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
      propDefinition: [
        app,
        "date",
      ],
      label: "Schedule Time",
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
  methods: {
    getValidDate,
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
        schedule_time: Number(this.getValidDate(scheduleTime)),
        utc_offset: utcOffset,
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
