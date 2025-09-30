import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import { parseArray } from "../../common/utils.mjs";

export default {
  key: "dataforseo-get-app-intersection",
  name: "Get App Intersection",
  description: "Compare keyword overlap between mobile apps to find shared ranking opportunities. [See the documentation](https://docs.dataforseo.com/v3/dataforseo_labs/google/app_intersection/live/?bash)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dataforseo,
    appIds: {
      type: "string[]",
      label: "App IDs",
      description: "Package names (IDs) of target Android apps on Google Play; you can find the package name in the app page URL (e.g., com.example.app)",
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
    limit: {
      propDefinition: [
        dataforseo,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const appIds = {};
    const parsedAppIds = parseArray(this.appIds);

    for (let i = 0; i < parsedAppIds.length; i++) {
      appIds[`${i + 1}`] = parsedAppIds[i];
    }

    const response = await this.dataforseo.getAppIntersection({
      $,
      debug: true,
      data: [
        {
          app_ids: appIds,
          location_code: this.locationCode,
          language_code: this.languageCode,
          limit: this.limit,
        },
      ],
    });

    if (response.status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.status_message}`);
    }

    if (response.tasks[0].status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
    }

    $.export("$summary", "Successfully retrieved app intersection.");
    return response;
  },
};
