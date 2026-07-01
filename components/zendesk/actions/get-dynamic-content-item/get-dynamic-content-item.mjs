import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-get-dynamic-content-item",
  name: "Get Dynamic Content Item",
  description: "Retrieves a dynamic content item. Note: Dynamic content is available only on the Professional plan and above. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/ticket-management/dynamic_content/#show-item).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zendesk,
    itemId: {
      type: "string",
      label: "Item ID",
      description: "The ID of the dynamic content item to retrieve. Example: `1234567890`. Use **List Dynamic Content Items** to discover IDs.",
    },
  },
  async run({ $ }) {
    const response = await this.zendesk.getDynamicContentItem({
      $,
      itemId: this.itemId,
    });
    $.export("$summary", `Successfully retrieved dynamic content item with ID ${this.itemId}`);
    return response;
  },
};
