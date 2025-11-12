import dataforseo from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-get-backlinks-history",
  name: "Get Backlinks History",
  description:
    "Get historical backlinks data back to the beginning of 2019. [See the documentation](https://docs.dataforseo.com/v3/backlinks/history/live/)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  methods: {
    getBacklinksHistory(args = {}) {
      return this.dataforseo._makeRequest({
        path: "/backlinks/history/live",
        method: "post",
        ...args,
      });
    },
  },
  props: {
    dataforseo,
    target: {
      type: "string",
      label: "Target Domain",
      description: "Domain should be specified without `https://` and `www`",
    },
    dateFrom: {
      type: "string",
      label: "Starting Date",
      description:
        "Starting date of the time range, in `YYYY-MM-DD` format. Default and minimum value is `2019-01-01`",
      optional: true,
    },
    dateTo: {
      type: "string",
      label: "End Date",
      description:
        "End date of the time range, in `YYYY-MM-DD` format. Default is today's date",
      optional: true,
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
  },
  async run({ $ }) {
    const response = await this.getBacklinksHistory({
      $,
      data: [
        {
          target: this.target,
          date_from: this.dateFrom,
          date_to: this.dateTo,
          rank_scale: this.rankScale,
          tag: this.tag,
        },
      ],
    });
    $.export("$summary", "Successfully retrieved backlinks history");
    return response;
  },
};
