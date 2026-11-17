import firma from "../../firma.app.mjs";
import {
  TEMPLATE_SORT_FIELDS,
  SORT_ORDERS,
} from "../../common/constants.mjs";

export default {
  key: "firma-list-templates",
  name: "List Templates",
  description: "Retrieves a paginated list of templates. [See the documentation](https://docs.firma.dev/api-reference/templates/list-templates)",
  version: "0.0.1",
  type: "action",
  props: {
    firma,
    name: {
      type: "string",
      label: "Name",
      description: "Filter by template name (partial match, case-insensitive)",
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Field to sort by",
      optional: true,
      options: TEMPLATE_SORT_FIELDS,
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "Sort order",
      optional: true,
      options: SORT_ORDERS,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number",
      optional: true,
      default: 1,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: "Items per page (max 200)",
      optional: true,
      default: 50,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.name) params.name = this.name;
    if (this.sortBy) params.sort_by = this.sortBy;
    if (this.sortOrder) params.sort_order = this.sortOrder;
    if (this.page) params.page = this.page;
    if (this.pageSize) params.page_size = this.pageSize;
    const response = await this.firma.listTemplates({
      $,
      params,
    });
    $.export("$summary", `Successfully retrieved ${response.results?.length || 0} template(s)`);
    return response;
  },
};
