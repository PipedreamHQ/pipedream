import gitlab from "../../gitlab.app.mjs";

export default {
  key: "gitlab-get-issue",
  name: "Get Issue",
  description: "Gets a single issue from repository. [See docs](https://docs.gitlab.com/ee/api/issues.html#single-project-issue)",
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
    issueIid: {
      propDefinition: [
        gitlab,
        "issueIid",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.gitlab.getIssue(this.projectId, this.issueIid);
    $.export("$summary", `Retrieved issue ${response.title}`);
    return response;
  },
};
