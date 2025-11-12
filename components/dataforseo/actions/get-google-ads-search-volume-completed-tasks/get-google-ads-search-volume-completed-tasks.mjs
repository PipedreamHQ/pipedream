import { ConfigurationError } from "@pipedream/platform";
import dataforseo from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-get-google-ads-search-volume-completed-tasks",
  name: "Get Google Ads Search Volume Completed Tasks",
  description: "Retrieve the results of completed 'Search Volume' tasks, which haven't been collected yet. [See the documentation](https://docs.dataforseo.com/v3/keywords_data/google_ads/search_volume/tasks_ready/?bash)",
  version: "0.0.3",
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
    const response = await this.dataforseo.getGoogleAdsSearchVolumeCompletedTasks({
      $,
    });

    if (response.status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.status_message}`);
    }

    if (response.tasks[0].status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
    }

    $.export("$summary", "Successfully retrieved Google Ads search volume completed tasks.");
    return response;
  },
};
