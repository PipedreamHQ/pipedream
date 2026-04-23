import microsoftOutlookCalendar from "../../microsoft_outlook_calendar.app.mjs";

export default {
  key: "microsoft_outlook_calendar-get-current-user",
  name: "Get Current User",
  description: "Returns the authenticated Microsoft user's ID, display name, email, and principal name via Microsoft Graph. Call this first when the user says 'my calendar', 'my events', or needs to identify themselves as organizer/attendee. Use `id` or `mail` to filter results from **List Events** or set the organizer in **Create Calendar Event**. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-get).",
  version: "0.0.2",
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
    const user = await this.microsoftOutlookCalendar.client()
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
