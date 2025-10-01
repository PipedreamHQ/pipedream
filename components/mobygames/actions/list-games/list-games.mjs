import app from "../../mobygames.app.mjs";

export default {
  key: "mobygames-list-games",
  name: "List Games",
  description: "Provides a list of games. [See the documentation](https://www.mobygames.com/info/api/#games)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    platform: {
      propDefinition: [
        app,
        "platform",
      ],
    },
    genre: {
      propDefinition: [
        app,
        "genre",
      ],
    },
    title: {
      propDefinition: [
        app,
        "title",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getGames({
      $,
      params: {
        platform: this.platform,
        genre: this.genre,
        title: this.title,
      },
    });

    $.export("$summary", "Successfully retrieved the list of games");

    return response;
  },
};
