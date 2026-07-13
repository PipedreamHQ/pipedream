import app from "../../peakon_employee_voice.app.mjs";

export default {
  key: "peakon_employee_voice-get-engagement-overview",
  name: "Get Engagement Overview",
  description:
    "Returns the engagement score, response rate, NPS breakdown, and favorability data "
    + "for a company or specific segment context. "
    + "Pass a `contextId` formatted as `company_[companyId]` for company-wide metrics or "
    + "`segment_[segmentId]` for a specific segment — use **List Segments** to discover segment IDs. "
    + "Use when the user asks 'what is our overall engagement score?', 'how engaged is [segment]?', "
    + "or 'what is the response rate?'. "
    + "Returns: engagement score (0–10 scale), NPS score, favorable/neutral/unfavorable split, "
    + "response count, and last survey date. "
    + "[See the Peakon API documentation](https://developer.peakon.com/reference/get_engagement-contexts-contextid-overview)",
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
  },
  async run({ $ }) {
    const response = await this.app.getEngagementOverview({
      $,
      contextId: this.contextId,
      params: {
        interval: this.interval,
        observations: this.observations,
        participation: this.participation,
      },
    });
    const score = response.data?.attributes?.scores?.mean;
    $.export("$summary", `Engagement overview retrieved — score: ${score != null && Number.isFinite(score)
      ? score.toFixed(2)
      : "N/A"}`);
    return response;
  },
};
