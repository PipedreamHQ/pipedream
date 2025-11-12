import { parseObjectEntries } from "../../common/utils.mjs";
import dataforseo from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-get-backlinks",
  name: "Get Backlinks",
  description:
    "Get a list of backlinks and relevant data for a given domain, subdomain, or webpage. [See the documentation](https://docs.dataforseo.com/v3/backlinks/backlinks/live/)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  methods: {
    getBacklinks(args = {}) {
      return this.dataforseo._makeRequest({
        path: "/backlinks/backlinks/live",
        method: "post",
        ...args,
      });
    },
  },
  props: {
    dataforseo,
    target: {
      propDefinition: [
        dataforseo,
        "backlinksTarget",
      ],
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "Select the mode of grouping the results",
      options: [
        {
          value: "as_is",
          label: "returns all backlinks",
        },
        {
          value: "one_per_domain",
          label: "returns one backlink per domain",
        },
        {
          value: "one_per_anchor",
          label: "returns one backlink per anchor",
        },
      ],
      default: "as_is",
    },
    filters: {
      propDefinition: [
        dataforseo,
        "backlinksFilters",
      ],
    },
    order_by: {
      type: "string[]",
      label: "Order By",
      description: "One or more rules to sort results with, with each entry being a field and a direction (`asc` for ascending or `desc` for descending). Example: [\"domain_from_rank,desc\",\"page_from_rank,asc\"]",
    },
    rankScale: {
      propDefinition: [
        dataforseo,
        "rankScale",
      ],
    },
    tag: {
      propDefinition: [
        dataforseo,
        "tag",
      ],
    },
    additionalOptions: {
      propDefinition: [
        dataforseo,
        "additionalOptions",
      ],
      description: "Additional parameters to send in the request. [See the documentation](https://docs.dataforseo.com/v3/backlinks/backlinks/live/) for all available parameters. Values will be parsed as JSON where applicable.",
    },
  },
  async run({ $ }) {
    const response = await this.getBacklinks({
      $,
      data: [
        {
          target: this.target,
          mode: this.mode,
          filters: this.filters,
          order_by: this.order_by,
          rank_scale: this.rankScale,
          tag: this.tag,
          ...parseObjectEntries(this.additionalOptions),
        },
      ],
    });
    $.export("$summary", "Successfully retrieved backlinks data");
    return response;
  },
};
