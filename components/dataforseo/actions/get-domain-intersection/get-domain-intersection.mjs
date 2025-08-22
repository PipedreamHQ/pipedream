import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-domain-intersection",
  name: "Get Domain Intersection",
  description: "Compare keyword overlap between multiple domains to find shared ranking opportunities. [See the documentation](https://docs.dataforseo.com/v3/dataforseo_labs/google/domain_intersection/live/?bash)",
  version: "0.0.1",
  type: "action",
  props: {
    dataforseo,
    target1: {
      type: "string",
      label: "Target 1",
      description: "The first domain to compare. The domain should be specified without https:// and www.",
    },
    target2: {
      type: "string",
      label: "Target 2",
      description: "The second domain to compare. The domain should be specified without https:// and www.",
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
    const response = await this.dataforseo.getDomainIntersection({
      $,
      data: [
        {
          target1: this.target1,
          target2: this.target2,
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

    $.export("$summary", `Successfully retrieved domain intersection for domains ${this.target1} and ${this.target2}.`);
    return response;
  },
};
