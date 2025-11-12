/* eslint-disable no-unused-vars */
import constants from "../../common/constants.mjs";
import common from "../common.mjs";

const { discord } = common.props;

const {
  GUILD_TEXT,
  GUILD_NEWS,
  ...OTHER_CHANNELS
} = constants.CHANNEL_TYPES;

const NOT_ALLOWED_CHANNELS =
  Object.values(OTHER_CHANNELS);

export default {
  ...common,
  key: "discord_bot-modify-guild-member",
  name: "Modify Guild Member",
  description: "Update attributes of a guild member. [See the docs here](https://discord.com/developers/docs/resources/guild#modify-guild-member)",
  type: "action",
  version: "1.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    userId: {
      propDefinition: [
        discord,
        "userId",
        ({ guildId }) => ({
          guildId,
        }),
      ],
    },
    nick: {
      propDefinition: [
        discord,
        "nick",
      ],
      optional: true,
    },
    roles: {
      propDefinition: [
        discord,
        "roleId",
        ({
          guildId, userId,
        }) => ({
          guildId,
          userId,
          isAddRole: true,
        }),
      ],
      type: "string[]",
      optional: true,
    },
    mute: {
      type: "boolean",
      label: "Mute",
      description: "Whether the user is muted in voice channels. Will throw a 400 error if the user is not in a voice channel",
      optional: true,
    },
    deaf: {
      type: "boolean",
      label: "Deaf",
      description: "Whether the user is deafened in voice channels. Will throw a 400 error if the user is not in a voice channel",
      optional: true,
    },
    channelId: {
      description: "Id of channel to move user to (if they are connected to voice)",
      propDefinition: [
        discord,
        "channelId",
        ({ guildId }) => ({
          guildId,
          notAllowedChannels: NOT_ALLOWED_CHANNELS,
        }),
      ],
      optional: true,
    },
    comunicationDisabledUntil: {
      type: "string",
      label: "Comunication Disabled Until",
      description: "When the user's [timeout](https://support.discord.com/hc/en-us/articles/4413305239191-Time-Out-FAQ) will expire and the user will be able to communicate in the guild again (up to 28 days in the future), set to null to remove timeout. Will throw a 403 error if the user has the ADMINISTRATOR permission or is the owner of the guild. E.g. `2025-01-01T13:28:38+00:00`, `2030-01-01`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      guildId,
      userId,
      nick,
      roles,
      mute,
      deaf,
      channelId,
      comunicationDisabledUntil,
    } = this;

    const response = await this.discord.modifyGuildMember({
      $,
      guildId,
      userId,
      nick,
      roles,
      mute,
      deaf,
      channel_id: channelId,
      communication_disabled_until: comunicationDisabledUntil,
    });

    $.export("$summary", `Member with Id ${userId} successfully modified!`);
    return response;
  },
};
