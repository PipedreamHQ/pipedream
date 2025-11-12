import constants from "../../common/constants.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "discord_bot-create-channel-invite",
  name: "Create Channel Invite",
  description: "Create a new invite for the channel. [See the docs here](https://discord.com/developers/docs/resources/channel#create-channel-invite)",
  type: "action",
  version: "1.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    maxAge: {
      type: "integer",
      label: "Max age",
      description: "Duration of invite in seconds before expiry 0 for never. between 0 and 604800 (7 days).",
      optional: true,
    },
    maxUses: {
      type: "integer",
      label: "Max number of uses",
      description: "0 for unlimited. between 0 and 100.",
      optional: true,
    },
    temporary: {
      type: "boolean",
      label: "Temporary membership",
      description: "Whether this invite only grants temporary membership",
      optional: true,
    },
    unique: {
      type: "boolean",
      label: "Unique",
      description: "If true, don't try to reuse a similar invite (useful for creating many unique one time use invites)",
      optional: true,
    },
    targetType: {
      type: "integer",
      label: "Target type",
      description: "The type of target for this voice channel invite. [See the docs here](https://discord.com/developers/docs/resources/invite#invite-object-invite-target-types)",
      optional: true,
      options: [
        {
          label: "Stream",
          value: constants.INVITE_TARGET_TYPES.STREAM,
        },
        {
          label: "Embedded Application",
          value: constants.INVITE_TARGET_TYPES.EMBEDDED_APPLICATION,
        },
      ],
    },
    targetUserId: {
      type: "string",
      label: "Target user Id",
      description: "The id of the user whose stream to display for this invite, required if Target type is Stream, the user must be streaming in the channel.",
      optional: true,
    },
    targetApplicationId: {
      type: "string",
      label: "Target application id",
      description: "The id of the embedded application to open for this invite, required if Target type is Embedded Application, the application must have the EMBEDDED flag.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      channelId,
      maxAge,
      maxUses,
      temporary,
      unique,
      targetType,
      targetUserId,
      targetApplicationId,
    } = this;

    const data = {
      max_age: maxAge,
      max_uses: maxUses,
      temporary,
      unique,
      target_type: targetType,
      target_user_id: targetUserId,
      target_application_id: targetApplicationId,
    };

    return this.discord.createChannelInvite({
      $,
      channelId,
      data,
    });
  },
};
