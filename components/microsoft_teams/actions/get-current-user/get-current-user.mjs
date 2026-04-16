import microsoftTeams from "../../microsoft_teams.app.mjs";

export default {
  key: "microsoft_teams-get-current-user",
  name: "Get Current User",
  description: "Returns the authenticated Microsoft Teams user's ID, display name, email, and principal name via Microsoft Graph. Call this first when the user says 'my channels', 'my chats', or needs identity context. Use the returned `id` to identify the sender in **Send Channel Message** or **Send Chat Message** results. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-get).",
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

    return {
      id: user.id,
      displayName: user.displayName,
      mail: user.mail,
      userPrincipalName: user.userPrincipalName,
    };
  },
};
