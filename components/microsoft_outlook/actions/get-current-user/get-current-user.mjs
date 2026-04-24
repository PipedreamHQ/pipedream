import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-get-current-user",
  name: "Get Current User",
  description: "Returns the authenticated Microsoft user's ID, display name, email, and principal name via Microsoft Graph. Call this first when the user says 'my emails', 'my inbox', or needs identity context. Use the returned `id` to scope queries in **Find Email** or identify the sender in email results. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-get).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftOutlook,
  },
  async run({ $ }) {
    const user = await this.microsoftOutlook.client()
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
