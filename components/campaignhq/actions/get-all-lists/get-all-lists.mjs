import app from "../../campaignhq.app.mjs";

export default {
  name: "Get all Lists",
  description: "Get all lists [See the documentation](https://campaignhq.docs.apiary.io/#reference/0/lists-collection/get-all-lists).",
  key: "campaignhq-get-all-lists",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    maximumItems: {
      type: "integer",
      label: "Maximum Items",
      description: "Maximum number of items to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const MAXIMUM_ITEMS = this.maximumItems ?? 1000;
    let page = 1;
    const items = [];
    while (true) {
      const res = await this.app.listLists(page);
      items.push(...res.data);
      if (res.totalPages === 0 || res.totalPages === page || items.length >= MAXIMUM_ITEMS) {
        break;
      }
      page++;
    }
    if (items.length === 0) {
      $.export("summary", "No items found.");
      return [];
    }
    $.export("summary", `Successfully fetched ${items.length} item(s).`);
    return items.slice(0, MAXIMUM_ITEMS);
  },
};
