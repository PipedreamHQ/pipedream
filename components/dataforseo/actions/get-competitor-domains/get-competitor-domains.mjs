import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-competitor-domains",
  name: "Get Competitor Domains",
  description: "Find competing domains for specified keywords or target domain. [See the documentation](https://docs.dataforseo.com/v3/dataforseo_labs/google/competitors_domain/live/?bash)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dataforseo,
    target: {
      propDefinition: [
        dataforseo,
        "target",
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
    limit: {
      propDefinition: [
        dataforseo,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dataforseo.getCompetitorDomains({
      $,
      data: [
        {
          target: this.target,
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

    $.export("$summary", `Successfully retrieved competitor domains for "${this.target}".`);
    return response;
  },
};
