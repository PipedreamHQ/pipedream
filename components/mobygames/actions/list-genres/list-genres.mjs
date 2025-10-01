import app from "../../mobygames.app.mjs";

export default {
  key: "mobygames-list-genres",
  name: "List Genres",
  description: "Provides a list of genres which may be used for filtering games via the MobyGames API. [See the documentation](https://www.mobygames.com/info/api/#genres)",
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
    const response = await this.app.getGenres({
      $,
    });

    $.export("$summary", "Successfully retrieved genres");

    return response;
  },
};
