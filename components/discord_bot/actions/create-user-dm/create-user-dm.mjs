import common from "../../common.mjs";
import messageCommon from "../send-message-common.mjs";
import utils from "../../common/utils.mjs";

const { discord } = common.props;

export default {
  key: "discord_bot-create-dm",
  name: "Create DM",
  description: "Create a new DM channel with a user. [See the docs here](https://discord.com/developers/docs/resources/user#create-dm) and [here](https://discord.com/developers/docs/resources/channel#create-message)",
  version: "0.0.26",
  type: "action",
  ...messageCommon,
  props: {
    discord,
    ...common.props,
    ...messageCommon.props,
    userId: {
      propDefinition: [
        discord,
        "userId",
        ({ guildId }) => ({
          guildId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const createDMChannelResponse = await this.discord.createDm({
      $,
      recipientId: this.userId,
    });
    if (createDMChannelResponse.id) {
      const createMessageResponse = await this.discord.createMessage({
        $,
        channelId: createDMChannelResponse.id,
        data: {
          embeds: utils.parseObject(this.embeds),
          avatarURL: this.avatarURL,
          threadID: this.threadID,
          username: this.username,
          content: this.includeSentViaPipedream
            ? this.appendPipedreamText(this.message)
            : this.message,
        },
      });
      $.export("$summary", "Message has been sent successfully");
      return createMessageResponse;
    } else {
      $.export("$summary", "Could not create or retrieve DM channel!");
      throw new Error("Create DM Channel call was not successful!");
    }
  },
};
