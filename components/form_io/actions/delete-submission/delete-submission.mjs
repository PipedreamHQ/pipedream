import formIo from "../../form_io.app.mjs";

export default {
  key: "form_io-delete-submission",
  name: "Delete Submission",
  description: "Permanently delete a submission from a Form.io form. Use **List Submissions** to find the submission ID. This is irreversible. [See the documentation](https://apidocs.form.io/#080c6368-e029-c581-951b-a993bc02578a).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: true,
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

    const response = await this.formIo.deleteSubmission({
      $,
      formId,
      submissionId,
    });

    $.export("$summary", `Deleted submission ${submissionId}`);
    return response;
  },
};
