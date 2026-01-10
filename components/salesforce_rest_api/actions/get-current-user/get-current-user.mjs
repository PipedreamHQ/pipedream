import salesforce from "../../salesforce_rest_api.app.mjs";

export default {
  key: "salesforce_rest_api-get-current-user",
  name: "Get Current User",
  description: "Retrieve profile information for the authenticated Salesforce user via the OAuth userinfo endpoint. Returns user ID, name, email, and organization ID. [See the documentation](https://help.salesforce.com/s/articleView?id=sf.remoteaccess_using_userinfo_endpoint.htm).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    salesforce,
  },
  async run({ $ }) {
    const user = await this.salesforce.getUserInfo(this.salesforce._authToken());

    const summaryName = user.name || user.email || user.user_id;
    $.export("$summary", `Retrieved user ${summaryName}`);

    return {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      organization_id: user.organization_id,
      username: user.preferred_username,
      nickname: user.nickname,
      profile: user.profile,
      picture: user.picture,
      locale: user.locale,
      zoneinfo: user.zoneinfo,
    };
  },
};
