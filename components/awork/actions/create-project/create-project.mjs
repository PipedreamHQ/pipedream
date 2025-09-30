import awork from "../../awork.app.mjs";

export default {
  name: "Create Project",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "awork-create-project",
  description: "Creates a project. [See docs here](https://openapi.awork.io/#/Projects/post_projects)",
  type: "action",
  props: {
    awork,
    name: {
      label: "Name",
      description: "The name of the project",
      type: "string",
    },
    startDate: {
      label: "Start Date",
      description: "The start date of the project. E.g. `2022-03-01T00:00:00Z`",
      type: "string",
      optional: true,
    },
    dueDate: {
      label: "Due Date",
      description: "The due date of the project. E.g. `2022-05-01T00:00:00Z`",
      type: "string",
      optional: true,
    },
    description: {
      label: "Description",
      description: "The description of the project",
      type: "string",
      optional: true,
    },
    timeBudget: {
      label: "Time Budget",
      description: "The time budget in seconds of the project. E.g. `576000`",
      type: "string",
      optional: true,
    },
    isPrivate: {
      label: "Is Private",
      description: "The project will be private",
      type: "boolean",
      optional: true,
    },
    isBillableByDefault: {
      label: "Is Billable By Default",
      description: "The project will be billable by default",
      type: "boolean",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.awork.createProject({
      $,
      data: {
        name: this.name,
        description: this.description,
        startDate: this.startDate,
        dueDate: this.dueDate,
        timeBudget: this.timeBudget,
        isPrivate: this.isPrivate,
        isBillableByDefault: this.isBillableByDefault,
      },
    });

    if (response) {
      $.export("$summary", `Successfully created project with id ${response.id}`);
    }

    return response;
  },
};
