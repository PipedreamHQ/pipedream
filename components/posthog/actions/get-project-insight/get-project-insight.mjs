import posthog from "../../posthog.app.mjs";

export default {
  key: "posthog-get-project-insight",
  name: "Get Project Insight",
  description: "Retrieve a specific insight from a project. [See the documentation](https://posthog.com/docs/api/insights#get-api-projects-project_id-insights-id)",
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
    insightId: {
      propDefinition: [
        posthog,
        "insightId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    fromDashboard: {
      type: "string",
      label: "From Dashboard",
      description: "Only if loading an insight in the context of a dashboard: The relevant dashboard's ID. When set, the specified dashboard's filters and date range override will be applied.",
      optional: true,
    },
    refresh: {
      type: "string",
      label: "Refresh",
      description: "Whether to refresh the insight. Options: `force_cache`, `blocking`, `async`, `lazy_async`, `force_blocking`, `force_async`",
      optional: true,
      default: "force_cache",
      options: [
        "force_cache",
        "blocking",
        "async",
        "lazy_async",
        "force_blocking",
        "force_async",
      ],
    },
  },
  async run({ $ }) {
    const {
      posthog,
      projectId,
      insightId,
      fromDashboard,
      refresh,
    } = this;

    const insight = await posthog.getInsight({
      $,
      projectId,
      insightId,
      params: {
        from_dashboard: fromDashboard,
        refresh,
      },
    });

    $.export("$summary", `Successfully retrieved insight with ID ${insightId}`);
    return insight;
  },
};
