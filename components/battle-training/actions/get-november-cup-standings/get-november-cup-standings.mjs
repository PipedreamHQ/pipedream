import app from "../../battle-training.app.mjs";

export default {
  key: "battle_training-get-november-cup-standings",
  name: "Get November Cup Standings",
  description: "Get the standings of a battle.training ladder or cup, by default the promotedby.ai November Cup. [See the documentation](https://api.battle.training/llms.txt)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    ladder: {
      propDefinition: [
        app,
        "ladder",
      ],
    },
  },
  async run({ $ }) {
    const {
      standings,
    } = await this.app.getCupStandings({
      $,
      ladder: this.ladder,
    });

    $.export("$summary", `Successfully retrieved ${standings.length} standings from the "${this.ladder}" ladder.`);

    return standings;
  },
};
