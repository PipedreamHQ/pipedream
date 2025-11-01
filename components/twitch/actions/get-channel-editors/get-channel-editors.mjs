import common from "../common.mjs";

export default {
  ...common,
  name: "Get Channel Editors",
  key: "twitch-get-channel-editors",
  description: "Gets a list of users who are editors for your channel",
  version: "0.1.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  async run() {
    // get the userID of the authenticated user
    const userId = await this.getUserId();
    const params = {
      broadcaster_id: userId,
    };
    return (await this.twitch.getChannelEditors(params)).data.data;
  },
};
