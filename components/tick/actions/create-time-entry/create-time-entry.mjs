import tick from "../../tick.app.mjs";

export default {
  name: "Create Time Entry",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "tick-create-time-entry",
  description: "Creates a time entry. [See docs here](https://github.com/tick/tick-api/blob/master/sections/entries.md#create-entry)",
  type: "action",
  props: {
    tick,
    taskId: {
      propDefinition: [
        tick,
        "taskId",
      ],
    },
    userId: {
      propDefinition: [
        tick,
        "userId",
      ],
    },
    date: {
      label: "Date",
      description: "The date of the time entry. E.g. `2014-09-18`",
      type: "string",
    },
    hours: {
      label: "Hours",
      description: "The hours of the time entry. E.g. `1.5`",
      type: "string",
    },
    notes: {
      label: "Notes",
      description: "The notes of the time entry. E.g. `Chasing Ewoks`",
      type: "string",
    },
  },
  async run({ $ }) {
    const response = await this.tick.createTimeEntry({
      $,
      data: {
        task_id: this.taskId,
        user_id: this.userId,
        date: this.date,
        hours: this.hours,
        notes: this.notes,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created time entry with id ${response.id}`);
    }

    return response;
  },
};
