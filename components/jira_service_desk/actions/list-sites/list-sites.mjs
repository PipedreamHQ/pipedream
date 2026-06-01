import app from "../../jira_service_desk.app.mjs";

export default {
  key: "jira_service_desk-list-sites",
  name: "List Sites",
  description:
    "Returns all Atlassian cloud sites accessible to the authenticated user."
    + " **Call this tool first** to obtain the `cloudId` (returned as `id`) required by every other Jira Service Desk tool."
    + " Each site includes its `id` (cloudId), `name`, and `url`."
    + " [See the documentation](https://developer.atlassian.com/cloud/jira/service-desk/oauth-2-3lo-servicedeskapi/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const sites = await this.app.getSites();
    $.export("$summary", `Found ${sites?.length ?? 0} accessible Atlassian site(s)`);
    return sites;
  },
};
