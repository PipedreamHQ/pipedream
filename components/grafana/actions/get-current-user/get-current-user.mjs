// vandelay-test-dr
import grafana from "../../grafana.app.mjs";

export default {
  key: "grafana-get-current-user",
  name: "Get Current User",
  description:
    "Get the current authenticated Grafana user's identity,"
    + " including user ID, name, email, organization, and role."
    + " Use this to understand the user's permissions and"
    + " organizational context."
    + " The user ID and org context may be needed when creating"
    + " dashboards or filtering resources.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    grafana,
  },
  async run({ $ }) {
    const user = await this.grafana.getCurrentUser($);

    const result = {
      userId: user.id,
      name: user.name,
      login: user.login,
      email: user.email,
      orgId: user.orgId,
      isGrafanaAdmin: user.isGrafanaAdmin,
      theme: user.theme,
    };

    $.export(
      "$summary",
      `Authenticated as ${result.email || result.login}`
        + ` (User ID: ${result.userId}, Org: ${result.orgId})`,
    );

    return result;
  },
};
