import { ConfigurationError } from "@pipedream/platform";
import app from "../../serpkite.app.mjs";

export default {
  key: "serpkite-web-search",
  name: "Web Search",
  description: "Search Google and return organic results, the answer box, knowledge graph, People Also Ask and related searches. Failed and empty requests are not billed ([see pricing](https://serpkite.com/pricing)). [See the documentation](https://serpkite.com/docs/endpoints/search)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    q: {
      propDefinition: [
        app,
        "q",
      ],
    },
    country: {
      propDefinition: [
        app,
        "country",
      ],
    },
    language: {
      propDefinition: [
        app,
        "language",
      ],
    },
    location: {
      propDefinition: [
        app,
        "location",
      ],
    },
    num: {
      propDefinition: [
        app,
        "num",
      ],
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
      description: "Result page, from 1 to 10, e.g. `2`. Leave it empty or set it to `1` when Number of Results is above 10.",
    },
    time: {
      propDefinition: [
        app,
        "time",
      ],
    },
    includeDomains: {
      propDefinition: [
        app,
        "includeDomains",
      ],
    },
    excludeDomains: {
      propDefinition: [
        app,
        "excludeDomains",
      ],
    },
    includeAnswer: {
      type: "boolean",
      label: "Include Answer",
      description: "Also write a short cited answer over the results, returned in `answer`, e.g. `true`. Costs extra credits; free if it fails.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.num > 10 && this.page > 1) {
      throw new ConfigurationError("Number of Results above 10 fetches the top results in one call, so it needs Page empty or `1`. Lower Number of Results to 10 or less to request a later page.");
    }
    const response = await this.app.searchWeb({
      $,
      data: {
        q: this.q,
        country: this.country,
        language: this.language,
        location: this.location,
        num: this.num,
        page: this.page,
        time: this.time,
        include_domains: this.includeDomains,
        exclude_domains: this.excludeDomains,
        include_answer: this.includeAnswer,
      },
    });
    $.export("$summary", `Retrieved ${response.results?.length ?? 0} results`);
    return response;
  },
};
