import common from "../common.mjs";

export default {
  ...common,
  name: "Get Followed Channels",
  key: "twitch-get-followed-channels",
  description: "Retrieves a list of channels that the authenticated user follows",
  version: "0.0.3",
  type: "action",
  async run() {
    // get the userID of the authenticated user
    const userId = await this.getUserId();
    const params = {
      from_id: userId,
    };
    // get the user_ids of the streamers followed by the authenticated user
    const follows = await this.paginate(
      this.twitch.getUserFollows.bind(this),
      params,
    );
    return await this.getPaginatedResults(follows);
  },
};
