import app from "../../battle-training.app.mjs";

export default {
  key: "battle_training-list-recent-matches",
  name: "List Recent Matches",
  description: "List recent matches for a bot. [See the documentation](https://api.battle.training/llms.txt)",
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
    bot: {
      propDefinition: [
        app,
        "bot",
      ],
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const {
      matches,
    } = await this.app.listMatches({
      $,
      bot: this.bot,
      limit: this.limit,
    });

    $.export("$summary", `Successfully retrieved ${matches.length} recent matches for bot "${this.bot}".`);

    return matches;
  },
};
