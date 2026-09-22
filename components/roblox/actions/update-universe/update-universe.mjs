import app from "../../roblox.app.mjs";
import { parseObject } from "../../common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "roblox-update-universe",
  name: "Update Universe",
  description: "Update settings of a Roblox universe (experience). [See the documentation](https://create.roblox.com/docs/cloud/reference/Universe#Cloud_UpdateUniverse)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    app,
    universeId: {
      propDefinition: [
        app,
        "universeId",
      ],
    },
    voiceChatEnabled: {
      type: "boolean",
      label: "Voice Chat Enabled",
      description: "Whether voice chat is enabled for users in the experience.",
      optional: true,
    },
    privateServerPriceRobux: {
      type: "integer",
      label: "Private Server Price (Robux)",
      description: "The price in Robux of private servers. Set to `0` to make private servers free.",
      optional: true,
    },
    desktopEnabled: {
      type: "boolean",
      label: "Desktop Enabled",
      description: "Whether players can join the experience via Desktop.",
      optional: true,
    },
    mobileEnabled: {
      type: "boolean",
      label: "Mobile Enabled",
      description: "Whether players can join the experience via Mobile.",
      optional: true,
    },
    tabletEnabled: {
      type: "boolean",
      label: "Tablet Enabled",
      description: "Whether players can join the experience via Tablet.",
      optional: true,
    },
    consoleEnabled: {
      type: "boolean",
      label: "Console Enabled",
      description: "Whether players can join the experience via Console.",
      optional: true,
    },
    vrEnabled: {
      type: "boolean",
      label: "VR Enabled",
      description: "Whether players can join the experience via VR.",
      optional: true,
    },
    facebookSocialLink: {
      type: "object",
      label: "Facebook Social Link",
      description: "The experience's Facebook social link, as an object with `title` and `uri`. Example: `{ \"title\": \"Follow us\", \"uri\": \"https://facebook.com/example\" }`.",
      optional: true,
    },
    twitterSocialLink: {
      type: "object",
      label: "Twitter Social Link",
      description: "The experience's Twitter social link, as an object with `title` and `uri`. Example: `{ \"title\": \"Follow us\", \"uri\": \"https://twitter.com/example\" }`.",
      optional: true,
    },
    youtubeSocialLink: {
      type: "object",
      label: "YouTube Social Link",
      description: "The experience's YouTube social link, as an object with `title` and `uri`. Example: `{ \"title\": \"Subscribe\", \"uri\": \"https://youtube.com/@example\" }`.",
      optional: true,
    },
    twitchSocialLink: {
      type: "object",
      label: "Twitch Social Link",
      description: "The experience's Twitch social link, as an object with `title` and `uri`. Example: `{ \"title\": \"Watch live\", \"uri\": \"https://twitch.tv/example\" }`.",
      optional: true,
    },
    discordSocialLink: {
      type: "object",
      label: "Discord Social Link",
      description: "The experience's Discord social link, as an object with `title` and `uri`. Example: `{ \"title\": \"Join our server\", \"uri\": \"https://discord.gg/example\" }`.",
      optional: true,
    },
    robloxGroupSocialLink: {
      type: "object",
      label: "Roblox Group Social Link",
      description: "The experience's Roblox group social link, as an object with `title` and `uri`. Example: `{ \"title\": \"Join our group\", \"uri\": \"https://www.roblox.com/groups/example\" }`.",
      optional: true,
    },
    guildedSocialLink: {
      type: "object",
      label: "Guilded Social Link",
      description: "The experience's Guilded social link, as an object with `title` and `uri`. Example: `{ \"title\": \"Join our guild\", \"uri\": \"https://www.guilded.gg/example\" }`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const fields = {
      voiceChatEnabled: this.voiceChatEnabled,
      privateServerPriceRobux: this.privateServerPriceRobux,
      desktopEnabled: this.desktopEnabled,
      mobileEnabled: this.mobileEnabled,
      tabletEnabled: this.tabletEnabled,
      consoleEnabled: this.consoleEnabled,
      vrEnabled: this.vrEnabled,
      facebookSocialLink: parseObject(this.facebookSocialLink),
      twitterSocialLink: parseObject(this.twitterSocialLink),
      youtubeSocialLink: parseObject(this.youtubeSocialLink),
      twitchSocialLink: parseObject(this.twitchSocialLink),
      discordSocialLink: parseObject(this.discordSocialLink),
      robloxGroupSocialLink: parseObject(this.robloxGroupSocialLink),
      guildedSocialLink: parseObject(this.guildedSocialLink),
    };
    const data = Object.fromEntries(Object.entries(fields).filter(([
      , value,
    ]) => value !== undefined));
    if (!Object.keys(data).length) {
      throw new ConfigurationError("Provide at least one field to update.");
    }
    const response = await this.app.updateUniverse({
      $,
      universeId: this.universeId,
      params: {
        updateMask: Object.keys(data).join(","),
      },
      data,
    });
    $.export("$summary", `Updated universe ${response.displayName ?? this.universeId}`);
    return response;
  },
};
