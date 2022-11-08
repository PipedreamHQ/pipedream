import common from "../common.mjs";

export default {
  ...common,
  key: "discord_bot-new-guild-member",
  name: "New Guild Member",
  description: "Emit new event for every member added to a guild",
  type: "source",
  version: "0.0.4",
  props: {
    ...common.props,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
  },
  methods: {
    ...common.methods,
  },
  async run({ $ }) {
    const guildMembers = this._getGuildMemberIDs();
    const { guildId } = this;
    const params = {
      limit: 100,
    };
    let anyNewMember = false;

    while (true) {
      const members = await this.discord.getGuildMembers({
        $,
        guildId,
        params,
      });

      if (members.length === 1) {
        if (anyNewMember) {
          this._setGuildMemberIDs(guildMembers);
        }
        return;
      }

      for (const member of members) {
        const {
          user,
          joined_at: joinedAt,
        } = member;

        if (user.bot) continue;

        if (!(user.id in guildMembers)) {
          anyNewMember = true;
          guildMembers[user.id] = true;
          this.$emit(member, {
            summary: `New member: ${user.username}`,
            id: user.id,
            ts: Date.parse(joinedAt),
          });
        }

        params.after = user.id;
      }
    }
  },
};
