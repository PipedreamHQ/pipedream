import app from "../../botcake.app.mjs";

export default {
  key: "botcake-update-keyword",
  name: "Update Keyword",
  description: "Update the Keyword with the specified ID. [See the documentation](https://docs.botcake.io/english/api-reference#update-keyword)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    keywordId: {
      propDefinition: [
        app,
        "keywordId",
      ],
    },
    flowId: {
      propDefinition: [
        app,
        "flowId",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.updateKeyword({
      $,
      data: {
        keyword_id: this.keywordId,
        update: {
          flow_id: this.flowId,
        },
      },
    });
    $.export("$summary", `Successfully updated Keyword with ID: '${this.keywordId}'`);
    return response;
  },
};
