import app from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-get-ranked-keywords",
  name: "Get Ranked Keywords",
  description: "Description for get-ranked-keywords. [See the documentation](https://docs.dataforseo.com/v3/keywords_data/google_ads/keywords_for_site/task_post/?bash)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    locationCode: {
      propDefinition: [
        app,
        "locationCode",
      ],
    },
    targetType: {
      propDefinition: [
        app,
        "targetType",
      ],
    },
    target: {
      propDefinition: [
        app,
        "target",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getRankedKeywords({
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
