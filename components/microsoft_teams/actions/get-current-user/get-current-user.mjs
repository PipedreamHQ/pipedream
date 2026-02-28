import microsoftTeams from "../../microsoft_teams.app.mjs";

export default {
  key: "microsoft_teams-get-current-user",
  name: "Get Current User",
  description: "Retrieve profile information for the authenticated Microsoft Teams user via Microsoft Graph `/me` endpoint. Returns display name, email, and user ID. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-get).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftTeams,
  },
  async run({ $ }) {
    const user = await this.microsoftTeams.client()
      .api("/me")
      .select("id,displayName,mail,userPrincipalName")
      .get();

    const summaryName = user.displayName || user.mail || user.id;
    $.export("$summary", `Retrieved user ${summaryName}`);

    return user;
  },
};
