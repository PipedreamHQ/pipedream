import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-get-dynamic-content-items-by-name",
  name: "Get Dynamic Content Items by Name",
  description: "Retrieves multiple dynamic content items by their names. Note: Dynamic content is available only on the Professional plan and above. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/ticket-management/dynamic_content/#show-many-items).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zendesk,
    itemNames: {
      type: "string[]",
      label: "Item Names",
      description: "The names of the dynamic content items to retrieve. Example: `[\"item_one\", \"item_two\"]`. Use **List Dynamic Content Items** to discover names.",
    },
  },
  async run({ $ }) {
    const response = await this.zendesk.showManyDynamicContentItems({
      $,
      params: {
        identifiers: this.itemNames.join(","),
      },
    });
    $.export("$summary", `Successfully retrieved ${response?.items?.length ?? 0} dynamic content item(s)`);
    return response;
  },
};
