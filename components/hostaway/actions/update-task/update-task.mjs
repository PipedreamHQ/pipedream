import hostaway from "../../hostaway.app.mjs";
import pickBy from "lodash.pickby";
import constants from "../../common/constants.mjs";

export default {
  key: "hostaway-update-task",
  name: "Update Task",
  description: "Updates an existing task in Hostaway. [See the documentation](https://api.hostaway.com/documentation#update-task)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hostaway,
    taskId: {
      propDefinition: [
        hostaway,
        "taskId",
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "New title of the task",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "New description of the task",
      optional: true,
    },
    listingId: {
      propDefinition: [
        hostaway,
        "listingId",
      ],
      optional: true,
    },
    reservationId: {
      propDefinition: [
        hostaway,
        "reservationId",
        (c) => ({
          listingId: c.listingId,
        }),
      ],
    },
    assigneeId: {
      propDefinition: [
        hostaway,
        "userId",
      ],
      label: "Assignee",
    },
    canStartFrom: {
      type: "string",
      label: "Can Start From",
      description: "Start time of the task. Example: `2023-07-01 00:00:00`",
      optional: true,
    },
    shouldEndBy: {
      type: "string",
      label: "Should End By",
      description: "End time of the task. Example: `2023-07-30 00:00:00`",
      optional: true,
    },
    categories: {
      type: "integer[]",
      label: "Categories",
      description: "Categories assigned to the task",
      options: constants.CATEGORIES,
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the task",
      options: constants.TASK_STATUS,
      optional: true,
    },
  },
  async run({ $ }) {
    const { result } = await this.hostaway.updateTask({
      taskId: this.taskId,
      data: pickBy({
        title: this.title,
        description: this.description,
        listingMapId: this.listingId,
        reservationId: this.reservationId,
        assigneeUserId: this.assigneeId,
        canStartFrom: this.canStartFrom,
        shouldEndBy: this.shouldEndBy,
        categoriesMap: this.categories,
        status: this.status,
      }),
      $,
    });

    if (result?.id) {
      $.export("summary", `Successfully updated task with ID ${result.id}.`);
    }

    return result;
  },
};
