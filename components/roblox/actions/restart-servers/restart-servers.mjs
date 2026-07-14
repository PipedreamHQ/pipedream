import { ConfigurationError } from "@pipedream/platform";
import app from "../../roblox.app.mjs";

export default {
  key: "roblox-restart-servers",
  name: "Restart Servers",
  description: "Restart all running servers of a Roblox universe, typically to deploy a new place version without disrupting active players. [See the documentation](https://create.roblox.com/docs/cloud/reference/Universe#Cloud_RestartUniverseServers)",
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
    placeIds: {
      type: "string[]",
      label: "Place IDs",
      description: "The place IDs to restart. If none are specified, all active places in the universe are restarted.",
      optional: true,
    },
    closeAllVersions: {
      type: "boolean",
      label: "Close All Versions",
      description: "If `true`, players from servers running both old and new place versions are notified to reconnect. If `false`, only players on old versions are notified.",
      optional: true,
    },
    bleedOffServers: {
      type: "boolean",
      label: "Bleed Off Servers",
      description: "If `true`, matchmaking to old servers stops but they stay up for a period so existing players can finish their session.",
      optional: true,
    },
    bleedOffDurationMinutes: {
      type: "integer",
      label: "Bleed Off Duration (Minutes)",
      description: "If **Bleed Off Servers** is `true`, how long (in minutes) old servers are allowed to run before shutting down.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.bleedOffServers && this.bleedOffDurationMinutes === undefined) {
      throw new ConfigurationError("**Bleed Off Duration (Minutes)** is required if **Bleed Off Servers** is `true`.");
    }

    const response = await this.app.restartUniverseServers({
      $,
      universeId: this.universeId,
      data: {
        placeIds: this.placeIds,
        closeAllVersions: this.closeAllVersions,
        bleedOffServers: this.bleedOffServers,
        bleedOffDurationMinutes: this.bleedOffDurationMinutes,
      },
    });
    $.export("$summary", `Requested server restart for universe ${this.universeId}`);
    return response;
  },
};
