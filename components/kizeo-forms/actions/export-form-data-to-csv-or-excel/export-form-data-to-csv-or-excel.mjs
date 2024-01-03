import kizeoForms from "../../kizeo-forms.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "kizeo-forms-export-form-data-to-csv-or-excel",
  name: "Export Form Data to CSV or Excel",
  description: "Exports data from a form to CSV or Excel format. [See the documentation](https://kizeo.github.io/kizeo-forms-documentations/docs/en/exports)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    kizeoForms,
    formId: {
      propDefinition: [
        kizeoForms,
        "formId",
      ],
    },
    format: {
      propDefinition: [
        kizeoForms,
        "format",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.kizeoForms.exportFormData({
      formId: this.formId,
      format: this.format,
    });

    $.export("$summary", `Successfully exported form data to ${this.format.toUpperCase()} format`);
    return response;
  },
};
