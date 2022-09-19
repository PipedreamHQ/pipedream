import ticktick from "../../ticktick.app.mjs";
import { removeNullEntries } from "../../common/utils.mjs";

export default {
  key: "ticktick-update-task",
  name: "Update a Task",
  description: "Update a Task. [See doc](https://developer.ticktick.com/api#/openapi?id=update-a-task)",
  version: "0.0.2",
  type: "action",
  props: {
    ticktick,
    projectId: {
      propDefinition: [
        ticktick,
        "projectId",
      ],
    },
    taskId: {
      propDefinition: [
        ticktick,
        "taskId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      description: "ID of task to update",
    },
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
    allDay: {
      type: "boolean",
      label: "All day",
      description: "All day",
      reloadProps: true,
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.allDay) {
      props.startDate = {
        type: "string",
        label: "Start date",
        description: "Start date and time in \"yyyy-MM-dd'T'HH:mm:ssZ\" format. Example : \"2019-11-13T03:00:00+0000\"",
        optional: true,
      };
      props.dueDate = {
        type: "string",
        label: "Due date",
        description: "Due date and time in \"yyyy-MM-dd'T'HH:mm:ssZ\" format. Example : \"2019-11-13T03:00:00+0000\"",
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const data = removeNullEntries({
      title: this.title,
      content: this.content,
      startDate: this.startDate,
      dueDate: this.dueDate,
      allDay: this.allDay,
    });
    if (this.projectId && this.projectId !== "inbox") {
      data.projectId = this.projectId;
    }
    const response = await this.ticktick.updateTask({
      $,
      data,
    }, this.taskId);
    response && $.export("$summary", "Successfully updated task");
    return response;
  },
};
