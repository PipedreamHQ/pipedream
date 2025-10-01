import gitlab from "../../gitlab.app.mjs";
import lodash from "lodash";

export default {
  key: "gitlab-list-commits",
  name: "List Commits",
  description: "List commits in a repository branch. [See the documentation](https://docs.gitlab.com/ee/api/commits.html#list-repository-commits)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    refName: {
      propDefinition: [
        gitlab,
        "branch",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      optional: true,
    },
    max: {
      propDefinition: [
        gitlab,
        "max",
      ],
    },
  },
  async run({ $ }) {
    const params = lodash.pickBy({
      ref_name: this.refName,
      per_page: this.max,
    });
    const commits = await this.gitlab.listCommits(this.projectId, {
      params,
    });
    const suffix = commits.length === 1
      ? ""
      : "s";
    $.export("$summary", `Retrieved ${commits.length} commit${suffix}`);
    return commits;
  },
};
