import app from "../../basecamp.app.mjs";
import common from "../../common/common.mjs";

export default {
  key: "basecamp-create-todo-item",
  name: "Create To-do Item",
  description: "Creates a to-do item in a selected to-do list. [See the documentation](https://github.com/basecamp/bc3-api/blob/master/sections/todos.md#create-a-to-do)",
  type: "action",
  version: "0.0.10",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    todoSetId: {
      propDefinition: [
        app,
        "todoSetId",
        ({
          accountId,
          projectId,
        }) => ({
          accountId,
          projectId,
        }),
      ],
    },
    todoListId: {
      propDefinition: [
        app,
        "todoListId",
        ({
          accountId,
          projectId,
          todoSetId,
        }) => ({
          accountId,
          projectId,
          todoSetId,
        }),
      ],
    },
    content: {
      type: "string",
      label: "Title (Content)",
      description: "The title of the to-do item.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the item. [See the documentation](https://github.com/basecamp/bc3-api/blob/master/sections/todos.md#create-a-to-do) for information on using HTML tags.",
      optional: true,
    },
    assigneeIds: {
      propDefinition: [
        app,
        "peopleIds",
        ({
          accountId,
          projectId,
        }) => ({
          accountId,
          projectId,
        }),
      ],
      label: "Assignee",
      description: "One or more people to be assigned to this item.",
      optional: true,
    },
    dueOn: {
      type: "string",
      label: "Due On",
      description: "The due date when the item should be completed, in `YYYY-MM-DD` format.`",
      optional: true,
    },
    startsOn: {
      type: "string",
      label: "Starts On",
      description: "The start date, in `YYYY-MM-DD` format. Allows the item to run from this date to the `Due Date`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      accountId,
      projectId,
      todoListId,
      content,
      description,
      assigneeIds,
      dueOn,
      startsOn,
    } = this;

    const todo = await this.app.createTodoItem({
      $,
      accountId,
      projectId,
      todoListId,
      data: {
        content,
        description,
        assignee_ids: assigneeIds,
        due_on: dueOn,
        starts_on: startsOn,
      },
    });

    $.export("$summary", `Successfully created to-do (ID: ${todo.id})`);
    return todo;
  },
};
