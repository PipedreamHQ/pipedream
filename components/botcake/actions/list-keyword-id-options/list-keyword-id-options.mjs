import botcake from "../../botcake.app.mjs";

export default {
  key: "botcake-list-keyword-id-options",
  name: "List Keyword ID Options",
  description: "Retrieves available options for the Keyword ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    botcake,
  },
  async run({ $ }) {
    const options = await botcake.propDefinitions.keywordId.options.call(this.botcake, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
