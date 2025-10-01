import kenjo from "../../kenjo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "kenjo-create-attendance-entry",
  name: "Create Attendance Entry",
  description: "Creates a new attendance entry for an employee in Kenjo. [See the documentation](https://kenjo.readme.io/reference/post_attendances)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    kenjo,
    employeeId: {
      propDefinition: [
        kenjo,
        "employeeId",
      ],
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date of the entry. Format: `YYYY-MM-DD`",
    },
    startTime: {
      type: "string",
      label: "Start Time",
      description: "The start time of the entry. Format: `hh:mm:ss`",
    },
    endTime: {
      type: "string",
      label: "End Time",
      description: "The end time of the entry. Format: `hh:mm:ss`",
      optional: true,
    },
    breakStartTime: {
      type: "string",
      label: "Break Start Time",
      description: "The start time of the break. Format: `hh:mm:ss`",
      optional: true,
    },
    breakEndTime: {
      type: "string",
      label: "Break End Time",
      description: "The end time of the break. Format: `hh:mm:ss`",
      optional: true,
    },
    comment: {
      type: "string",
      label: "Comment",
      description: "Comment to describe the attendance record",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.breakEndTime && !this.breakStartTime) {
      throw new ConfigurationError("Break Start Time is required if including a break");
    }

    const response = await this.kenjo.createAttendanceEntry({
      $,
      data: {
        userId: this.employeeId,
        date: this.date,
        startTime: this.startTime,
        endTime: this.endTime,
        breaks: this.breakStartTime && [
          {
            start: this.breakStartTime,
            end: this.breakEndTime,
          },
        ],
        comment: this.comment,
      },
    });
    $.export("$summary", `Successfully created attendance entry with ID: ${response._id}`);
    return response;
  },
};
