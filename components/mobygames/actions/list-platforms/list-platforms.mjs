import app from "../../mobygames.app.mjs";

export default {
  key: "mobygames-list-platforms",
  name: "List Platforms",
  description: "List all platforms available for filtering games via the MobyGames API. [See the documentation](https://www.mobygames.com/info/api/#platforms)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const response = await this.app.getPlatforms({
      $,
    });
    $.export("$summary", "Successfully retrieved genres");
    return response;
  },
};
