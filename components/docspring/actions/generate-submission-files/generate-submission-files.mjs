import { ConfigurationError } from "@pipedream/platform";
import docspring from "../../docspring.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "docspring-generate-submission-files",
  name: "Generate Submission Files",
  description: "Make more files for a processed submission: `png`, an image of each page of its PDF (up to 100 pages)."
    + " Returns the submission, with the images in `files.png`. Use **Generate PDF** with `png` in **Output Formats** to make them with the PDF instead."
    + " [See the documentation](https://docspring.com/docs/api/#tag/submissions/post/submissions/{submission_id}/generate_files)",
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
    submissionId: {
      propDefinition: [
        docspring,
        "submissionId",
      ],
    },
    formats: {
      type: "string[]",
      label: "Formats",
      description: "The files to make: `png` for an image of each page, e.g. `[\"png\"]`.",
      options: [
        {
          label: "PNG page images",
          value: "png",
        },
      ],
      default: [
        "png",
      ],
    },
    wait: {
      propDefinition: [
        docspring,
        "wait",
      ],
      description: "`true` (the default) waits until the files are ready. `false` returns at once: check the file's `state` later with **Get Submission**. e.g. `true`.",
    },
  },
  async run({ $ }) {
    const formats = utils.parseStringArray(this.formats);
    if (!formats) {
      throw new ConfigurationError("Choose at least one format, e.g. `png`");
    }
    const wait = utils.toBoolean(this.wait, "Wait for the PDF") ?? true;
    const submission = await this.docspring.generateSubmissionFiles({
      $,
      submissionId: this.submissionId,
      params: {
        wait,
      },
      data: {
        formats,
      },
    });
    const failure = utils.fileFailureMessage(submission, formats);
    if (failure) {
      throw new Error(failure);
    }
    $.export("$summary", `${wait
      ? "Generated"
      : "Started generating"} ${formats.join(", ")} files for submission ${submission.id}`);
    return submission;
  },
};
