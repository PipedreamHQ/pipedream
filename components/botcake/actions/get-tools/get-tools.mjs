import app from "../../botcake.app.mjs";

export default {
  key: "botcake-get-tools",
  name: "Get Tools",
  description: "Get a list of tools associated with the specified page. [See the documentation](https://docs.botcake.io/english/api-reference#get-tools)",
  version: "0.0.2",
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
    const response = await this.app.getTools({
      $,
    });
    $.export("$summary", `Successfully retrieved ${response.data.length} tools`);
    return response;
  },
};
