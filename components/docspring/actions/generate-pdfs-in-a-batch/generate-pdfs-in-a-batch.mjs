import { ConfigurationError } from "@pipedream/platform";
import docspring from "../../docspring.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "docspring-generate-pdfs-in-a-batch",
  name: "Generate PDFs in a Batch",
  description: "Generate up to 50 PDFs in one request, from one template or several. Returns the batch with each of its `submissions`, and their PDF links in `files.pdf`."
    + " Each submission takes the inputs of **Generate PDF** as JSON (`data`, `metadata`, `field_overrides`, `test`, `editable`, `password`, `output_formats`, `expires_in`),"
    + " plus `template_id` and `template_version` to use another template than the batch's."
    + " Use **Get Submission Batch** to check on a batch later."
    + " [See the documentation](https://docspring.com/docs/api/#tag/submissions/post/submissions/batches)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    docspring,
    submissions: {
      type: "string[]",
      label: "Submissions",
      description: "The PDFs to generate, up to 50. Each item is a JSON object, e.g. `{\"data\": {\"first_name\": \"Jane\"}, \"metadata\": {\"order_id\": \"1234\"}}`."
        + " One item can also be a JSON array of them, e.g. `[{\"data\": {\"first_name\": \"Jane\"}}, {\"data\": {\"first_name\": \"Joe\"}}]`.",
    },
    templateId: {
      propDefinition: [
        docspring,
        "templateId",
      ],
      description: "The template for each submission that doesn't name its own `template_id`, e.g. `tpl_1234567890abcdef01`."
        + " Use **Find Templates** to find it (the `id` field).",
      optional: true,
    },
    templateVersion: {
      propDefinition: [
        docspring,
        "templateVersion",
      ],
      description: "The template version for each submission that doesn't name its own `template_version`:"
        + " a published version such as `1.2.0` (or `1` for the latest 1.x.x), `latest` or `draft`, e.g. `draft`."
        + " Leave blank for the latest published version (the draft when none has been published).",
    },
    test: {
      propDefinition: [
        docspring,
        "test",
      ],
      description: "`true` makes free test PDFs with a watermark for each submission that doesn't set its own `test`."
        + " `false` (the default) makes live PDFs, which use credits. e.g. `true`.",
    },
    metadata: {
      propDefinition: [
        docspring,
        "metadata",
      ],
      description: "Your own data to store with the batch, such as an ID from your app, e.g. `{\"import_id\": \"42\"}`.",
    },
    outputFormats: {
      propDefinition: [
        docspring,
        "outputFormats",
      ],
      description: "What to make for each submission that doesn't set its own `output_formats`: `pdf`, and `png` for an image of each page,"
        + " e.g. `[\"pdf\", \"png\"]`. Leave blank for just the PDF.",
    },
    wait: {
      propDefinition: [
        docspring,
        "wait",
      ],
      description: "`true` (the default) waits until every PDF in the batch is ready. `false` returns at once with a pending batch:"
        + " get it later with **Get Submission Batch** or the **New Event (Instant)** trigger. e.g. `true`.",
    },
  },
  async run({ $ }) {
    const submissions = utils.parseObjectArray(this.submissions, "Submissions");
    if (!submissions) {
      throw new ConfigurationError("Add at least one submission, e.g. `{\"data\": {\"first_name\": \"Jane\"}}`");
    }
    const wait = utils.toBoolean(this.wait, "Wait for the PDF") ?? true;
    const batch = await this.docspring.createSubmissionBatch({
      $,
      params: {
        wait,
      },
      data: utils.compact({
        template_id: this.templateId,
        template_version: this.templateVersion,
        test: utils.toBoolean(this.test, "Test") || undefined,
        metadata: utils.parseObject(this.metadata, "Metadata"),
        output_formats: utils.parseStringArray(this.outputFormats),
        submissions,
      }),
    });
    const failure = utils.failureMessage("submission_batch", batch);
    if (failure) {
      throw new Error(failure);
    }
    $.export("$summary", `Generated batch ${batch.id} with ${batch.total_count} submission(s) (${batch.state})`);
    return batch;
  },
};
