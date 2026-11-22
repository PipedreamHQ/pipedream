import app from "../../battle-training.app.mjs";

export default {
  key: "battle_training-list-ladders",
  name: "List Ladders",
  description: "List the battle.training ladders and sponsored cups with their slugs. [See the documentation](https://api.battle.training/llms.txt)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
  },
  async run({ $ }) {
    const {
      ladders,
    } = await this.app.listLadders({
      $,
    });

    $.export("$summary", `Successfully retrieved ${ladders.length} ladders.`);

    return ladders;
  },
};
