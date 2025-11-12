import dataforseo from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-get-keyword-difficulty",
  name: "Get Keyword Difficulty",
  description: "Get Keyword Difficulty. [See the documentation](https://docs.dataforseo.com/v3/dataforseo_labs/google/bulk_keyword_difficulty/live/?bash)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dataforseo,
    languageCode: {
      propDefinition: [
        dataforseo,
        "languageCode",
      ],
    },
    locationCode: {
      propDefinition: [
        dataforseo,
        "locationCode",
      ],
    },
    keywords: {
      propDefinition: [
        dataforseo,
        "keywords",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dataforseo.getKeywordDifficulty({
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
