import ticktick from "../../ticktick.app.mjs";
import { removeNullEntries } from "../../common/utils.mjs";

export default {
  key: "ticktick-create-task",
  name: "Create a Task",
  description: "Create a Task.[See doc](https://developer.ticktick.com/api#/openapi?id=create-a-task)",
  version: "0.0.2",
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
      type: "string",
      label: "Project ID",
      description: "The project ID under which to create this task. Defaults to the inbox.",
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
  },
  async run({ $ }) {
    const data = removeNullEntries({
      title: this.title,
      content: this.content,
      projectId: this.projectId,
      startDate: this.startDate,
      dueDate: this.dueDate,
    });
    const response = await this.ticktick.createTask({
      $,
      data,
    });
    response && $.export("$summary", "Successfully created task");
    return response;
  },
};
