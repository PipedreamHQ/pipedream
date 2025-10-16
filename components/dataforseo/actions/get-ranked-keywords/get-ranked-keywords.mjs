import dataforseo from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-get-ranked-keywords",
  name: "Get Ranked Keywords",
  description: "Description for get-ranked-keywords. [See the documentation](https://docs.dataforseo.com/v3/keywords_data/google_ads/keywords_for_site/task_post/?bash)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dataforseo,
    locationCode: {
      propDefinition: [
        dataforseo,
        "locationCode",
      ],
    },
    targetType: {
      propDefinition: [
        dataforseo,
        "targetType",
      ],
    },
    target: {
      propDefinition: [
        dataforseo,
        "target",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dataforseo.getRankedKeywords({
      $,
      data: [
        {
          location_code: this.locationCode,
          target_type: this.targetType,
          target: this.target,
        },
      ],
    });
    $.export("$summary", `Successfully sent the request. Status: ${response.tasks[0].status_message}`);
    return response;
  },
};
