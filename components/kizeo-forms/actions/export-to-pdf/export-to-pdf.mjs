import kizeoForms from "../../kizeo-forms.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "kizeo-forms-export-to-pdf",
  name: "Export to PDF",
  description: "Exports data from a chosen export (Word or Excel) to PDF format. [See the documentation](https://kizeo.github.io/kizeo-forms-documentations/docs/en/restv3)",
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
    exportId: {
      propDefinition: [
        kizeoForms,
        "exportId",
      ],
    },
    dataId: {
      propDefinition: [
        kizeoForms,
        "dataId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.kizeoForms.exportDataToPdf({
      formId: this.formId,
      exportId: this.exportId,
      dataId: this.dataId,
    });

    $.export("$summary", `Exported data to PDF with data ID ${this.dataId}`);
    return response;
  },
};
