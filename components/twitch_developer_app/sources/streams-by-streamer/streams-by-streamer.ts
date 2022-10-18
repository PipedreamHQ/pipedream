import common from "../../common/common";
import { defineSource } from "@pipedream/types";
import { RawEvent } from "../../common/types";

export default defineSource({
  ...common,
  name: "New Streams By Streamer (Instant)",
  key: "twitch_developer_app-streams-by-streamer",
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
        if (item.id != undefined) {
          conditions.push({
            "broadcaster_user_id": item.id,
          });
        }
      }

      return conditions;
    },

    getEventType() {
      return "stream.online";
    },

    getMeta(item: RawEvent) {
      const {
        id,
        started_at: startedAt,
        broadcaster_user_name: userName,
      } = item;
      const ts = new Date(startedAt).getTime();
      return {
        id,
        summary: `${userName} is online`,
        ts,
      };
    },
  },

});
