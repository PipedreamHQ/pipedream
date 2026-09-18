import formIo from "../../form_io.app.mjs";

export default {
  key: "form_io-get-submission",
  name: "Get Submission",
  description: "Retrieve a single submission for a Form.io form. Use **List Forms** to find the form ID and **List Submissions** to find the submission ID. [See the documentation](https://apidocs.form.io/#bc4aaf65-ee01-9c85-005f-ac7b433612d8).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    formIo,
    formId: {
      propDefinition: [
        formIo,
        "formId",
      ],
    },
    submissionId: {
      propDefinition: [
        formIo,
        "submissionId",
      ],
    },
  },
  async run({ $ }) {
    const {
      formId,
      submissionId,
    } = this;

    const response = await this.formIo.getSubmission({
      $,
      formId,
      submissionId,
    });

    $.export("$summary", `Retrieved submission ${response._id}`);
    return response;
  },
};
