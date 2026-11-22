import app from "../../battle-training.app.mjs";

export default {
  key: "battle_training-get-ladder-standings",
  name: "Get Ladder Standings",
  description: "Get the public battle.training ladder standings. [See the documentation](https://api.battle.training/llms.txt)",
  version: "0.0.1",
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
    const {
      entries,
    } = await this.app.getLadder({
      $,
    });

    $.export("$summary", `Successfully retrieved ${entries.length} ladder entries.`);

    return entries;
  },
};
