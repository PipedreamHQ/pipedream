import zendesk from "../../zendesk.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "zendesk-list-dynamic-content-items",
  name: "List Dynamic Content Items",
  description: "Retrieves a list of dynamic content items. Note: Dynamic content is available only on the Professional plan and above. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/ticket-management/dynamic_content/#list-items).",
  version: "0.0.{{ts}}",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zendesk,
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "The number of results per page. The maximum is 100.",
      min: 1,
      max: 100,
      default: 100,
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "Cursor for the next page of results.",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Field to sort results by. Prefix with - for descending order. You can sort by the following properties: `locale`, `outdated`, `active`, `updated_at`, and `created_at`. The default sorting is by `id` in descending order.",
      options: constants.DYNAMIC_CONTENT_SORT_BY_OPTIONS,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.zendesk.listDynamicContentItems({
      $,
      params: {
        "page[size]": this.pageSize,
        "page[after]": this.after,
        "sort": this.sort,
      },
    });
    $.export("$summary", `Successfully retrieved ${response?.items?.length ?? 0} dynamic content item${response?.items?.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
