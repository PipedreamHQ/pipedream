import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-get-user-info",
  name: "Get User Info",
  description:
    "Get the current authenticated Salesforce user's identity, including user ID, email, org ID, and instance URL."
    + " **Must be called before any query that uses first-person language ('my', 'I', 'me').**"
    + " The `userId` can be used as an `OwnerId` filter in SOQL queries (e.g. `WHERE OwnerId = '{userId}'`)."
    + " The `instanceUrl` is needed to construct clickable links to Salesforce records:"
    + " `{instanceUrl}/lightning/r/{objectType}/{recordId}/view`.",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: false,
  },
  props: {
    salesforce,
  },
  async run({ $ }) {
    const userInfo = await this.salesforce.getUserInfo(
      this.salesforce._authToken(),
    );

    const result = {
      userId: userInfo.user_id,
      userName: userInfo.preferred_username || userInfo.email,
      userEmail: userInfo.email,
      displayName: userInfo.name,
      orgId: userInfo.organization_id,
      instanceUrl: this.salesforce._baseApiUrl(),
    };

    $.export(
      "$summary",
      `Authenticated as ${result.userEmail} (User ID: ${result.userId}, Org: ${result.orgId})`,
    );

    return result;
  },
};
