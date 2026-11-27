import docspring from "../../docspring.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "docspring-create-submission",
  name: "Create Submission",
  description: "Fill in a template with your data and make a submission: a PDF, or a Word template's Word document or OpenDocument file. Returns the submission, with the PDF's links in `files.pdf` (`download_url` expires; `permanent_url` doesn't)."
    + " A Word template can also make its Word document and an OpenDocument file (**Output Formats**), in `files.docx` and `files.odt`."
    + " Use **Find Templates** to find the template, **List Template Fields** for its field names, and **Check Data** to test data without making anything."
    + " Invalid data fails with each problem listed. For people who fill in or sign the PDF, use **Create Signature Request** instead."
    + " [See the documentation](https://docspring.com/docs/api/#tag/submissions/post/templates/{template_id}/submissions)",
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
    templateId: {
      propDefinition: [
        docspring,
        "templateId",
      ],
    },
    templateVersion: {
      propDefinition: [
        docspring,
        "templateVersion",
      ],
    },
    data: {
      propDefinition: [
        docspring,
        "data",
      ],
    },
    dataJson: {
      propDefinition: [
        docspring,
        "dataJson",
      ],
    },
    test: {
      propDefinition: [
        docspring,
        "test",
      ],
    },
    metadata: {
      propDefinition: [
        docspring,
        "metadata",
      ],
    },
    outputFormats: {
      propDefinition: [
        docspring,
        "outputFormats",
      ],
    },
    password: {
      propDefinition: [
        docspring,
        "password",
      ],
      description: "A password the PDF needs to be opened with, e.g. `s3cret-pass`. It's never returned."
        + " A submission with a password can't make a Word document or OpenDocument file.",
    },
    expiresIn: {
      propDefinition: [
        docspring,
        "expiresIn",
      ],
    },
    fieldOverrides: {
      propDefinition: [
        docspring,
        "fieldOverrides",
      ],
    },
    editable: {
      propDefinition: [
        docspring,
        "editable",
      ],
    },
    wait: {
      propDefinition: [
        docspring,
        "wait",
      ],
      label: "Wait for the Submission",
      description: "`true` (the default) waits until the submission is ready and returns it in its final state."
        + " `false` returns at once with a pending submission: get it later with **Get Submission** or the **New Event (Instant)** trigger. e.g. `true`.",
    },
  },
  async run({ $ }) {
    const wait = utils.toBoolean(this.wait, "Wait for the Submission") ?? true;
    const submission = await this.docspring.createSubmission({
      $,
      templateId: this.templateId,
      sync: true,
      params: utils.compact({
        version: this.templateVersion,
        wait,
      }),
      data: utils.compact({
        data: utils.submissionData(this.data, this.dataJson) || {},
        test: utils.toBoolean(this.test, "Test") || undefined,
        metadata: utils.parseObject(this.metadata, "Metadata"),
        output_formats: utils.parseStringArray(this.outputFormats),
        password: this.password,
        expires_in: utils.toInteger(this.expiresIn, "Expires In"),
        field_overrides: utils.parseObject(this.fieldOverrides, "Field Overrides"),
        editable: utils.toBoolean(this.editable, "Editable"),
      }),
    });
    const failure = utils.failureMessage("submission", submission);
    if (failure) {
      throw new Error(failure);
    }
    $.export("$summary", wait
      ? `Created submission ${submission.id} (${submission.state})`
      : `Created submission ${submission.id} (${submission.state})`);
    return submission;
  },
};
