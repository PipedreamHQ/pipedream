import app from "../../roblox.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "roblox-update-place",
  name: "Update Place",
  description: "Update the name, description, or server size of a place within a Roblox universe. [See the documentation](https://create.roblox.com/docs/cloud/reference/Place#Cloud_UpdatePlace)",
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
    placeId: {
      propDefinition: [
        app,
        "placeId",
      ],
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The new name of the place.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The new description of the place.",
      optional: true,
    },
    serverSize: {
      type: "integer",
      label: "Server Size",
      description: "The maximum number of allowed users in a single server.",
      optional: true,
    },
  },
  async run({ $ }) {
    const fields = {
      displayName: this.displayName,
      description: this.description,
      serverSize: this.serverSize,
    };
    const data = Object.fromEntries(Object.entries(fields).filter(([
      , value,
    ]) => value !== undefined));
    if (!Object.keys(data).length) {
      throw new ConfigurationError("Provide at least one field to update.");
    }
    const response = await this.app.updatePlace({
      $,
      universeId: this.universeId,
      placeId: this.placeId,
      params: {
        updateMask: Object.keys(data).join(","),
      },
      data,
    });
    $.export("$summary", `Updated place ${response.displayName ?? this.placeId}`);
    return response;
  },
};
