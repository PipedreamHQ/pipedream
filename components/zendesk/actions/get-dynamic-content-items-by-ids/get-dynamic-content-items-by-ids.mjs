import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-get-dynamic-content-items-by-ids",
  name: "Get Dynamic Content Items by IDs",
  description: "Retrieves multiple dynamic content items by their IDs. Note: Dynamic content is available only on the Professional plan and above. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/ticket-management/dynamic_content/#show-many-items).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zendesk,
    itemIds: {
      type: "string[]",
      label: "Item IDs",
      description: "The IDs of the dynamic content items to retrieve. Example: `[\"1234567890\", \"0987654321\"]`. Use **List Dynamic Content Items** to discover IDs.",
    },
  },
  async run({ $ }) {
    const response = await this.zendesk.showManyDynamicContentItems({
      $,
      params: {
        identifiers: this.itemIds.join(","),
      },
    });
    $.export("$summary", `Successfully retrieved ${response?.items?.length ?? 0} dynamic content item(s)`);
    return response;
  },
};
