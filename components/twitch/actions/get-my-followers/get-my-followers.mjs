import common from "../common.mjs";

export default {
  ...common,
  name: "Get My Followers",
  key: "twitch-get-my-followers",
  description: "Retrieves a list of users who follow the authenticated user",
  version: "0.0.3",
  type: "action",
  async run() {
    // get the userID of the authenticated user
    const userId = await this.getUserId();
    const params = {
      to_id: userId,
    };
    // get the users who follow the authenticated user
    const follows = await this.paginate(
      this.twitch.getUserFollows.bind(this),
      params,
    );
    return await this.getPaginatedResults(follows);
  },
};
