import onedesk from "../../onedesk.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "onedesk-find-item",
  name: "Find Item",
  description: "Search for an existing item. [See the docs](https://www.onedesk.com/developers/#_search_items)",
  version: "0.0.1",
  type: "action",
  props: {
    onedesk,
    itemId: {
      propDefinition: [
        onedesk,
        "itemId",
      ],
      optional: true,
    },
    spaceName: {
      propDefinition: [
        onedesk,
        "spaceName",
      ],
    },
    name: {
      type: "string",
      label: "Item Name",
      description: "Name of the item",
      optional: true,
    },
    exactMatch: {
      type: "boolean",
      label: "Exact Match",
      description: "The item name search should be an exact match",
      optional: true,
      default: false,
    },
  },
  async run({ $ }) {
    const {
      itemId,
      spaceName,
      name,
      exactMatch,
    } = this;

    if (!itemId && !spaceName && !name) {
      throw new ConfigurationError("Must enter `itemId`, `spaceName` or `name`.");
    }

    const data = {
      filters: [],
    };

    if (itemId) {
      data.itemIds = [
        itemId,
      ];
    }

    if (spaceName) {
      data.filters.push({
        propertyName: "spaceName",
        operation: "EQ",
        value: spaceName,
      });
    }

    const { data: { items } } = await this.onedesk.searchItems({
      data,
      $,
    });

    let results = [];
    for (const workItemId of items) {
      const { data: itemWithData } = await this.onedesk.getItem({
        params: {
          workItemId,
        },
        $,
      });
      results.push(itemWithData);
    }

    if (name) {
      const lowerCaseName = name.toLowerCase();
      results = results.filter((item) =>
        exactMatch
          ? item.name === name
          : item.name.toLowerCase().includes(lowerCaseName));
    }

    $.export("$summary", `Found ${results.length} matching item(s).`);

    return results;
  },
};
