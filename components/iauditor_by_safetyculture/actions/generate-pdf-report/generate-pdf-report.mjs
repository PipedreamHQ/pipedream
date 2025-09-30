import safetyculture from "../../iauditor_by_safetyculture.app.mjs";

export default {
  key: "iauditor_by_safetyculture-generate-pdf-report",
  name: "Generate PDF Report",
  description: "Retrieve the web report link for the specified inspection. This will return the existing link if one has been generated before, or generate a new one if one does not exist already. [See the documentation](https://developer.safetyculture.com/reference/thepubservice_getinspectionwebreportlink)",
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
  },
  async run({ $ }) {
    const response = await this.safetyculture.generatePdfReport({
      inspectionId: this.inspectionId,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully generated PDF report for inspection with ID ${this.inspectionId}.`);
    }

    return response;
  },
};
