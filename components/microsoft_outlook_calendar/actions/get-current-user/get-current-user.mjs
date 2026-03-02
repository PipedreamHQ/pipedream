import microsoftOutlookCalendar from "../../microsoft_outlook_calendar.app.mjs";

export default {
  key: "microsoft_outlook_calendar-get-current-user",
  name: "Get Current User",
  description: "Retrieve profile information for the authenticated Microsoft user via Microsoft Graph `/me` endpoint. Returns display name, email, and user ID. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-get).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftOutlookCalendar,
  },
  async run({ $ }) {
    const user = await this.microsoftOutlookCalendar._makeRequest({
      $,
      path: "/me",
      params: {
        $select: "id,displayName,mail,userPrincipalName",
      },
    });

    const summaryName = user.displayName || user.mail || user.id;
    $.export("$summary", `Retrieved user ${summaryName}`);

    return user;
  },
};
