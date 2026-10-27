import docspring from "../../docspring.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "docspring-get-submission-batch",
  name: "Get Submission Batch",
  description: "Get a batch of PDFs and each of its submissions, with their states and PDF links in `files.pdf`."
    + " The batch is finished once `processed_at` is set; `state` is `error` as soon as one submission fails."
    + " Use it after **Generate PDFs in a Batch**."
    + " [See the documentation](https://docspring.com/docs/api/#tag/submissions/get/submissions/batches/{submission_batch_id})",
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
    submissionBatchId: {
      propDefinition: [
        docspring,
        "submissionBatchId",
      ],
    },
    includeData: {
      propDefinition: [
        docspring,
        "includeData",
      ],
    },
  },
  async run({ $ }) {
    const batch = await this.docspring.getSubmissionBatch({
      $,
      submissionBatchId: this.submissionBatchId,
      params: utils.compact({
        include_data: utils.toBoolean(this.includeData, "Include Data") || undefined,
      }),
    });
    $.export("$summary", `Batch ${batch.id} is ${batch.state}: ${batch.total_count - batch.pending_count} of ${batch.total_count} done, ${batch.error_count} failed`);
    return batch;
  },
};
