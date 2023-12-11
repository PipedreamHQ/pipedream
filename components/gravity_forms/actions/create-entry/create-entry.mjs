import gravityForms from "../../gravity_forms.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "gravity_forms-create-entry",
  name: "Create Entry",
  description: "Creates a new entry in a Gravity Forms form. [See the documentation](https://docs.gravityforms.com/creating-entries-with-the-rest-api-v2/)",
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
    const response = await this.gravityForms.createEntry({
      formId: this.formId,
      entryData: this.entryData,
      additionalProps: {
        ...(this.fieldValues && {
          field_values: this.fieldValues,
        }),
        ...(this.targetPage && {
          target_page: this.targetPage,
        }),
        ...(this.sourcePage && {
          source_page: this.sourcePage,
        }),
        ...this.additionalProps,
      },
    });

    $.export("$summary", `Successfully created an entry in form ${this.formId}`);
    return response;
  },
};
