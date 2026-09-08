import formIo from "../../form_io.app.mjs";
import { parseJson } from "../../common/utils.mjs";

export default {
  key: "form_io-update-submission",
  name: "Update Submission",
  description: "Update a submission for a Form.io form. Only the fields you provide are changed; omitted fields keep their current values. Use **List Submissions** to find the submission ID. The `data` prop is a JSON-string object of field key-value pairs. [See the documentation](https://apidocs.form.io/#fa874508-bff1-1047-a504-d3831576df00).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
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
    data: {
      type: "string",
      label: "Data",
      description: "JSON-string object of the submission's data payload. Example: `{\"name\":\"Jane Doe\",\"email\":\"jane.doe@example.com\"}`. Parsed with JSON.parse() before sending.",
    },
    state: {
      type: "string",
      label: "State",
      description: "Submission state. One of `submitted` or `draft`.",
      optional: true,
      options: [
        "submitted",
        "draft",
      ],
    },
  },
  async run({ $ }) {
    const {
      formId,
      submissionId,
      data,
      state,
    } = this;

    const response = await this.formIo.updateSubmission({
      $,
      formId,
      submissionId,
      data: {
        data: parseJson(data, "data"),
        state,
      },
    });

    $.export("$summary", `Updated submission ${response._id}`);
    return response;
  },
};
