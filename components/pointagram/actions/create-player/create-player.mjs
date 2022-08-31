import app from "../../pointagram.app.mjs";

export default {
  type: "action",
  key: "pointagram_create-player",
  name: "Create Player",
  description: "Create a new player. [See the docs here](https://www.pointagram.com/custom-integration-gamification/)",
  version: "0.0.1",
  props: {
    app,
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    externalId: {
      propDefinition: [
        app,
        "externalId",
      ],
    },
    offline: {
      propDefinition: [
        app,
        "offline",
      ],
    },
  },
  async run({ $ }) {
    const res = await this.app.createPlayer({
      player_name: this.name,
      player_email: this.email,
      player_external_id: this.externalId,
      offline: this.offline,
    }, $);
    $.export("$summary", "Player successfully created");
    return res;
  },
};
