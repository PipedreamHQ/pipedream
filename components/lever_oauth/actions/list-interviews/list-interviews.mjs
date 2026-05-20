import app from "../../lever_oauth.app.mjs";

export default {
  key: "lever_oauth-list-interviews",
  name: "List Interviews",
  description:
    "Returns all scheduled interviews for an opportunity."
    + " Use this when asked about a candidate's upcoming interviews, interview history, or to find a panel ID before submitting feedback with **Submit Feedback**."
    + " Each interview record includes the panel ID, subject, interviewers, date/time, and location."
    + " [See the documentation](https://hire.lever.co/developer/documentation#list-all-interviews)",
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
      propDefinition: [
        app,
        "opportunityId",
      ],
      description: "The ID of the opportunity whose interviews to retrieve. Use **Search Opportunities** to find opportunity IDs.",
    },
  },
  async run({ $ }) {
    const response = await this.app.listInterviews(this.opportunityId, {
      $,
    });
    const interviews = response.data ?? response;
    $.export("$summary", `Retrieved ${interviews.length} interview${interviews.length === 1
      ? ""
      : "s"}`);
    return interviews;
  },
};
