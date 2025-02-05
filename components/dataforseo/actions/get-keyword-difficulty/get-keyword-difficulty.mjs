import app from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-get-keyword-difficulty",
  name: "Get Keyword Difficulty",
  description: "Get Keyword Difficulty. [See the documentation](https://docs.dataforseo.com/v3/dataforseo_labs/google/bulk_keyword_difficulty/live/?bash)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    languageCode: {
      propDefinition: [
        app,
        "languageCode",
      ],
    },
    locationCode: {
      propDefinition: [
        app,
        "locationCode",
      ],
    },
    keywords: {
      propDefinition: [
        app,
        "keywords",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getKeywordDifficulty({
      $,
      data: [
        {
          language_code: this.languageCode,
          location_code: this.locationCode,
          keywords: this.keywords,
        },
      ],
    });
    $.export("$summary", `Successfully sent the request. Status: ${response.tasks[0].status_message}`);
    return response;
  },
};
