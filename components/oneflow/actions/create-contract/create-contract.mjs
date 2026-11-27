import app from "../../oneflow.app.mjs";

export default {
  key: "oneflow-create-contract",
  name: "Create Contract",
  description: "Create a draft contract from a template. A draft is visible only to your side until it is published in Oneflow."
    + " Use **List Workspaces** and **List Templates** to find the workspace and template."
    + " [See the documentation](https://developer.oneflow.com/reference/create-a-contract)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    userEmail: {
      propDefinition: [
        app,
        "userEmail",
      ],
      description: "The email address of the active Oneflow user who creates the contract, e.g. `jane@example.com`. Use **List Users** to find it (the `email` field).",
      optional: false,
    },
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
        ({ userEmail }) => ({
          userEmail,
        }),
      ],
    },
    templateId: {
      propDefinition: [
        app,
        "templateId",
        ({
          userEmail, workspaceId,
        }) => ({
          userEmail,
          workspaceId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contract, up to 130 characters, e.g. `Acme service agreement`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const contract = await this.app.createContract({
      $,
      userEmail: this.userEmail,
      data: {
        workspace_id: this.workspaceId,
        template_id: this.templateId,
        name: this.name,
      },
    });
    $.export("$summary", `Created draft contract ${contract.id}: ${contract.name}`);
    return contract;
  },
};
