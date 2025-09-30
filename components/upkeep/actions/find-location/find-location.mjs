import app from "../../upkeep.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "upkeep-find-location",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Find Location",
  description: "Finds locations according to props configured, if no prop configured returns all locations, [See the docs](https://developers.onupkeep.com/#get-all-locations)",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "If set, the result will only include locations with that name.",
      optional: true,
    },
    locationId: {
      propDefinition: [
        app,
        "locationId",
      ],
      label: "Parent Location",
      description: "If set, the result will only include sub locations of this parent location.",
    },
    createdByUser: {
      propDefinition: [
        app,
        "userId",
      ],
      label: "Created By User",
      description: "If set, the result will only include locations created by this user.",
    },
  },
  async run ({ $ }) {
    const items = [];
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.getLocations,
      resourceFnArgs: {
        $,
        params: {
          name: this.name,
          parentLocation: this.locationId,
          createdByUser: this.createdByUser,
        },
      },
    });
    for await (const item of resourcesStream)
      items.push(item);
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${items.length} location${items.length != 1 ? "s" : ""} has been found.`);
    return items;
  },
};
