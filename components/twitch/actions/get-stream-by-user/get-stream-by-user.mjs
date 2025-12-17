import common from "../common.mjs";

export default {
  ...common,
  name: "Get Stream By User",
  key: "twitch-get-stream-by-user",
  description: "Gets stream information (the stream object) for a specified user",
  version: "0.1.4",
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
      description: "User ID of the user whose stream to get information about",
    },
  },
  async run() {
    // get live streams for the specified streamer
    const streams = await this.paginate(this.twitch.getStreams.bind(this), {
      user_id: this.user,
    });
    return await this.getPaginatedResults(streams);
  },
};
