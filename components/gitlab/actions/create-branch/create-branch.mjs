import gitlab from "../../gitlab.app.mjs";

export default {
  key: "gitlab-create-branch",
  name: "Create Branch",
  description: "Create a new branch in the repository. [See the documentation](https://docs.gitlab.com/ee/api/branches.html#create-repository-branch)",
  version: "0.3.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gitlab,
    projectId: {
      propDefinition: [
        gitlab,
        "projectId",
      ],
    },
    ref: {
      propDefinition: [
        gitlab,
        "branch",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      label: "Branch Ref",
      description: "The branch name or commit SHA to create branch from",
    },
    branchName: {
      type: "string",
      label: "Branch Name",
      description: "The name of the branch to create",
    },
  },
  async run({ $ }) {
    const response = await this.gitlab.createBranch(this.projectId, this.branchName, this.ref);
    $.export("$summary", `Created branch ${this.branchName}`);
    return response;
  },
};
