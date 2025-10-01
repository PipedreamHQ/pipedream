import constants from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";
import common from "../common.mjs";

const { discord } = common.props;
const { emptyStrToUndefined } = utils;

export default {
  ...common,
  key: "discord_bot-list-guild-members",
  name: "List Guild Members",
  description: "Return a list of guild members. [See the docs here](https://discord.com/developers/docs/resources/guild#list-guild-members)",
  type: "action",
  version: "1.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    discord,
    guildId: {
      description: "In order to get members you might want to take a look at these [docs](https://support.discord.com/hc/en-us/articles/360040720412#privileged-intent-whitelisting).",
      propDefinition: [
        discord,
        "guild",
      ],
    },
    max: {
      propDefinition: [
        discord,
        "max",
      ],
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
    const limit = emptyStrToUndefined(this.limit);
    const after = emptyStrToUndefined(this.after);
    const max = emptyStrToUndefined(this.max);

    return this.paginateResources({
      resourceFn: this.discord.getGuildMembers,
      resourceFnArgs: {
        $,
        guildId: this.guildId,
      },
      max,
      limit,
      after,
      paginationKey: constants.PAGINATION_KEY.AFTER,
      mapper: ({ user }) => user,
    });
  },
};
