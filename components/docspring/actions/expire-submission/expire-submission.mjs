import docspring from "../../docspring.app.mjs";

export default {
  key: "docspring-expire-submission",
  name: "Expire Submission",
  description: "Expire a submission now: delete its data and files for good. The submission's ID, state and metadata stay, with `expired` set to `true`."
    + " Returns the expired submission. Use **Find Submissions** to find the submission."
    + " [See the documentation](https://docspring.com/docs/api/#tag/submissions/delete/submissions/{submission_id})",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    docspring,
    submissionId: {
      propDefinition: [
        docspring,
        "submissionId",
      ],
    },
  },
  async run({ $ }) {
    const submission = await this.docspring.expireSubmission({
      $,
      submissionId: this.submissionId,
    });
    $.export("$summary", `Expired submission ${submission.id}`);
    return submission;
  },
};
