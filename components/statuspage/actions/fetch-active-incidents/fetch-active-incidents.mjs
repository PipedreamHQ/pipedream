import statuspage from "../../statuspage.app.mjs";

export default {
  key: "statuspage-fetch-active-incidents",
  name: "Fetch Active Incidents",
  description: "Fetch first 100 unresolved (active) incidents for a Statuspage page — i.e. incidents not yet in the `resolved` or `postmortem` state. Returns an array (possibly empty) of incident objects. [See the documentation](https://developer.statuspage.io/#operation/getPagesPageIdIncidentsUnresolved)",
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
  },
  async run({ $ }) {
    const response = await this.statuspage.getUnresolvedIncidents({
      $,
      pageId: this.pageId,
    });

    if (response?.length) {
      $.export("$summary", `Successfully retrieved ${response.length} active incident(s)`);
    } else {
      $.export("$summary", "No active incidents found");
    }

    return response;
  },
};
