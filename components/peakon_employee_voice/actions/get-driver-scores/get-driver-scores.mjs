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
      propDefinition: [
        app,
        "contextId",
      ],
    },
    interval: {
      propDefinition: [
        app,
        "interval",
      ],
    },
    observations: {
      propDefinition: [
        app,
        "observations",
      ],
    },
    participation: {
      propDefinition: [
        app,
        "participation",
      ],
    },
    filterSegmentIds: {
      propDefinition: [
        app,
        "filterSegmentIds",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      "interval": this.interval,
      "observations": this.observations,
      "participation": this.participation,
      "filter[employee.segmentIds][$contains]": this.filterSegmentIds,
    };
    const response = await this.app.getDriverScores({
      $,
      contextId: this.contextId,
      params,
    });
    const drivers = response.data ?? [];
    $.export("$summary", `Retrieved scores for ${drivers.length} engagement driver(s)`);
    return response;
  },
};
