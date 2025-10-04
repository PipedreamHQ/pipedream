import zonkaFeedback from "../../zonka_feedback.app.mjs";

export default {
  key: "zonka_feedback-list-surveys",
  name: "List Surveys",
  description: "List surveys from Zonka Feedback. You can filter surveys based on their status.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zonkaFeedback,
    surveyStatus: {
      type: "string",
      label: "Survey Status",
      description: "The status of the surveys to list. For example, 'active', 'inactive'.",
      optional: true,
      options: [
        "active",
        "inactive",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.zonkaFeedback.listSurveys({
      surveyStatus: this.surveyStatus,
    });

    $.export("$summary", "Retrieved surveys");
    return response;
  },
};
