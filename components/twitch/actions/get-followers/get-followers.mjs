import common from "../common.mjs";

export default {
  ...common,
  name: "Get Followers",
  key: "twitch-get-followers",
  description: "Retrieves a list of users who follow the specified user",
  version: "0.0.2",
  type: "action",
  props: {
    ...common.props,
    user: {
      propDefinition: [
        common.props.twitch,
        "user",
      ],
      description: "User ID of the user to get followers of",
    },
    max: {
      propDefinition: [
        common.props.twitch,
        "max",
      ],
      description: "Maximum number of followers to return",
    },
  },
  async run() {
    const params = {
      to_id: this.user,
    };
    // get the users who follow the specified user
    const follows = await this.paginate(
      this.twitch.getUserFollows.bind(this),
      params,
      this.max,
    );
    return await this.getPaginatedResults(follows);
  },
};
