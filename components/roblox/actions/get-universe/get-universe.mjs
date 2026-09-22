import app from "../../roblox.app.mjs";

export default {
  key: "roblox-get-universe",
  name: "Get Universe",
  description: "Get information about a Roblox universe (experience) by ID. [See the documentation](https://create.roblox.com/docs/cloud/reference/Universe#Cloud_GetUniverse)",
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
  },
  async run({ $ }) {
    const response = await this.app.getUniverse({
      $,
      universeId: this.universeId,
    });
    $.export("$summary", `Retrieved universe ${response.displayName} (${this.universeId})`);
    return response;
  },
};
