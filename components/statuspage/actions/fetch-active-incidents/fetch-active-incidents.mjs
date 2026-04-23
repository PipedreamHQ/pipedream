import statuspage from "../../statuspage.app.mjs";

export default {
  name: "Fetch Active Incidents",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  key: "statuspage-fetch-active-incidents",
  description: "Fetches active incidents for a page. [See docs here](https://developer.statuspage.io/#operation/getPagesPageIdIncidentsUnresolved)",
  type: "action",
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
