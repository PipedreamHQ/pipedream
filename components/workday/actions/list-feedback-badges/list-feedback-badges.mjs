import workday from "../../workday.app.mjs";

export default {
  key: "workday-list-feedback-badges",
  name: "List Feedback Badges",
  description: "List all feedback badges. [See the Documentation](https://community.workday.com/sites/default/files/file-hosting/restapi/#performanceEnablement/v5/get-/feedbackBadges)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    workday,
  },
  async run({ $ }) {
    const response = await this.workday.listFeedbackBadges({
      $,
    });
    $.export("$summary", `Fetched ${response?.data?.length || 0} feedback badges`);
    return response;
  },
};
