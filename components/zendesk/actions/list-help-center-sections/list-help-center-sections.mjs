import app from "../../zendesk.app.mjs";

export default {
  key: "zendesk-list-help-center-sections",
  name: "List Help Center Sections",
  description: "Lists all sections in the help center to understand content organization. Useful for browsing articles by topic area. [See the documentation](https://developer.zendesk.com/api-reference/help_center/help-center-api/sections/#list-sections).",
  type: "action",
  version: "0.1.0",
  props: {
    app,
    locale: {
      type: "string",
      label: "Locale",
      description: "The locale for the sections (e.g., 'en-us')",
      default: "en-us",
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Sort sections by specified field",
      options: [
        "position",
        "name",
        "created_at",
        "updated_at",
      ],
      default: "position",
      optional: true,
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "Order of the results",
      options: [
        "asc",
        "desc",
      ],
      default: "asc",
      optional: true,
    },
    customSubdomain: {
      propDefinition: [
        app,
        "customSubdomain",
      ],
    },
  },
  methods: {
    listSections(args = {}) {
      const {
        customSubdomain,
        params,
        ...otherArgs
      } = args;
      
      return this.app.makeRequest({
        path: `/help_center/sections`,
        customSubdomain,
        params,
        ...otherArgs,
      });
    },
  },
  async run({ $: step }) {
    const {
      locale,
      sortBy,
      sortOrder,
      customSubdomain,
    } = this;

    const params = {};
    
    if (sortBy) {
      params.sort_by = sortBy;
    }
    if (sortOrder) {
      params.sort_order = sortOrder;
    }

    const response = await this.listSections({
      step,
      customSubdomain,
      params,
    });

    step.export("$summary", `Successfully retrieved ${response.sections?.length || 0} help center sections`);
    return response;
  },
};
