import workday from "../../workday.app.mjs";

export default {
  key: "workday-get-feedback-badge-details",
  name: "Get Feedback Badge Details",
  description: "Get details of a feedback badge by ID. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#performanceEnablement/v5/get-/feedbackBadges/-ID-)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
    feedbackBadgeId: {
      propDefinition: [
        workday,
        "feedbackBadgeId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.workday.getFeedbackBadge({
      id: this.feedbackBadgeId,
      $,
    });
    $.export("$summary", `Fetched details for feedback badge ID ${this.feedbackBadgeId}`);
    return response;
  },
};
