import news_api from "../../news_api.app.mjs";

export default {
  key: "news_api-list-source-ids-options",
  name: "List Source IDs Options",
  description: "Retrieves available options for the Source IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    news_api,
  },
  async run({ $ }) {
    const options = await news_api.propDefinitions.sourceIds.options.call(this.news_api);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
