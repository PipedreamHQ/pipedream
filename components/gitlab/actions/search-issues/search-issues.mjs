import gitlab from "../../gitlab.app.mjs";
import constants from "../../common/constants.mjs";
import lodash from "lodash";

export default {
  key: "gitlab-search-issues",
  name: "Search Issues",
  description: "Search for issues in a repository with a query. [See the documentation](https://docs.gitlab.com/ee/api/issues.html#list-issues)",
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
    search: {
      propDefinition: [
        gitlab,
        "query",
      ],
      description: "Search issues against their **title** and **description**. Leave this field blank to list all issues",
      optional: true,
    },
    labels: {
      propDefinition: [
        gitlab,
        "labels",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
      description: "A list of label names. Issues must have all labels to be returned. `None` lists all issues with no labels. `Any` lists all issues with at least one label",
    },
    state: {
      propDefinition: [
        gitlab,
        "issueState",
      ],
    },
    assigneeId: {
      propDefinition: [
        gitlab,
        "assignee",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
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
      search: this.search,
      labels: this.labels,
      state: this.state,
      assignee_id: this.assigneeId,
      per_page: this.max,
    });
    params.scope = constants.issues.scopes.ALL;
    params.labels = params.labels?.join();

    const issues = await this.gitlab.searchIssues(this.projectId, {
      params,
    });
    const suffix = issues.length === 1
      ? ""
      : "s";
    $.export("$summary", `Returned ${issues.length} issue${suffix}`);
    return issues;
  },
};
