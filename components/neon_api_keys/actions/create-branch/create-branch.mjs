import app from "../../neon_api_keys.app.mjs";

export default {
  name: "Create Branch",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "neon_api_keys-create-branch",
  description: "Creates a branch in the project. [See docs here](https://api-docs.neon.tech/reference/createprojectbranch)",
  type: "action",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    branchId: {
      label: "Parent Branch ID",
      description: "The branch ID of the parent branch. If omitted or empty, the branch will be created from the project's primary branch.",
      propDefinition: [
        app,
        "branchId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The branch name",
    },
  },
  async run({ $ }) {
    const response = await this.app.createBranch({
      $,
      projectId: this.projectId,
      data: {
        branch: {
          name: this.name,
          parent_id: this.parentId,
        },
      },
    });

    if (response) {
      $.export("$summary", `Successfully created branch with ID ${response.branch.id}`);
    }

    return response;
  },
};
