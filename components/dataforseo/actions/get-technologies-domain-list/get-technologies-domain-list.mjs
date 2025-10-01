import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-technologies-domain-list",
  name: "Get Technologies Domain List",
  description: "Get technologies used by a domain (CMS, analytics, frameworks, etc.). [See the documentation](https://docs.dataforseo.com/v3/domain_analytics/technologies/domain_technologies/live/?bash)",
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
  },
  async run({ $ }) {
    const response = await this.dataforseo.getTechnologiesDomainList({
      $,
      data: [
        {
          target: this.target,
        },
      ],
    });

    if (response.status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.status_message}`);
    }

    if (response.tasks[0].status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
    }

    $.export("$summary", `Successfully retrieved technologies for "${this.target}".`);
    return response;
  },
};
