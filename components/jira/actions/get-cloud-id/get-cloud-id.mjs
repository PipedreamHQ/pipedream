import jira from "../../jira.app.mjs";

export default {
  key: "jira-get-cloud-id",
  name: "Get Cloud ID",
  description: "Lists all accessible Jira Cloud sites and their IDs. Run this before any Jira action that requires a Cloud ID, then pass the selected site's `id` to that action. [See the documentation](https://developer.atlassian.com/cloud/jira/platform/oauth-2-3lo-apps/#3-1-get-the-cloudid-for-your-site)",
  version: "0.0.6",
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
