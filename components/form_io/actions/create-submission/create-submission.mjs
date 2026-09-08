import formIo from "../../form_io.app.mjs";
import { parseJson } from "../../common/utils.mjs";

export default {
  key: "form_io-create-submission",
  name: "Create Submission",
  description: "Create a submission for a Form.io form. Use **List Forms** to find the form ID. The `data` prop is a JSON-string object of field key-value pairs matching the form's component keys. [See the documentation](https://apidocs.form.io/#fe0e1c46-ec0b-9141-fa11-db6e165fdcbd).",
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
    data: {
      type: "string",
      label: "Data",
      description: "JSON-string object of the submission's data payload. Example: `{\"name\":\"Jane Doe\",\"email\":\"jane@example.com\"}`. Parsed with JSON.parse() before sending.",
    },
  },
  async run({ $ }) {
    const {
      formId,
      data,
    } = this;

    const response = await this.formIo.createSubmission({
      $,
      formId,
      data: {
        data: parseJson(data, "data"),
      },
    });

    $.export("$summary", `Created submission ${response._id} for form ${formId}`);
    return response;
  },
};
