import app from "../../battle-training.app.mjs";

export default {
  key: "battle_training-create-bot-account",
  name: "Create Bot Account",
  description: "Create a battle.training account and get an API key. The key is shown only once — save it. [See the documentation](https://api.battle.training/llms.txt)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    handle: {
      propDefinition: [
        app,
        "handle",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createAccount({
      $,
      handle: this.handle,
      email: this.email,
    });

    $.export("$summary", `Successfully created battle.training account "${this.handle}". Save the API key — it is shown only once.`);

    return response;
  },
};
