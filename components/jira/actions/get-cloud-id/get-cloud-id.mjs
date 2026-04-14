import jira from "../../jira.app.mjs";

export default {
  key: "jira-get-cloud-id",
  name: "Get Cloud ID",
  description: "Gets the cloud ID and details of all accessible Jira Cloud sites. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/)",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    jira,
  },
  async run({ $ }) {
    const response = await this.jira.getClouds({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.length} accessible cloud site${response.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
