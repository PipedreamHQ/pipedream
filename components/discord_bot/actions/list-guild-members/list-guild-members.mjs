import common from "../../common.mjs";

const { discord } = common.props;

export default {
  ...common,
  key: "discord_bot-list-guild-members",
  name: "List Guild Members",
  description: "Return a list of guild members. [See the docs here](https://discord.com/developers/docs/resources/guild#list-guild-members)",
  type: "action",
  version: "0.0.1",
  props: {
    ...common.props,
    guildId: {
      ...common.props.guildId,
      description: "In order to get members you migth want to take a look at these [docs](https://support.discord.com/hc/en-us/articles/360040720412#privileged-intent-whitelisting).",
    },
    limit: {
      propDefinition: [
        discord,
        "limit",
      ],
    },
    after: {
      propDefinition: [
        discord,
        "after",
      ],
    },
  },
  async run({ $ }) {
    return await this.discord.getGuildMembers({
      $,
      guildId: this.guildId,
      limit: this.limit,
      after: this.after,
    });
  },
};
