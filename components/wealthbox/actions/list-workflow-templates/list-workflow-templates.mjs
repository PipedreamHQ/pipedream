import wealthbox from "../../wealthbox.app.mjs";
import {
  DEFAULT_LIST_LIMIT,
  MAX_LIST_LIMIT,
} from "../../common/constants.mjs";

const PER_PAGE = 25;
const MAX_PAGES = 40; // cap at 1,000 templates

export default {
  key: "wealthbox-list-workflow-templates",
  name: "List Workflow Templates",
  description: "Companion list action for the free-form Workflow id prop. Returns available workflow templates via GET /workflow_templates so agents/users can discover valid template ids for **Start Workflow**. Paginates up to the requested Limit. Example: returns template objects each including `id`, `name`, and workflow step configuration. Supply the optional Fields parameter (e.g. `[\"id\",\"name\"]`) to receive a trimmed response. [See the documentation](https://dev.wealthbox.com/#workflow-templates-retrieve-all-workflow-templates-get)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    wealthbox,
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of workflow templates to return (1-${MAX_LIST_LIMIT}). Defaults to ${DEFAULT_LIST_LIMIT}.`,
      min: 1,
      max: MAX_LIST_LIMIT,
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of field names to include in each returned template object. When omitted, all fields are returned. Example: `[\"id\", \"name\"]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const limit = this.limit || DEFAULT_LIST_LIMIT;
    const templates = [];
    let page = 1;

    while (templates.length < limit && page <= MAX_PAGES) {
      const response = await this.wealthbox.listWorkflowTemplates({
        $,
        params: {
          per_page: PER_PAGE,
          page,
        },
      });
      const batch = response?.workflow_templates || [];
      templates.push(...batch);
      if (batch.length < PER_PAGE) break; // no more pages
      page++;
    }

    const sliced = templates.slice(0, limit);
    const result = this.fields?.length
      ? sliced.map((t) => Object.fromEntries(this.fields.map((f) => [
        f,
        t[f],
      ])))
      : sliced;

    $.export("$summary", `Found ${result.length} workflow template${result.length === 1
      ? ""
      : "s"}`);
    return result;
  },
};
