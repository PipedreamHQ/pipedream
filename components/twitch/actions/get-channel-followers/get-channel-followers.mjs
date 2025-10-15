import common from "../common.mjs";

export default {
  ...common,
  name: "Get Channel Followers",
  key: "twitch-get-channel-followers",
  description: "Retrieves a list of users who follow the authenticated user. [See the documentation](https://dev.twitch.tv/docs/api/reference/#get-channel-followers)",
  version: "0.0.2",
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
    // get the users who follow the authenticated user
    const follows = await this.paginate(
      this.twitch.getUserFollows.bind(this),
      params,
    );
    return await this.getPaginatedResults(follows);
  },
};
