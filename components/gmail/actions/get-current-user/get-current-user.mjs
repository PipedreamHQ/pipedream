import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-get-current-user",
  name: "Get Current User",
  description: "Retrieve profile information for the authenticated Gmail user. Returns the user's name, email address, and Gmail profile info. [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users/getProfile).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    gmail,
  },
  async run({ $ }) {
    const [
      userInfo,
      profile,
    ] = await Promise.all([
      this.gmail.userInfo(),
      this.gmail.getProfile(),
    ]);

    const summaryName = userInfo.name || userInfo.email || profile.emailAddress;
    $.export("$summary", `Retrieved user ${summaryName}`);

    return {
      name: userInfo.name,
      email: userInfo.email,
      emailAddress: profile.emailAddress,
      messagesTotal: profile.messagesTotal,
      threadsTotal: profile.threadsTotal,
      historyId: profile.historyId,
    };
  },
};
