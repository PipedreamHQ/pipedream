import common from "../common.mjs";

export default {
  ...common,
  name: "Get Stream By User",
  key: "twitch-get-stream-by-user",
  description: "Gets stream information for the specified user. [See the documentation](https://dev.twitch.tv/docs/api/reference/#get-streams)",
  version: "0.2.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    user: {
      propDefinition: [
        common.props.twitch,
        "user",
      ],
      label: "Streamer",
      description: "The Twitch streamer whose live stream to retrieve. Accepts a numeric user ID or login name.",
    },
  },
  async run({ $ }) {
    const userId = await this.twitch.resolveUserId(this.user);
    // get live streams for the specified streamer
    const streams = await this.paginate(this.twitch.getStreams.bind(this), {
      user_id: userId,
    });
    const results = await this.getPaginatedResults(streams);
    $.export("$summary", `Retrieved ${results.length} stream(s) for user ${userId}`);
    return results;
  },
};
