import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import common from "../common/common.mjs";

export default {
  ...common,
  key: "discord_bot-new-guild-member",
  name: "New Guild Member",
  description: "Emit new event for every member added to a guild. [See docs here](https://discord.com/developers/docs/resources/guild#list-guild-members)",
  type: "source",
  dedupe: "unique",
  version: "1.0.1",
  props: {
    ...common.props,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  async run({ $ }) {
    const { guildId } = this;
    const params = {
      limit: 100,
      after: this._getLastMemberID(),
    };

    while (true) {
      const members = await this.discord.getGuildMembers({
        $,
        guildId,
        params,
      });

      if (members.length === 0) {
        return;
      }

      for (const member of members) {
        const {
          user,
          joined_at: joinedAt,
        } = member;

        params.after = user.id;
        if (user.bot) continue;

        this.$emit(member, {
          summary: `New member: ${user.username}`,
          id: user.id,
          ts: Date.parse(joinedAt),
        });
      }

      this._setLastMemberID(params.after);
    }
  },
};
