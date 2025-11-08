import common from "../common-polling.mjs";

export default {
  ...common,
  name: "New Streams By Streamer",
  key: "twitch-streams-by-streamer",
  description: "Emit new event when a live stream starts from the streamers you specify.",
  version: "0.1.3",
  type: "source",
  props: {
    ...common.props,
    streamerLoginNames: {
      propDefinition: [
        common.props.twitch,
        "streamerLoginNames",
      ],
    },
  },
  methods: {
    ...common.methods,
    getMeta(item) {
      const {
        id,
        started_at: startedAt,
        title: summary,
      } = item;
      const ts = Date.parse(startedAt);
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run() {
    // get and emit streams for the specified streamers
    const streams = await this.paginate(this.twitch.getStreams.bind(this), {
      user_login: this.streamerLoginNames,
    });
    for await (const stream of streams) {
      this.$emit(stream, this.getMeta(stream));
    }
  },
};
