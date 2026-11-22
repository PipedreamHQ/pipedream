import app from "../../battle-training.app.mjs";

export default {
  key: "battle_training-list-my-bots",
  name: "List My Bots",
  description: "List the bots on your battle.training account. [See the documentation](https://api.battle.training/llms.txt)",
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
      bots,
    } = await this.app.getMyBots({
      $,
    });

    $.export("$summary", `Successfully retrieved ${bots.length} bots.`);

    return bots;
  },
};
