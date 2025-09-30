import app from "../../recreation_gov.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "recreation_gov-search-campsites",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  name: "Search Campsites",
  description: "Searchs campsites with the given query. If no query given, returns campsites from the beginning. Returning campsite number is limited to `1000`. [See the documentation](https://ridb.recreation.gov/docs#/Campsites/getCampsites)",
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description: "Query filter criteria. Searches on campsite name, type, loop, type of use (Overnight/Day), campsite accessible (Yes/No)",
      optional: true,
    },
    offset: {
      type: "integer",
      label: "Offset",
      description: "Used when all results could not be retrieved due to limit of `1000`. Set this offset to fetch next resources.",
      optional: true,
    },
  },
  async run ({ $ }) {
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.getCampsites,
      resourceKey: "RECDATA",
      resourceLimit: 1000,
      offset: this.offset,
      resourceFnArgs: {
        $,
        params: {
          query: this.query,
        },
      },
    });
    const items = [];
    for await (const item of resourcesStream) {
      items.push(item);
    }
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${items.length} campsite${items.length == 1 ? "" : "s"} found.`);
    return items;
  },
};
