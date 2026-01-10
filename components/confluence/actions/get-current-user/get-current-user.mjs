import { axios } from "@pipedream/platform";
import confluence from "../../confluence.app.mjs";

export default {
  key: "confluence-get-current-user",
  name: "Get Current User",
  description: "Retrieve profile information for the authenticated Confluence user. Returns account ID, display name, and email. [See the documentation](https://developer.atlassian.com/cloud/confluence/rest/v1/api-group-users/#api-wiki-rest-api-user-current-get).",
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

    const user = await axios($, {
      url: `https://api.atlassian.com/ex/confluence/${cloudId}/wiki/rest/api/user/current`,
      headers: {
        Authorization: `Bearer ${this.confluence.$auth.oauth_access_token}`,
      },
    });

    const summaryName = user.displayName || user.email || user.accountId;
    $.export("$summary", `Retrieved user ${summaryName}`);

    return {
      accountId: user.accountId,
      displayName: user.displayName,
      email: user.email,
      accountType: user.accountType,
      profilePicture: user.profilePicture,
    };
  },
};
