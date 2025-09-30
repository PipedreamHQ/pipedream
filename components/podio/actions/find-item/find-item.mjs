import app from "../../podio.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "podio-find-item",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Find Item",
  description: "Filters items for the given app. [See the documentation](https://developers.podio.com/doc/items/filter-items-4496747)",
  props: {
    app,
    orgId: {
      propDefinition: [
        app,
        "orgId",
      ],
    },
    spaceId: {
      propDefinition: [
        app,
        "spaceId",
        (configuredProps) => ({
          orgId: configuredProps.orgId,
        }),
      ],
    },
    appId: {
      propDefinition: [
        app,
        "appId",
        (configuredProps) => ({
          spaceId: configuredProps.spaceId,
        }),
      ],
    },
    filters: {
      type: "string",
      label: "Filters",
      description: "The filters to apply. Must be a valid JSON object. If not given all items will be returned. e.g. `{\"title\": \"Title of the item\"}`",
      optional: true,
    },
  },
  async run ({ $ }) {
    const items = [];
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.filterItems,
      resourceFnArgs: {
        $,
        appId: this.appId,
        data: {
          filters: utils.extractOne(this.filters),
        },
      },
      resourceFnHasPaging: true,
      resourceKey: "items",
    });
    for await (const item of resourcesStream) {
      items.push(item);
    }
    $.export("$summary", `Found ${items.length} items.`);
    return items;
  },
};
