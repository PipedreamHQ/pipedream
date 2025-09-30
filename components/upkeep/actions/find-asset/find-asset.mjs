import app from "../../upkeep.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "upkeep-find-asset",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Find Asset",
  description: "Finds assets according to props configured, if no prop configured returns all assets, [See the docs](https://developers.onupkeep.com/#get-all-assets)",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "If set, the result will only include assets with that name.",
      optional: true,
    },
    locationId: {
      propDefinition: [
        app,
        "locationId",
      ],
      description: "The ID of the location. If set, the result will only include assets assigned to this location.",
    },
    status: {
      type: "string",
      label: "Status",
      description: "If set, the result will only include assets with this status.",
      optional: true,
      options: [
        {
          label: "Operational",
          value: "active",
        },
        {
          label: "Not Operational",
          value: "inactive",
        },
      ],
    },
    category: { //no method to fetch asset categories
      type: "string",
      label: "Category",
      description: "If set, the result will only include assets with this category.",
      optional: true,
    },
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
      description: "The ID of the user. If set, the result will only include assets assigned to this user.",
    },
    createdByUser: {
      propDefinition: [
        app,
        "userId",
      ],
      label: "Created By User",
      description: "The ID of the user. If set, the result will only include assets created by this user.",
    },
    downtimeStatus: {
      propDefinition: [
        app,
        "downtimeStatus",
      ],
    },
  },
  async run ({ $ }) {
    const items = [];
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.getAssets,
      resourceFnArgs: {
        $,
        params: {
          name: this.name,
          location: this.locationId,
          status: this.status,
          category: this.category,
          assignedToUser: this.userId,
          createdByUser: this.createdByUser,
          downtimeStatus: this.downtimeStatus,
        },
      },
    });
    for await (const item of resourcesStream)
      items.push(item);
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${items.length} asset${items.length != 1 ? "s" : ""} has been found.`);
    return items;
  },
};
