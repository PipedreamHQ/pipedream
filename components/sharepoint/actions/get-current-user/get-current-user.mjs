import sharepoint from "../../sharepoint.app.mjs";

export default {
  key: "sharepoint-get-current-user",
  name: "Get Current User",
  description: "Returns the authenticated Microsoft user's ID, display name, email, and principal name via Microsoft Graph. Call this first when the user says 'my files', 'my documents', or needs identity context. Use the returned `id` to identify file ownership in **List Files in Folder** or **Find File by Name** results. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-get).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sharepoint,
  },
  async run({ $ }) {
    const user = await this.sharepoint.client()
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
