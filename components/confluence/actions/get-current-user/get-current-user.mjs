import confluence from "../../confluence.app.mjs";

export default {
  key: "confluence-get-current-user",
  name: "Get Current User",
  description: "Returns the authenticated Confluence user's account ID, display name, email, and cloud ID. Call this first when the user says 'my pages', 'my posts', or needs to scope queries to themselves. Use the returned `accountId` to filter results from **Search Content** or **Get Pages**. [See the documentation](https://developer.atlassian.com/cloud/confluence/rest/v1/api-group-users/#api-wiki-rest-api-user-current-get).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    confluence,
  },
  async run({ $ }) {
    const cloudId = await this.confluence.getCloudId({
      $,
    });

    const user = await this.confluence._makeRequest({
      $,
      url: `https://api.atlassian.com/ex/confluence/${cloudId}/wiki/rest/api/user/current`,
    });

    const summaryName = user.displayName || user.email || user.accountId;
    $.export("$summary", `Retrieved user ${summaryName}`);

    return {
      cloudId,
      accountId: user.accountId,
      displayName: user.displayName,
      email: user.email,
      accountType: user.accountType,
      profilePicture: user.profilePicture,
    };
  },
};
