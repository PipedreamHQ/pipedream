import constants from "../../common/constants.mjs";
import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-list-active-macros",
  name: "List Active Macros",
  description: "Lists all active shared and personal macros available to the current user. [See the documentation](https://developer.zendesk.com/api-reference/ticketing/business-rules/macros/#list-active-macros).",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zendesk,
    access: {
      type: "string",
      label: "Access",
      description: "Filter macros by access. The \"agents\" value returns all personal macros for the account's agents and is only available to admins.",
      options: constants.ACCESS_OPTIONS,
      optional: true,
    },
    categoryId: {
      propDefinition: [
        zendesk,
        "macroCategory",
      ],
      optional: true,
    },
    groupId: {
      propDefinition: [
        zendesk,
        "groupId",
      ],
      optional: true,
    },
    include: {
      type: "string",
      label: "Include",
      description: "Additional fields to include in the response",
      options: constants.INCLUDE_OPTIONS,
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "The field to sort the results by",
      options: constants.SORT_BY_OPTIONS,
      optional: true,
    },
    sortOrder: {
      propDefinition: [
        zendesk,
        "sortOrder",
      ],
    },
  },
  async run({ $ }) {
    const { macros } = await this.zendesk.listActiveMacros({
      $,
      params: {
        access: this.access,
        category: this.categoryId,
        group_id: this.groupId,
        include: this.include,
        sort_by: this.sortBy,
        sort_order: this.sortOrder,
      },
    });

    $.export("$summary", `Successfully retrieved ${macros.length} macro${macros.length === 1
      ? ""
      : "s"}`);
    return macros;
  },
};
