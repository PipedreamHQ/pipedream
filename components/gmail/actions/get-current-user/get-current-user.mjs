import gmail from "../../gmail.app.mjs";

export default {
  key: "gmail-get-current-user",
  name: "Get Current User",
  description: "Returns the authenticated Gmail user's name, email address, and mailbox stats (total messages and threads). Call this first when the user says 'my emails', 'my inbox', or needs identity context. Use the returned `emailAddress` to identify the user's own messages in **Find Emails** results. [See the documentation](https://developers.google.com/gmail/api/reference/rest/v1/users/getProfile).",
  version: "0.0.2",
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
      emailAddress: profile.emailAddress,
      messagesTotal: profile.messagesTotal,
      threadsTotal: profile.threadsTotal,
    };
  },
};
