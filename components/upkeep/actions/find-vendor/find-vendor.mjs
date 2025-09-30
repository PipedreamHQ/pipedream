import app from "../../upkeep.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  type: "action",
  key: "upkeep-find-vendor",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  name: "Find Vendor",
  description: "Finds vendors according to props configured, if no prop configured returns all vendors. Note: enterprise/business-plus plan access only. [See the docs](https://developers.onupkeep.com/#get-all-vendors)",
  props: {
    app,
    businessName: {
      type: "string",
      label: "Business Name",
      description: "If set, the result will only include vendors with that business name.",
      optional: true,
    },
  },
  async run ({ $ }) {
    const items = [];
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.getVendors,
      resourceFnArgs: {
        $,
        params: {
          businessName: this.businessName,
        },
      },
    });
    for await (const item of resourcesStream)
      items.push(item);
    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `${items.length} vendor${items.length != 1 ? "s" : ""} has been found.`);
    return items;
  },
};
