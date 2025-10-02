import { ConfigurationError } from "@pipedream/platform";
import timecamp from "../../timecamp.app.mjs";

export default {
  name: "Create Time Entry",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "timecamp-create-timeentry",
  description: "Creates a time entry. [See docs here](https://developer.timecamp.com/docs/timecamp-api/b3A6NTY2NDIyOQ-create-time-entry)",
  type: "action",
  props: {
    timecamp,
    date: {
      label: "Date",
      description: "The date will be entry create. E.g. `2021-03-02`",
      type: "string",
      optional: true,
    },
    start: {
      label: "Start Time",
      description: "The entry start time. E.g. `2020-02-02 13:05:47`",
      type: "string",
      optional: true,
    },
    end: {
      label: "End Time",
      description: "The entry end time. E.g. `2020-02-02 15:21:31`",
      type: "string",
      optional: true,
    },
    duration: {
      label: "Duration",
      description: "The time entry duration in seconds if don't have `Start` and `End`. E.g. `7200`",
      type: "integer",
      optional: true,
    },
    note: {
      label: "Description",
      description: "The description of the time entry",
      type: "string",
      optional: true,
    },
    taskId: {
      propDefinition: [
        timecamp,
        "taskId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.duration && (!this.start || !this.end)) {
      throw new ConfigurationError("Is needed `Start` and `End` or `Duration`");
    }

    const response = await this.timecamp.createTimeEntry({
      $,
      data: {
        date: this.date,
        start: this.start,
        end: this.end,
        duration: this.duration,
        note: this.note,
        task_id: this.taskId,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created time entry with id ${response.entry_id}`);
    }

    return response;
  },
};
