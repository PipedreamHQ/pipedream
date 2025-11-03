import serphouse from "../../serphouse.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "serphouse-perform-search",
  name: "Perform Search",
  description: "Performs a search using the Serphouse API. [See the documentation](https://docs.serphouse.com/serp-api/live-using-http-get-method)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    serphouse,
    query: {
      propDefinition: [
        serphouse,
        "query",
      ],
    },
    domain: {
      propDefinition: [
        serphouse,
        "domain",
      ],
    },
    language: {
      propDefinition: [
        serphouse,
        "language",
        ({ domain }) => ({
          domain,
        }),
      ],
    },
    device: {
      type: "string",
      label: "Device",
      description: "The device to use for the search",
      options: [
        "desktop",
        "tablet",
        "mobile",
      ],
    },
    serpType: {
      type: "string",
      label: "SERP Type",
      description: "The type of SERP to use for the search",
      options: [
        "web",
        "news",
        "image",
      ],
    },
    locationAlert: {
      propDefinition: [
        serphouse,
        "locationAlert",
      ],
    },
    locationId: {
      propDefinition: [
        serphouse,
        "locationId",
        ({ domain }) => ({
          domain,
        }),
      ],
      optional: true,
    },
    verbatim: {
      type: "boolean",
      label: "Verbatim",
      description: "If true, the search will be performed verbatim",
      optional: true,
    },
    gfilter: {
      type: "boolean",
      label: "GFilter",
      description: "Parameter defines if the filters for 'Similar Results' and 'Omitted Results' are on or off. It can be set to `true` (default) to enable these filters, or `false` to disable these filters.",
      optional: true,
      default: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Give specific page to get the result of that page number. By default it will get you first page",
      optional: true,
    },
    numResults: {
      type: "integer",
      label: "Number of Results",
      description: "Define number of result you want to get per page. By default you will get top 100 results.",
      optional: true,
    },
    dateRange: {
      propDefinition: [
        serphouse,
        "dateRange",
      ],
    },
  },
  async run({ $ }) {
    const type = this.serphouse.getDomainType(this.domain);
    if (!this.locationId && (type === "google" || type === "bing")) {
      throw new ConfigurationError("Location is required for Google and Bing searches");
    }
    const response = await this.serphouse.performSearch({
      $,
      params: {
        q: this.query,
        domain: this.domain,
        lang: this.language,
        device: this.device,
        serp_type: this.serpType,
        loc_id: this.locationId,
        verbatim: this.verbatim
          ? "1"
          : "0",
        gfilter: this.gfilter
          ? "1"
          : "0",
        page: this.page,
        num_result: this.numResults,
        date_range: this.dateRange,
      },
    });
    if (response.status === "success") {
      $.export("$summary", `Successfully performed search for "${this.query}".`);
    }
    return response;
  },
};
