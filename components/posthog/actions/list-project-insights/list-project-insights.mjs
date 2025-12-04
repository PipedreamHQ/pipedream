import posthog from "../../posthog.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "posthog-list-project-insights",
  name: "List Project Insights",
  description: "Retrieve a list of insights for a project. [See the documentation](https://posthog.com/docs/api/insights#get-api-projects-project_id-insights)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
    idempotentHint: true,
  },
  type: "action",
  props: {
    posthog,
    organizationId: {
      propDefinition: [
        posthog,
        "organizationId",
      ],
    },
    projectId: {
      propDefinition: [
        posthog,
        "projectId",
        (c) => ({
          organizationId: c.organizationId,
        }),
      ],
    },
    basic: {
      type: "boolean",
      label: "Basic",
      description: "Return basic insight metadata only (no results, faster).",
      optional: true,
    },
    refresh: {
      type: "string",
      label: "Refresh",
      description: "Whether to refresh the retrieved insights. Options: `force_cache`, `blocking`, `async`, `lazy_async`, `force_blocking`, `force_async`. Default: `force_cache`",
      optional: true,
      default: "force_cache",
      options: constants.REFRESH_OPTIONS,
    },
    maxResults: {
      propDefinition: [
        posthog,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      posthog,
      projectId,
      basic,
      refresh,
      maxResults,
    } = this;

    const insights = await posthog.iterateResults({
      fn: posthog.listInsights,
      args: {
        $,
        projectId,
        params: {
          basic,
          refresh,
        },
      },
      max: maxResults,
    });

    $.export("$summary", `Successfully retrieved ${insights.length} insight${insights.length === 1
      ? ""
      : "s"}`);
    return insights;
  },
};
