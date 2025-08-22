import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-domain-whois-overview",
  name: "Get Domain Whois Overview",
  description: "Get domain registration data and ownership information. [See the documentation](https://docs.dataforseo.com/v3/domain_analytics/whois/overview/live/?bash)",
  version: "0.0.1",
  type: "action",
  props: {
    dataforseo,
    limit: {
      propDefinition: [
        dataforseo,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dataforseo.getDomainWhoisOverview({
      $,
      data: [
        {
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

    $.export("$summary", "Successfully retrieved domain whois overview.");
    return response;
  },
};
