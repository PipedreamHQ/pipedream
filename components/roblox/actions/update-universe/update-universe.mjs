import app from "../../roblox.app.mjs";
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
