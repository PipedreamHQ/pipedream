import gitlab from "../../gitlab.app.mjs";

export default {
  key: "gitlab-get-repo-branch",
  name: "Get Repo Branch",
  description: "Get a single project repository branch. [See docs](https://docs.gitlab.com/ee/api/branches.html#get-single-repository-branch)",
  version: "0.2.0",
  type: "action",
  props: {
    gitlab,
    projectId: {
      propDefinition: [
        gitlab,
        "projectId",
      ],
    },
    branch: {
      propDefinition: [
        gitlab,
        "branch",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gitlab.getBranch(this.projectId, this.branch);
    $.export("$summary", `Retrieved branch ${this.branch}`);
    return response;
  },
};
