import common from "../../common.mjs";
import constants from "../../common/constants.mjs";

const { discord } = common.props;

export default {
  ...common,
  key: "discord_bot-create-guild-channel",
  name: "Create Guild Channel",
  description: "Create a new channel for the guild. [See the docs here](https://discord.com/developers/docs/resources/guild#create-guild-channel)",
  type: "action",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    name: {
      propDefinition: [
        discord,
        "channelName",
      ],
    },
    type: {
      type: "string",
      label: "Channel type",
      description: "Please select a channel type. In case you want to create a Store channel please read the docs [here](https://discord.com/developers/docs/game-and-server-management/special-channels#store-channels). If you want to create a Stage Voice channel please read the docs [here](https://support.discord.com/hc/en-us/articles/1500005513722#h_01F22AMCVKHQGQB8N3EF30B20C)",
      options: [
        {
          label: "Text",
          value: String(constants.CHANNEL_TYPES.GUILD_TEXT),
        },
        {
          label: "Voice",
          value: String(constants.CHANNEL_TYPES.GUILD_VOICE),
        },
        {
          label: "Category",
          value: String(constants.CHANNEL_TYPES.GUILD_CATEGORY),
        },
        {
          label: "Store",
          value: String(constants.CHANNEL_TYPES.GUILD_STORE),
        },
        {
          label: "Stage Voice",
          value: String(constants.CHANNEL_TYPES.GUILD_STAGE_VOICE),
        },
      ],
    },
    position: {
      propDefinition: [
        discord,
        "channelPosition",
      ],
    },
    topic: {
      propDefinition: [
        discord,
        "channelTopic",
      ],
    },
    nsfw: {
      propDefinition: [
        discord,
        "channelNsfw",
      ],
    },
    bitrate: {
      propDefinition: [
        discord,
        "channelBitrate",
      ],
    },
    rateLimitPerUser: {
      propDefinition: [
        discord,
        "channelRateLimitPerUser",
      ],
    },
    userLimit: {
      propDefinition: [
        discord,
        "channelUserLimit",
      ],
    },
    parentId: {
      propDefinition: [
        discord,
        "channelParentId",
        ({ guildId }) => ({
          guildId,
        }),
      ],
    },
    rolePermissions: {
      propDefinition: [
        discord,
        "channelRolePermissions",
        ({ guildId }) => ({
          guildId,
        }),
      ],
    },
    memberPermissions: {
      propDefinition: [
        discord,
        "channelMemberPermissions",
        ({ guildId }) => ({
          guildId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      guildId,
      name,
      type,
      nsfw,
      topic,
      position,
      bitrate,
      rateLimitPerUser,
      userLimit,
      parentId,
      rolePermissions: rolePermissionStrs = [],
      memberPermissions: memberPermissionStrs = [],
    } = this;

    const permissionOverwrites = [
      ...rolePermissionStrs,
      ...memberPermissionStrs,
    ].map((str) => JSON.parse(str)).filter((p) => !(p.allow?.length === 0));

    const data = {
      name,
      // Pleas take a look at https://github.com/PipedreamHQ/pipedream/issues/1807
      // if we want to avoid this workaround in the future.
      type: +type,
      nsfw,
      topic,
      position,
      bitrate,
      rate_limit_per_user: rateLimitPerUser,
      user_limit: userLimit,
      parent_id: parentId,
      permission_overwrites: permissionOverwrites,
    };

    return this.discord.createChannel({
      $,
      guildId,
      data,
    });
  },
};
