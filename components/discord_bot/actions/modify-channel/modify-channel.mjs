import constants from "../../common/constants.mjs";
import common from "../common.mjs";

const { discord } = common.props;

const {
  GUILD_TEXT,
  GUILD_NEWS,
  ...OTHER_CHANNELS
} = constants.CHANNEL_TYPES;

const NOT_ALLOWED_CHANNELS =
  Object.keys(OTHER_CHANNELS).map((key) => OTHER_CHANNELS[key]);

export default {
  ...common,
  key: "discord_bot-modify-channel",
  name: "Modify Channel",
  description: "Update a channel's settings. [See the docs here](https://discord.com/developers/docs/resources/channel#modify-channel)",
  type: "action",
  version: "1.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    channelId: {
      description: "Please select the channel you'd like to change its name",
      propDefinition: [
        discord,
        "channelId",
        ({ guildId }) => ({
          guildId,
          notAllowedChannels: NOT_ALLOWED_CHANNELS,
        }),
      ],
    },
    name: {
      propDefinition: [
        discord,
        "channelName",
      ],
    },
    icon: {
      type: "string",
      label: "Icon",
      description: "base64 encoded icon.",
      optional: true,
    },
    type: {
      type: "string",
      label: "Channel type",
      description: "Only conversion between text and news is supported and only in guilds with the 'NEWS' feature. [See the channel types here](https://discord.com/developers/docs/resources/channel#channel-object-channel-types).",
      optional: true,
      async options() {
        const channelTypes = {
          TEXT: {
            label: "Text",
            value: GUILD_TEXT,
          },
          NEWS: {
            label: "News",
            value: GUILD_NEWS,
          },
        };

        const guild =
          await this.discord.getGuild({
            guildId: this.guildId,
          });

        const hasNewsFeature = guild?.features.includes("NEWS");

        return hasNewsFeature
          ? [
            channelTypes.TEXT,
            channelTypes.NEWS,
          ]
          : [
            channelTypes.TEXT,
          ];
      },
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
    rtcRegion: {
      type: "string",
      label: "Channel voice region",
      description: "Channel [voice region](https://discord.com/developers/docs/resources/voice#voice-region-object) id, automatic when set to null.",
      optional: true,
    },
    videoQualityMode: {
      type: "integer",
      label: "Video quality mode",
      description: "The camera [video quality mode](https://discord.com/developers/docs/resources/channel#channel-object-video-quality-modes) of the voice channel.",
      optional: true,
      options() {
        return [
          {
            label: "Auto",
            value: constants.VIDEO_QUALITY_MODES.AUTO,
          },
          {
            label: "Full",
            value: constants.VIDEO_QUALITY_MODES.FULL,
          },
        ];
      },
    },
    defaultAutoArchiveDuration: {
      type: "integer",
      label: "Auto archive duration in minutes",
      description: "The default duration for newly created threads in the channel, in minutes, to automatically archive the thread after recent activity.",
      optional: true,
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
      channelId,
      name,
      icon,
      type,
      topic,
      nsfw,
      rtcRegion,
      position,
      bitrate,
      rateLimitPerUser,
      userLimit,
      videoQualityMode,
      defaultAutoArchiveDuration,
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
      type,
      icon,
      nsfw,
      topic,
      position,
      bitrate,
      rtc_region: rtcRegion,
      rate_limit_per_user: rateLimitPerUser,
      user_limit: userLimit,
      video_quality_mode: videoQualityMode,
      default_auto_archive_duration: defaultAutoArchiveDuration,
      parent_id: parentId,
      permission_overwrites: permissionOverwrites,
    };

    return this.discord.modifyChannel({
      $,
      channelId,
      data,
    });
  },
};
