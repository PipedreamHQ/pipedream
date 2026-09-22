import app from "../../roblox.app.mjs";

export default {
  key: "roblox-get-place",
  name: "Get Place",
  description: "Get information about a place within a Roblox universe. [See the documentation](https://create.roblox.com/docs/cloud/reference/Place#Cloud_GetPlace)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const response = await this.app.getPlace({
      $,
      universeId: this.universeId,
      placeId: this.placeId,
    });
    $.export("$summary", `Retrieved place ${response.displayName ?? this.placeId}`);
    return response;
  },
};
