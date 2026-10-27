import docspring from "../../docspring.app.mjs";

export default {
  key: "docspring-get-submission",
  name: "Get Submission",
  description: "Get a submission with its data, state, signature requests and files. The PDF's links are in `files.pdf` once `state` is `processed`"
    + " (`download_url` expires; `permanent_url` doesn't). Use **Find Submissions** to find submissions without an ID."
    + " [See the documentation](https://docspring.com/docs/api/#tag/submissions/get/submissions/{submission_id})",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    const submission = await this.docspring.getSubmission({
      $,
      submissionId: this.submissionId,
    });
    $.export("$summary", `Submission ${submission.id} is ${submission.state}`);
    return submission;
  },
};
