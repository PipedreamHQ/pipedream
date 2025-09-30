import common from "../common.mjs";

const { discord } = common.props;

export default {
  ...common,
  key: "discord_bot-rename-channel",
  name: "Rename Channel",
  description: "Rename a channel to a specified name you choose",
  type: "action",
  version: "1.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    channelId: {
      propDefinition: common.props.channelId.propDefinition,
      description: "Please select the channel you'd like to change its name",
    },
    name: {
      propDefinition: [
        discord,
        "channelName",
      ],
    },
  },
  async run({ $ }) {
    const { name } =
      await this.discord.renameChannel({
        $,
        channelId: this.channelId,
        name: this.name,
      });
    return name;
  },
};
