import app from "../../upkeep.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "upkeep-find-part",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Find Part",
  description: "Finds parts according to props configured, if no prop configured returns all parts, [See the docs](https://developers.onupkeep.com/#get-all-parts)",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "If set, the result will only include parts with that name.",
      optional: true,
    },
    category: { //no method to fetch part categories
      type: "string",
      label: "Category",
      description: "If set, the result will only include parts with that category.",
      optional: true,
    },
    locationId: {
      propDefinition: [
        app,
        "locationId",
      ],
      description: "The ID of the location. If set, the result will only include parts assigned to this location.",
    },
    createdByUser: {
      propDefinition: [
        app,
        "userId",
      ],
      label: "Created By User",
      description: "The ID of the user. If set, the result will only include parts created by this user.",
    },
  },
  async run ({ $ }) {
    const items = [];
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.getParts,
      resourceFnArgs: {
        $,
        params: {
          name: this.name,
          category: this.category,
          location: this.locationId,
          createdByUser: this.createdByUser,
        },
      },
    });
    for await (const item of resourcesStream)
      items.push(item);
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${items.length} part${items.length != 1 ? "s" : ""} has been found.`);
    return items;
  },
};
