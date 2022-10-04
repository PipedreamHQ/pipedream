import common from "../../app/common/common";

export default {
  ...common,
  name: "New Streams By Streamer (Instant)",
  key: "twitch-dev-streams-by-streamer-instant",
  description: "Emit new event when a live stream starts from the streamers you specify.",
  version: "0.0.1",
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
    async getEventConditions() {
      const conditions = [];
      const { data } = await this.twitch.getUsers(this.streamerLoginNames);
      for (const item of data) {
        conditions.push({ "broadcaster_user_id": item.id });
      }

      return conditions;
    },

    getEventType() {
      return "stream.online";
    },

    getMeta(item) {

      const { id, started_at: startedAt, broadcaster_user_name: userName } = item;
      const ts = new Date(startedAt).getTime();
      return {
        id,
        summary: `${userName} is online`,
        ts,
      };
    },
  },

};