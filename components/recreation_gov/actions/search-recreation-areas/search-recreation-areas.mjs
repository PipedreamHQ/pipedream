import app from "../../recreation_gov.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "recreation_gov-search-recreation-areas",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  name: "Search Recreation Areas",
  description: "Searchs recreation areas with the given properties. If no parameters given, returns all. [See the documentation](https://ridb.recreation.gov/docs#/Recreation%20Areas/getRecAreas)",
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description: "Query filter criteria. Searches on RecArea name, description, keywords, and stay limit",
      optional: true,
    },
    states: {
      propDefinition: [
        app,
        "states",
      ],
    },
    activities: {
      propDefinition: [
        app,
        "activities",
      ],
    },
    latitude: {
      type: "string",
      label: "Latitude",
      description: "Latitude of the point in decimal degrees",
      optional: true,
    },
    longitude: {
      type: "string",
      label: "Longitude",
      description: "Longitude of the point in decimal degrees",
      optional: true,
    },
    radius: {
      type: "string",
      label: "Radius",
      description: "Distance (in miles) by which to include search results",
      optional: true,
    },
  },
  async run ({ $ }) {
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.getRecAreas,
      resourceKey: "RECDATA",
      resourceFnArgs: {
        $,
        params: {
          query: this.query,
          state: this.states?.join(","),
          activity: this.activities?.join(","),
          latitude: this.latitude,
          longitude: this.longitude,
          radius: this.radius,
        },
      },
    });
    const items = [];
    for await (const item of resourcesStream)
      items.push(item);
      // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${items.length} recreation area${items.length == 1 ? "" : "s"} found.`);
    return items;
  },
};
