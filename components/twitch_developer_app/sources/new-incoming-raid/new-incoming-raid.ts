import { defineSource } from "@pipedream/types";
import common from "../../common/common";
import { RaidEvent } from "../../common/types";

export default defineSource({
  ...common,
  name: "New Incoming Raid (Instant)",
  key: "twitch_developer_app-new-incoming-raid",
  description: "Emit new event when a specific broadcaster is raided by another broadcaster.",
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
            "to_broadcaster_user_id": item.id,
          });
        }
      }

      return conditions;
    },

    getEventType() {
      return "channel.raid";
    },

    getMeta(item: RaidEvent) {
      const {
        id,
        created_at: createdAt,
        from_broadcaster_user_name: userNameFrom,
        from_broadcaster_user_login: loginFrom,
        to_broadcaster_user_name: userNameTo,
        to_broadcaster_user_login: loginTo,
      } = item;
      const ts = new Date(createdAt).getTime();
      return {
        id,
        summary: `${userNameTo} (${loginTo}) was raided by ${userNameFrom} (${loginFrom})`,
        ts,
      };
    },
  },

});
