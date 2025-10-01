import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-google-ads-keywords-for-site-completed-tasks",
  name: "Get Google Ads Keywords For Site Completed Tasks",
  description: "Retrieve the results of completed 'Keywords For Site' tasks, which haven't been collected yet. [See the documentation](https://docs.dataforseo.com/v3/keywords_data/google_ads/keywords_for_site/tasks_ready/?bash)",
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
    const response = await this.dataforseo.getGoogleAdsKeywordsForSiteCompletedTasks({
      $,
    });

    if (response.status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.status_message}`);
    }

    if (response.tasks[0].status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
    }

    $.export("$summary", "Successfully retrieved Google Ads keywords for site completed tasks.");
    return response;
  },
};
