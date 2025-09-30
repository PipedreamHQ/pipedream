import app from "../../blazemeter.app.mjs";

export default {
  key: "blazemeter-create-project",
  name: "Create Project",
  description: "Creates a new project in a specific workspace. [See the documentation](https://api.blazemeter.com/functional/#create-a-project)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
        (c) => ({
          accountId: c.accountId,
        }),
      ],
    },
    projectName: {
      propDefinition: [
        app,
        "projectName",
      ],
    },
    projectDescription: {
      propDefinition: [
        app,
        "projectDescription",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createProject({
      $,
      data: {
        name: this.projectName,
        description: this.projectDescription,
        workspaceId: this.workspaceId,
      },
    });

    $.export("$summary", `Successfully created project '${this.projectName}' in workspace ${this.workspaceId}`);

    return response;
  },
};
