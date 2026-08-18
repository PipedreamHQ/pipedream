// x-pd-ai: optimized
import arlo from "../../arlo.app.mjs";
import {
  DEFAULT_LIMIT,
  EVENT_TEMPLATE_STATUSES,
} from "../../common/constants.mjs";

export default {
  key: "arlo-list-event-templates",
  name: "List Event Templates",
  description: "List Arlo EventTemplate (course) records. Use this first to discover the template `Code` and `TemplateID` values needed by **Create Event** and **List Events**. Optionally filter by status. Results are paged (see `limit`/`skip`); if the page comes back full, call again with a higher `skip` for more. Use `fields` to shrink the response for large template lists. Example: call with `status: \"Active\"` to get up to 100 active templates with `TemplateID`, `Code`, `Name`. [See the documentation](https://developer.arlo.co/doc/api/2012-02-01/auth/resources/eventtemplates#collection-httpget).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    arlo,
    status: {
      type: "string",
      label: "Status",
      description: "Optional. Filter templates by status.",
      optional: true,
      options: EVENT_TEMPLATE_STATUSES,
    },
    limit: {
      propDefinition: [
        arlo,
        "limit",
      ],
    },
    skip: {
      propDefinition: [
        arlo,
        "skip",
      ],
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional. Return only these top-level fields per template (e.g. `[\"TemplateID\", \"Code\", \"Name\"]`) instead of the full record, to reduce response size for large template lists.",
      optional: true,
    },
  },
  async run({ $ }) {
    const filterParts = [];
    if (this.status) {
      filterParts.push(`Status eq '${this.status}'`);
    }

    const params = {
      top: this.limit ?? DEFAULT_LIMIT,
      skip: this.skip ?? 0,
      expand: "EventTemplate",
    };
    if (filterParts.length) {
      params["filter"] = filterParts.join(" and ");
    }

    const response = await this.arlo.listEventTemplates({
      $,
      params,
    });

    const templates = this.arlo._shapeItems(
      this.arlo._extractCollection(response, "EventTemplates", "EventTemplate"),
      this.fields,
    );
    $.export("$summary", `Retrieved ${templates.length} event template${templates.length === 1
      ? ""
      : "s"}${templates.length === (this.limit ?? DEFAULT_LIMIT)
      ? " (page may be full — more may exist)"
      : ""}`);
    return templates;
  },
};
