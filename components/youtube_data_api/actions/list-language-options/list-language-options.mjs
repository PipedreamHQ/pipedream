import youtubeDataApi from "../../youtube_data_api.app.mjs";

export default {
  key: "youtube_data_api-list-language-options",
  name: "List Language Options",
  description: "Retrieves available language options for the Language (hl) field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    youtubeDataApi,
  },
  async run({ $ }) {
    const options = await youtubeDataApi.propDefinitions.hl.options.call(this.youtubeDataApi);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
