import app from "../../less_annoying_crm.app.mjs";
import { parseJson } from "../../common/utils.mjs";

export default {
  key: "less_annoying_crm-search-pipeline-items",
  name: "Search Pipeline Items",
  description: "Lists pipeline items (leads, deals, etc.) in one Less Annoying CRM pipeline, optionally filtered by status or owner. Each item includes its status, the attached contact, last note, and timestamps."
    + " Use **List Pipelines** first to get `pipelineId` and `statusIds` (e.g. the \"Leads\" pipeline and its \"Open\" status). For \"my leads\", get the user ID from **List Users** and pass it in `userIds`."
    + " To find leads for one specific contact, use **Get Contact Activities** with `include: [\"pipelineItems\"]` instead."
    + " `advancedFilters` is an optional JSON array of `{\"Name\", \"Operation\", \"Value\"}` objects; see the [filter docs](https://account.lessannoyingcrm.com/api_docs/v2/Advanced/Filter_Pipelines)."
    + " Returns `results` plus `hasMoreResults`; if true, call again with `page` incremented."
    + " Example: `pipelineId: \"1234567890123456789012345678904\", statusIds: [\"1234567890123456789012345678905\"]` returns `{\"hasMoreResults\": false, \"results\": [{\"PipelineItemId\": \"1234567890123456789012345678903\", \"StatusId\": \"1234567890123456789012345678905\", \"ContactId\": \"1234567890123456789012345678901\", \"LastNote\": \"Inbound website inquiry\", \"ContactMetaData\": {\"Name\": \"Jane Smith\"}, ...}]}`."
    + " [See the documentation](https://account.lessannoyingcrm.com/api_docs/v2/Core_Functions/Pipeline_Items#Goto-GetPipelineItems)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    pipelineId: {
      propDefinition: [
        app,
        "pipelineId",
      ],
    },
    statusIds: {
      type: "string[]",
      label: "Status IDs",
      description: "Only return items in these statuses. Omit to return items in all active statuses. Use **List Pipelines** to find status IDs.",
      optional: true,
    },
    userIds: {
      type: "string[]",
      label: "Owner User IDs",
      description: "Only return items whose contact is assigned to these user IDs. Use **List Users** to find IDs.",
      optional: true,
    },
    advancedFilters: {
      type: "string",
      label: "Advanced Filters",
      description: "JSON array of filters, e.g. `[{\"Name\": \"DateCreated\", \"Operation\": \"GreaterThan\", \"Value\": \"2025-01-01\"}]`.",
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Defaults to `Status`.",
      options: [
        "Status",
        "DateCreated",
        "LastUpdate",
      ],
      optional: true,
    },
    sortDirection: {
      type: "string",
      label: "Sort Direction",
      description: "Defaults to `Ascending`.",
      options: [
        "Ascending",
        "Descending",
      ],
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const {
      HasMoreResults, Results,
    } = await this.app.getPipelineItems({
      $,
      parameters: {
        PipelineId: this.pipelineId,
        StatusFilter: this.statusIds,
        UserFilter: this.userIds,
        AdvancedFilters: parseJson(this.advancedFilters, "Advanced Filters"),
        SortBy: this.sortBy,
        SortDirection: this.sortDirection,
        MaxNumberOfResults: this.maxResults ?? 50,
        Page: this.page,
      },
    });

    $.export("$summary", `Found ${Results.length} pipeline item(s)`);
    return {
      hasMoreResults: HasMoreResults,
      results: Results,
    };
  },
};
