import docspring from "../../docspring.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "docspring-generate-pdf",
  name: "Generate PDF",
  description: "Fill in a template with your data and generate a PDF. Returns the submission, with the PDF's links in `files.pdf` (`download_url` expires; `permanent_url` doesn't)."
    + " Use **Find Templates** to find the template, **List Template Fields** for its field names, and **Check Data** to test data without making a PDF."
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
    },
  },
  async run({ $ }) {
    const wait = utils.toBoolean(this.wait, "Wait for the PDF") ?? true;
    const submission = await this.docspring.createSubmission({
      $,
      templateId: this.templateId,
      sync: true,
      params: utils.compact({
        version: this.templateVersion,
        wait,
      }),
      data: utils.compact({
        data: utils.parseObject(this.data, "Data") || {},
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
      ? `Generated PDF for submission ${submission.id} (${submission.state})`
      : `Created submission ${submission.id} (${submission.state})`);
    return submission;
  },
};
