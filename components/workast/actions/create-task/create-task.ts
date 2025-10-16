import { defineAction } from "@pipedream/types";
import workast from "../../app/workast.app";

export default defineAction({
  name: "Create Task",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "workast-create-task",
  description: "Creates a task. [See docs here](https://developers.workast.com/#/method/createTask)",
  type: "action",
  props: {
    workast,
    listId: {
      propDefinition: [
        workast,
        "listId",
      ],
    },
    text: {
      label: "Text",
      description: "The task main text",
      type: "string",
    },
    description: {
      label: "Description",
      description: "The task description",
      type: "string",
      optional: true,
    },
    userId: {
      label: "Assigned To",
      description: "The user ID to assigne to the task",
      propDefinition: [
        workast,
        "userId",
      ],
      optional: true,
    },
    startDate: {
      label: "Start Date",
      description: "The task start date. `E.g. 2022-04-04T08:15Z`",
      type: "string",
      optional: true,
    },
    dueDate: {
      label: "Due Date",
      description: "The task due date. `E.g. 2022-04-04T17:30Z`",
      type: "string",
      optional: true,
    },
    listPosition: {
      label: "List Position",
      description: "The task position within the list",
      type: "integer",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.workast.createTask({
      $,
      listId: this.listId,
      data: {
        text: this.text,
        description: this.description,
        assignedTo: this.userId
          ? [
            this.userId,
          ]
          : undefined,
        startDate: this.startDate,
        dueDate: this.dueDate,
        listPosition: this.listPosition,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created task with id ${response.id}`);
    }

    return response;
  },
});
