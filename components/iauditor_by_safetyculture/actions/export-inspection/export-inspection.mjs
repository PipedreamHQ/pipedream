import safetyculture from "../../iauditor_by_safetyculture.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "iauditor_by_safetyculture-export-inspection",
  name: "Export Inspection to PDF or Word",
  description: "Retrieve an inspection report formatted as a PDF or Word (docx) document.[See the documentation](https://developer.safetyculture.com/reference/reportsservice_startinspectionexport)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    safetyculture,
    inspectionId: {
      propDefinition: [
        safetyculture,
        "inspectionId",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "The document type",
      options: constants.EXPORT_TYPES,
    },
  },
  async run({ $ }) {
    const response = await this.safetyculture.exportInspection({
      data: {
        export_data: [
          {
            inspection_id: this.inspectionId,
          },
        ],
        type: this.type,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully exported inspection with ID ${this.inspectionId}.`);
    }

    return response;
  },
};
