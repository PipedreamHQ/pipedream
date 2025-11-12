import airfocus from "../../airfocus.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "airfocus-search-item",
  name: "Search Item",
  description: "Searches items by query in airfocus. [See the documentation](https://developer.airfocus.com/endpoints.html)",
  version: "0.1.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    airfocus,
    workspaceId: {
      propDefinition: [
        airfocus,
        "workspaceId",
      ],
    },
    filter: {
      type: "object",
      label: "Filter",
      description: "The object query to match the items. Example: `{\"type\": \"and\",\"inner\": [{\"type\": \"name\",\"mode\": \"contain\",\"text\": \"Test\",\"caseSensitive\": false}]}` [See the documentation](https://developer.airfocus.com/endpoints.html)",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = this.airfocus.paginate({
      $,
      workspaceId: this.workspaceId,
      fn: this.airfocus.searchItem,
      data: {
        filter: parseObject(this.filter),
      },
    });

    const responseArray = [];
    for await (const item of response) {
      responseArray.push(item);
    }
    $.export("$summary", `Successfully fetched ${responseArray.length} item(s)`);
    return responseArray;
  },
};
