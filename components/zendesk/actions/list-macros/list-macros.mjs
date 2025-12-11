import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-list-macros",
  name: "List Macros",
  description: "Retrieves all macros. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/business-rules/macros/#list-macros).",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zendesk,
    access: {
      type: "string",
      label: "Access",
      description: "The access level of the macros to return",
      options: [
        "personal",
        "agents",
        "shared",
        "account",
      ],
      optional: true,
    },
    active: {
      type: "boolean",
      label: "Active",
      description: "Filter by active macros if `true` or inactive macros if `false`",
      optional: true,
    },
    macroCategory: {
      propDefinition: [
        zendesk,
        "macroCategory",
      ],
    },
    groupId: {
      propDefinition: [
        zendesk,
        "groupId",
      ],
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "The field to sort the results by",
      options: [
        "alphabetical",
        "created_at",
        "updated_at",
        "usage_1h",
        "usage_24h",
        "usage_7d",
        "usage_30d",
      ],
      optional: true,
    },
    sortOrder: {
      propDefinition: [
        zendesk,
        "sortOrder",
      ],
    },
    limit: {
      propDefinition: [
        zendesk,
        "limit",
      ],
      description: "Maximum number of macros to return",
    },
  },
  async run({ $: step }) {
    const results = this.zendesk.paginate({
      fn: this.zendesk.listMacros,
      args: {
        step,
        params: {
          access: this.access,
          active: this.active,
          category: this.macroCategory,
          group_id: this.groupId,
          sort_by: this.sortBy,
          sort_order: this.sortOrder,
        },
      },
      resourceKey: "macros",
      max: this.limit,
    });

    const macros = [];
    for await (const macro of results) {
      macros.push(macro);
    }

    step.export("$summary", `Successfully retrieved ${macros.length} macro${macros.length === 1
      ? ""
      : "s"}`);

    return macros;
  },
};
