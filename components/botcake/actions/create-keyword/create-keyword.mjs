import app from "../../botcake.app.mjs";

export default {
  key: "botcake-create-keyword",
  name: "Create Keyword",
  description: "Create a new Keyword. [See the documentation](https://docs.botcake.io/english/api-reference#create-keyword)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
  },

  async run({ $ }) {
    const response = await this.app.createKeyword({
      $,
    });
    $.export("$summary", "Successfully created new Keyword");
    return response;
  },
};
