import ticktick from "../../ticktick.app.mjs";
import { removeNullEntries } from "../../common/utils.mjs";

export default {
  key: "ticktick-create-task",
  name: "Create a Task",
  description: "Create a Task. [See the documentation](https://developer.ticktick.com/api#/openapi?id=create-a-task)",
  version: "0.0.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ticktick,
    title: {
      type: "string",
      label: "Title",
      description: "Task title",
    },
    content: {
      type: "string",
      label: "Content",
      description: "Task content",
      optional: true,
    },
    projectId: {
      propDefinition: [
        ticktick,
        "projectId",
      ],
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start date",
      description: "Start date and time in \"yyyy-MM-dd'T'HH:mm:ssZ\" format. Example : \"2019-11-13T03:00:00+0000\"",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due date",
      description: "Due date and time in \"yyyy-MM-dd'T'HH:mm:ssZ\" format. Example : \"2019-11-13T03:00:00+0000\"",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority of the task, defaults to \"None\"",
      default: "0",
      optional: true,
      options: [
        {
          label: "None",
          value: "0",
        },
        {
          label: "Low",
          value: "1",
        },
        {
          label: "Medium",
          value: "3",
        },
        {
          label: "High",
          value: "5",
        },
      ],
    },
  },
  async run({ $ }) {
    const data = removeNullEntries({
      title: this.title,
      content: this.content,
      startDate: this.startDate,
      dueDate: this.dueDate,
      priority: this.priority,
    });

    if (this.projectId && this.projectId !== "inbox") {
      data.projectId = this.projectId;
    }

    const response = await this.ticktick.createTask({
      $,
      data,
    });
    response && $.export("$summary", "Successfully created task");
    return response;
  },
};
