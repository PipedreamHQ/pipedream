import base from "../common/base.mjs";

export default {
  ...base,
  key: "jira-get-projects",
  name: "Get Projects",
  description: "Gets metadata of projects. [See docs here](https://developer.atlassian.com/cloud/jira/platform/rest/v3/#api-rest-api-3-project-get)",
  version: "0.2.0",
  type: "action",
  async run({ $ }) {
    const response = await this.jira.getProjects({
      $,
      cloudId: this.cloudId,
    });

    $.export("$summary", "Successfully retrieved projects");

    return response;
  },
};
