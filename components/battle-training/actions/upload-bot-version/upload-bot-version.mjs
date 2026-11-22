import app from "../../battle-training.app.mjs";

export default {
  key: "battle_training-upload-bot-version",
  name: "Upload Bot Version",
  description: "Upload a new controller version for a bot. The upload runs a 400-tick smoke test and, if it passes, the version becomes the active ranked controller. [See the documentation](https://api.battle.training/llms.txt)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
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
    label: {
      propDefinition: [
        app,
        "label",
      ],
    },
    source: {
      propDefinition: [
        app,
        "source",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.uploadBotVersion({
      $,
      bot: this.bot,
      label: this.label,
      source: this.source,
    });

    $.export("$summary", `Successfully uploaded version "${this.label}" for bot "${this.bot}".`);

    return response;
  },
};
