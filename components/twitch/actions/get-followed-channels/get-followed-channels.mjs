import common from "../common.mjs";

export default {
  ...common,
  name: "Get Followed Channels",
  key: "twitch-get-followed-channels",
  description: "Retrieves a list of channels that the authenticated user follows. [See the documentation](https://dev.twitch.tv/docs/api/reference/#get-followed-channels)",
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
      user_id: userId,
    };
    // get the user_ids of the streamers followed by the authenticated user
    const follows = await this.paginate(
      this.twitch.getFollowedChannels.bind(this),
      params,
    );
    return await this.getPaginatedResults(follows);
  },
};
