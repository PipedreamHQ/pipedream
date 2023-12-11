import gravityForms from "../../gravity_forms.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "gravity_forms-submit-form",
  name: "Submit Form",
  description: "Submits a form entry in Gravity Forms. [See the documentation](https://docs.gravityforms.com/submitting-forms-with-rest-api-v2/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    gravityForms,
    formId: {
      propDefinition: [
        gravityForms,
        "formId",
      ],
    },
    entryData: {
      propDefinition: [
        gravityForms,
        "entryData",
      ],
    },
    fieldValues: {
      propDefinition: [
        gravityForms,
        "fieldValues",
      ],
      optional: true,
    },
    targetPage: {
      propDefinition: [
        gravityForms,
        "targetPage",
      ],
      optional: true,
    },
    sourcePage: {
      propDefinition: [
        gravityForms,
        "sourcePage",
      ],
      optional: true,
    },
    additionalProps: {
      propDefinition: [
        gravityForms,
        "additionalProps",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.gravityForms.submitForm({
      formId: this.formId,
      entryData: this.entryData,
      fieldValues: this.fieldValues,
      targetPage: this.targetPage,
      sourcePage: this.sourcePage,
      additionalProps: this.additionalProps,
    });

    $.export("$summary", `Successfully submitted form with ID: ${this.formId}`);
    return response;
  },
};
