import app from "../../live_tennis_api.app.mjs";

export default {
  key: "live_tennis_api-get-player",
  name: "Get Player",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Get one player's bio, current ranking and cached stats by player id. [See the documentation](https://docs.livetennisapi.com/reference.html)",
  type: "action",
  props: {
    app,
    playerId: {
      propDefinition: [
        app,
        "playerId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app, playerId,
    } = this;

    const response = await app.getPlayer({
      $,
      playerId,
    });

    $.export("$summary", `Retrieved player ${response?.name ?? playerId}`);
    return response;
  },
};
