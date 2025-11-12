import common from "../../common.mjs";

export default {
  ...common,
  key: "discord_bot-find-user",
  name: "Find User",
  description: "Find an existing user by name. [See the docs here](https://discord.com/developers/docs/resources/guild#search-guild-members)",
  type: "action",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ...common.props,
    query: {
      type: "string",
      label: "Query",
      description: "Query string to match username(s) and nickname(s) against.",
    },
  },
  async run({ $ }) {
    const [
      userFound,
    ] = await this.discord.searchUsers({
      $,
      guildId: this.guildId,
      query: this.query,
      limit: 1,
    });

    if (!userFound) {
      throw new Error("User not found");
    }

    return userFound;
  },
};
