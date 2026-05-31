import app from "../../peakon_employee_voice.app.mjs";

export default {
  key: "peakon_employee_voice-get-driver-scores",
  name: "Get Driver Scores",
  description:
    "Returns engagement scores broken down by Peakon's 14 core drivers: Accomplishment, Autonomy, "
    + "Environment, Freedom of Opinions, Goal-Setting, Growth, Manager Support, Meaningful Work, "
    + "Organizational Fit, Peer Relationships, Recognition, Reward, Strategy, and Workload. "
    + "Each driver includes a score (0–10), grade (positive/neutral/negative), impact rating, "
    + "and classification (e.g. strength, priority). "
    + "Pass a `contextId` formatted as `company_[companyId]` for company-wide scores or "
    + "`segment_[segmentId]` to scope to a specific segment — use **List Segments** to discover IDs. "
    + "Use when the user asks 'which drivers are lowest?', 'how is recognition scoring?', or "
    + "'what are the priority areas to focus on?'. "
    + "[See the Peakon API documentation](https://developer.peakon.com/reference/get_engagement-contexts-contextid-drivers)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    contextId: {
      type: "string",
      label: "Context ID",
      description:
        "A company or segment context ID. Format: `company_[companyId]` for company-wide scores, "
        + "or `segment_[segmentId]` for a specific segment. "
        + "Use **List Segments** to discover segment context IDs.",
    },
    interval: {
      propDefinition: [
        app,
        "interval",
      ],
    },
    observations: {
      type: "boolean",
      label: "Include Observations",
      description: "Whether to include the observations array in the response. Defaults to false.",
      optional: true,
      default: false,
    },
    participation: {
      type: "boolean",
      label: "Include Participation",
      description: "Whether to include participation data in the response. Defaults to false.",
      optional: true,
      default: false,
    },
    filterSegmentIds: {
      type: "string",
      label: "Filter by Segment IDs",
      description:
        "Comma-separated list of segment IDs to filter driver scores by employee segments. "
        + "Example: `1001,1002`. Sent as `filter[employee.segmentIds][$contains]`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      interval: this.interval || undefined,
      observations: this.observations,
      participation: this.participation,
    };
    if (this.filterSegmentIds) {
      params["filter[employee.segmentIds][$contains]"] = this.filterSegmentIds;
    }
    const response = await this.app._makeRequest({
      $,
      path: `/api/v1/engagement/contexts/${this.contextId}/drivers`,
      params,
    });
    const drivers = response.data ?? [];
    $.export("$summary", `Retrieved scores for ${drivers.length} engagement driver(s)`);
    return response;
  },
};
