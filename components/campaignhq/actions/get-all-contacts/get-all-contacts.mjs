import app from "../../campaignhq.app.mjs";

export default {
  name: "Get all Contacts",
  description: "Get all contacts from a list [See the documentation](https://campaignhq.docs.apiary.io/#reference/0/contacts-collection/get-all-contacts).",
  key: "campaignhq-get-all-contacts",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    listId: {
      propDefinition: [
        app,
        "listId",
      ],
    },
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
      const res = await this.app.listContactsByList(this.listId, page);
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
