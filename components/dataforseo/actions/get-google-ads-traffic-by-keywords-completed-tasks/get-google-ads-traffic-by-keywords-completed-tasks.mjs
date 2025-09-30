import { ConfigurationError } from "@pipedream/platform";
import dataforseo from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-get-google-ads-traffic-by-keywords-completed-tasks",
  name: "Get Google Ads Traffic By Keywords Completed Tasks",
  description: "Retrieve the results of completed 'Ad Traffic By Keywords' tasks, which haven't been collected yet. [See the documentation](https://docs.dataforseo.com/v3/keywords_data/google_ads/ad_traffic_by_keywords/tasks_ready/?bash)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dataforseo,
  },
  async run({ $ }) {
    const response = await this.dataforseo.getGoogleAdsAdTrafficByKeywordsCompletedTasks({
      $,
    });

    if (response.status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.status_message}`);
    }

    if (response.tasks[0].status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
    }

    $.export("$summary", "Successfully retrieved Google Ads traffic by keywords completed tasks.");
    return response;
  },
};
