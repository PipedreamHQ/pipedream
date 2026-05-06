import app from "../../lever_oauth.app.mjs";

export default {
  key: "lever_oauth-list-feedback",
  name: "List Feedback",
  description:
    "Returns all interview feedback (scorecards) for an opportunity."
    + " Use this when asked about interview results, panel scores, or whether feedback has been submitted for a candidate."
    + " Each feedback record includes the panel ID, interviewer, score (yes/no/strong_yes/strong_no), and completed form fields."
    + " Use the panel ID from results to submit additional feedback with **Submit Feedback**."
    + " [See the documentation](https://hire.lever.co/developer/documentation#list-all-feedback-forms)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    opportunityId: {
      type: "string",
      label: "Opportunity ID",
      description: "The ID of the opportunity whose feedback to retrieve. Use **Search Opportunities** to find opportunity IDs.",
    },
  },
  async run({ $ }) {
    const response = await this.app.listFeedback(this.opportunityId, {
      $,
    });
    const feedback = response.data ?? response;
    $.export("$summary", `Retrieved ${feedback.length} feedback form${feedback.length === 1
      ? ""
      : "s"}`);
    return feedback;
  },
};
