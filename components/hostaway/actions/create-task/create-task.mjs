import hostaway from "../../hostaway.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "hostaway-create-task",
  name: "Create Task",
  description: "Creates a new task in Hostaway. [See the documentation](https://api.hostaway.com/documentation#create-task)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hostaway,
    title: {
      type: "string",
      label: "Title",
      description: "Title of the new task",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the new task",
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
    const { result } = await this.hostaway.createTask({
      data: {
        title: this.title,
        description: this.description,
        listingMapId: this.listingId,
        reservationId: this.reservationId,
        assigneeUserId: this.assigneeId,
        canStartFrom: this.canStartFrom,
        shouldEndBy: this.shouldEndBy,
        categoriesMap: this.categories,
        status: this.status,
      },
      $,
    });

    if (result?.id) {
      $.export("summary", `Successfully created task with ID ${result.id}.`);
    }

    return result;
  },
};
