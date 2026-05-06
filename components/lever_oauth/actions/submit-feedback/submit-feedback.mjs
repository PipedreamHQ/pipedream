import app from "../../lever_oauth.app.mjs";

export default {
  key: "lever_oauth-submit-feedback",
  name: "Submit Feedback",
  description:
    "Submits an interview feedback form (scorecard) for an opportunity."
    + " Use this after an interview to record the interviewer's assessment."
    + " `baseTemplateId` is required — it identifies which feedback form template to submit against. Template IDs come from your Lever account's feedback templates."
    + " `panel` and `interview` are optional but linked: if you specify one, you must specify the other. Use **List Interviews** to find panel and interview IDs."
    + " Use **List Feedback** to check if feedback has already been submitted for this panel."
    + " `fieldValues` is a JSON array of `{\"id\": \"<field_id>\", \"value\": \"<answer>\"}` objects. Field IDs and valid values come from the feedback form template."
    + " Perform As is required — feedback is attributed to this user. Use **List Users** to find user IDs."
    + " [See the documentation](https://hire.lever.co/developer/documentation#create-a-feedback-form)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    opportunityId: {
      type: "string",
      label: "Opportunity ID",
      description: "The ID of the opportunity. Use **Search Opportunities** to find opportunity IDs.",
    },
    performAs: {
      type: "string",
      label: "Perform As (User ID)",
      description: "User ID of the interviewer submitting feedback — feedback is attributed to this user. Use **List Users** to find user IDs.",
    },
    baseTemplateId: {
      type: "string",
      label: "Feedback Template ID",
      description: "UID of the feedback form template to submit. Obtain from your Lever account's feedback template list.",
    },
    panelId: {
      type: "string",
      label: "Panel ID",
      description: "Interview panel UID. Required if Interview ID is specified. Use **List Interviews** to find panel IDs.",
      optional: true,
    },
    interviewId: {
      type: "string",
      label: "Interview ID",
      description: "Interview UID within the panel. Required if Panel ID is specified. Use **List Interviews** to find interview IDs.",
      optional: true,
    },
    fieldValues: {
      type: "string",
      label: "Field Values (JSON)",
      description: "JSON array of field responses. Each item must have an `id` (field UID from the template) and a `value`. Example: `[{\"id\": \"abc123\", \"value\": \"Strong communicator\"}, {\"id\": \"def456\", \"value\": \"3 - Hire\"}]`",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      perform_as: this.performAs,
    };

    const body = {
      baseTemplateId: this.baseTemplateId,
    };
    if (this.panelId) body.panel = this.panelId;
    if (this.interviewId) body.interview = this.interviewId;
    if (this.fieldValues) body.fieldValues = JSON.parse(this.fieldValues);

    const response = await this.app.submitFeedback(this.opportunityId, {
      $,
      params,
      data: body,
    });
    const result = response.data ?? response;
    $.export("$summary", `Submitted feedback for opportunity ${this.opportunityId}`);
    return result;
  },
};
