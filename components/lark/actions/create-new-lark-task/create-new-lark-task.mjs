import { MODE_OPTIONS } from "../../common/constants.mjs";
import lark from "../../lark.app.mjs";

export default {
  key: "lark-create-new-lark-task",
  name: "Create New Lark Task",
  description: "Creates a new task in Lark. [See the documentation](https://open.larksuite.com/document/uajlw4cm/uktmuktmuktm/task-v2/task/create)",
  version: "0.0.1",
  type: "action",
  props: {
    lark,
    summary: {
      type: "string",
      label: "Summary",
      description: "Task summary. Empty is not allowed; supports up to 3000 utf8 characters.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Task description. Supports up to 3000 utf8 characters.",
      optional: true,
    },
    dueTimestamp: {
      type: "string",
      label: "Due Timestamp",
      description: "The timestamp of the due time/date, in milliseconds from 1970-01-01 00:00:00 UTC. If the expiration time is a date, you need to convert the date to timestamp and set `Is All Day` to true.",
    },
    isAllDay: {
      type: "boolean",
      label: "Due Is All Day",
      description: "Whether to due on a date. If set to true, only the date part of the timestamp will be parsed and stored.",
      optional: true,
    },
    extra: {
      type: "string",
      label: "Extra",
      description: "Any data that the caller can pass in attached to the task. It will be returned as it is when getting the task details. If it is binary data, it can be encoded with Base64.",
      optional: true,
    },
    completedAt: {
      type: "string",
      label: "Completed At",
      description: "The completion time timestamp (ms) of the task. Fill in or set to 0 to create an unfinished task; fill in a specific timestamp to create a completed task.",
      optional: true,
    },
    repeatRule: {
      type: "string",
      label: "Repeat Rule",
      description: "Task repeat rule. If set, the task is \"recurring task\". Please refer to the [How to Use Recurring Tasks?](https://open.larksuite.com/document/uAjLw4CM/ukTMukTMukTM/task-v2/task/overview) section in Task Feature Overview. E.g. **FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,TU,WE,TH,FR**",
      optional: true,
    },
    startTimestamp: {
      type: "string",
      label: "Start Timestamp",
      description: "The timestamp of the start time/date in milliseconds from 1970-01-01 00:00:00. If the start time is a date, you need to convert the date to timestamp and set `Due Is All Day` to true. If you set both the start time and the deadline for the task, the start time must be < = deadline, and the `Is All Day` settings for the start/deadline must be the same.",
    },
    startIsAllDay: {
      type: "boolean",
      label: "Start Is All Day",
      description: "Whether to start on a date. If set to true, only the date part of the timestamp will be parsed and stored.",
      optional: true,
    },
    mode: {
      type: "integer",
      label: "Mode",
      description: "The mode of the task. If set to `auto_complete`, the task will be completed automatically when the due time is reached.",
      options: MODE_OPTIONS,
      optional: true,
    },
    isMilestone: {
      type: "boolean",
      label: "Is Milestone",
      description: "Is it a milestone task",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.lark.createTask({
      $,
      data: {
        summary: this.summary,
        description: this.description,
        due: {
          timestamp: this.dueTimestamp,
          is_all_day: this.isAllDay,
        },
        extra: this.extra,
        completed_at: this.completedAt,
        repeat_rule: this.repeatRule,
        start: {
          timestamp: this.startTimestamp,
          is_all_day: this.startIsAllDay,
        },
        mode: this.mode,
        is_milestone: this.isMilestone,
      },
    });

    $.export("$summary", `Successfully created task with GUID "${response.data.task.guid}"`);
    return response;
  },
};
