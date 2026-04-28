import statuspage from "../../statuspage.app.mjs";

export default {
  key: "statuspage-fetch-active-incidents",
  name: "Fetch Active Incidents",
  description: "Fetch unresolved (active) incidents for a Statuspage page — i.e. incidents not yet in the `resolved` or `postmortem` state. Returns an array (possibly empty) of incident objects. [See the documentation](https://developer.statuspage.io/#operation/getPagesPageIdIncidentsUnresolved)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    statuspage,
    pageId: {
      propDefinition: [
        statuspage,
        "pageId",
      ],
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to fetch",
      optional: true,
      default: 1,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "The number of incidents to fetch per page",
      optional: true,
      default: 100,
    },
  },
  async run({ $ }) {
    const response = await this.statuspage.getUnresolvedIncidents({
      $,
      pageId: this.pageId,
      params: {
        page: this.page,
        per_page: this.perPage,
      },
    });

    if (response?.length) {
      $.export("$summary", `Successfully retrieved ${response.length} active incident(s)`);
    } else {
      $.export("$summary", "No active incidents found");
    }

    return response;
  },
};
