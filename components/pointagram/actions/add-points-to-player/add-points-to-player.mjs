import app from "../../pointagram.app.mjs";

export default {
  type: "action",
  key: "pointagram-add-points-to-player",
  name: "Add Points to Player",
  description: "Add points to a player. [See the docs here](https://www.pointagram.com/custom-integration-gamification/)",
  version: "0.0.1",
  props: {
    app,
    playerId: {
      propDefinition: [
        app,
        "playerId",
      ],
    },
    scoreSeriesId: {
      propDefinition: [
        app,
        "scoreSeriesId",
      ],
    },
    points: {
      type: "integer",
      label: "Points",
      description: "The number of points to add to the player",
    },
  },
  async run({ $ }) {
    const res = await this.app.addPointsToPlayer({
      player_id: this.playerId,
      points: this.points,
      scoreseries_id: this.scoreSeriesId,
    }, $);
    $.export("$summary", "Points successfully added");
    return res;
  },
};
