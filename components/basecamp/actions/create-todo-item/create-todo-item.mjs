import app from "../../basecamp.app.mjs";

export default {
  key: "basecamp-create-todo-item",
  name: "Create Todo Item",
  description: "Creates a todo in the project and message board selected. [See the docs here](https://github.com/basecamp/bc3-api/blob/master/sections/todos.md#create-a-to-do)",
  type: "action",
  version: "0.0.7",
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    projectId: {
      propDefinition: [
        app,
        "projectId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
    },
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
      label: "Content",
      description: "The title of the todo item.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Containing information about the to-do.  See [Rich text guide](https://github.com/basecamp/bc3-api/blob/master/sections/rich_text.md) for what HTML tags are allowed.",
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
      description: "An array of people that will be assigned to this to-do.",
      optional: true,
    },
    dueOn: {
      type: "string",
      label: "Due on",
      description: "A date when the to-do should be completed. format: `yyyy-mm-dd`.",
      optional: true,
    },
    startsOn: {
      type: "string",
      label: "Starts on",
      description: "Allows the to-do to run from this date to the due date. format: `yyyy-mm-dd`.",
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

    $.export("$summary", `Successfully created todo with ID ${todo.id}`);
    return todo;
  },
};
