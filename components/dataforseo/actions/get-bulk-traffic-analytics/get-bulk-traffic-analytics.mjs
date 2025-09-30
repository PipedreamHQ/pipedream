import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-bulk-traffic-analytics",
  name: "Get Bulk Traffic Analytics",
  description: "Get traffic estimates and analytics for multiple domains in bulk. [See the documentation](https://docs.dataforseo.com/v3/dataforseo_labs/google/bulk_traffic_estimation/live/?bash)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dataforseo,
    targets: {
      propDefinition: [
        dataforseo,
        "targets",
      ],
    },
    locationCode: {
      propDefinition: [
        dataforseo,
        "locationCode",
      ],
    },
    languageCode: {
      propDefinition: [
        dataforseo,
        "languageCode",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dataforseo.getBulkTrafficAnalytics({
      $,
      data: [
        {
          targets: this.targets,
          location_code: this.locationCode,
          language_code: this.languageCode,
        },
      ],
    });

    if (response.status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.status_message}`);
    }

    if (response.tasks[0].status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
    }

    $.export("$summary", `Successfully retrieved bulk traffic analytics for ${this.targets.length} domains.`);
    return response;
  },
};
