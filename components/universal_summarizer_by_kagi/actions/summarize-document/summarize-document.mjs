import app from "../../universal_summarizer_by_kagi.app.mjs";

export default {
  key: "universal_summarizer_by_kagi-summarize-document",
  name: "Summarize Document",
  description: "Summarizes the content of a URL. [See the documentation](https://help.kagi.com/kagi/api/summarizer.html#summarize-document)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
    engine: {
      propDefinition: [
        app,
        "engine",
      ],
    },
    summaryType: {
      propDefinition: [
        app,
        "summaryType",
      ],
    },
    targetLanguage: {
      propDefinition: [
        app,
        "targetLanguage",
      ],
    },
    cache: {
      propDefinition: [
        app,
        "cache",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.summarizeDocument({
      $,
      params: {
        url: this.url,
        engine: this.engine,
        summary_type: this.summaryType,
        target_language: this.targetLanguage,
        cache: this.cache,
      },
    });
    $.export("$summary", "Successfully summarized the content of the URL");
    return response;
  },
};
