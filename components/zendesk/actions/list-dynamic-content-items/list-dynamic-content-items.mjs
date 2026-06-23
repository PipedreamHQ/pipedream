import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-list-dynamic-content-items",
  name: "List Dynamic Content Items",
  description: "Retrieves a list of dynamic content items. Note: Dynamic content is available only on the Professional plan and above. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/ticket-management/dynamic_content/#list-items).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zendesk,
    page: {
      type: "integer",
      label: "Page",
      description: "The page number to retrieve. Default is 1.",
      default: 1,
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "The number of results per page. Default is 100.",
      default: 100,
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Field to sort results by. Prefix with - for descending order.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.zendesk.listDynamicContentItems({
      $,
      params: {
        page: this.page,
        per_page: this.perPage,
        sort: this.sort,
      },
    });
    $.export("$summary", `Successfully retrieved ${response?.items?.length ?? 0} dynamic content item(s)`);
    return response;
  },
};
