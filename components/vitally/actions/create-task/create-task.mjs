import vitally from "../../vitally.app.mjs";

export default {
  key: "vitally-create-task",
  name: "Create Task",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new task. [See the documentation](https://docs.vitally.io/pushing-data-to-vitally/rest-api/tasks#create-a-task-post)",
  type: "action",
  props: {
    vitally,
    name: {
      type: "string",
      label: "Name",
      description: "The name or subject of the task.",
    },
    accountId: {
      propDefinition: [
        vitally,
        "accountId",
      ],
    },
    externalId: {
      propDefinition: [
        vitally,
        "externalId",
      ],
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the task, may include HTML.",
      optional: true,
    },
    assignedToId: {
      propDefinition: [
        vitally,
        "assignedToId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
      optional: true,
    },
    completedById: {
      propDefinition: [
        vitally,
        "assignedToId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
      label: "Completed By Id",
      description: "The Id of the Vitally Admin User who completed to the Task.",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The date when the Task is due. `Format: YYYY-MM-DD`.",
      optional: true,
    },
    completedAt: {
      type: "string",
      label: "Completed At",
      description: "The timestamp of when the Task was completed. `Format: YYYY-MM-DDTHH:MM:mm:ss.SSSZ`.",
      optional: true,
    },
    categoryId: {
      propDefinition: [
        vitally,
        "categoryId",
      ],
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "An array of string tags to associate to the note.",
      optional: true,
    },
    traits: {
      type: "object",
      label: "Traits",
      description: "A key-value JSON object of custom note traits.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      vitally,
      ...data
    } = this;

    const response = await vitally.createTask({
      $,
      data,
    });

    $.export("$summary", `A new task with Id: ${response.id} was successfully created!`);
    return response;
  },
};
