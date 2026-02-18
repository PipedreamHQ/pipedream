import formcan from "../../formcan.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "formcan-submit-form",
  name: "Submit Form",
  description: "Submits a user-created form in FormCan. [See the documentation](https://api.docs.formcan.com/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    formcan,
    formId: {
      propDefinition: [
        formcan,
        "formId",
      ],
    },
    formData: {
      propDefinition: [
        formcan,
        "formData",
        (c) => ({
          optional: true,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const submissionData = this.formData
      ? {
        submit_data: Object.keys(this.formData).map((key) => ({
          id: key,
          ...(typeof this.formData[key] === "string" || typeof this.formData[key] === "number"
            ? {
              value: this.formData[key],
            }
            : {
              raw: this.formData[key],
            }),
        })),
      }
      : {};

    const response = await this.formcan.submitForm({
      formId: this.formId,
      formData: submissionData,
    });

    $.export("$summary", `Successfully submitted the form with ID ${this.formId}`);
    return response;
  },
};
