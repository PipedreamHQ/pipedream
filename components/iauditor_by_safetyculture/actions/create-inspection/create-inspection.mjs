import safetyculture from "../../iauditor_by_safetyculture.app.mjs";

export default {
  key: "iauditor_by_safetyculture-create-inspection",
  name: "Create Inspection",
  description: "Create a new inspection in iAuditor by SafetyCulture. [See the documentation](https://developer.safetyculture.com/reference/thepubservice_startinspection)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    safetyculture,
    templateId: {
      propDefinition: [
        safetyculture,
        "templateId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.safetyculture.createInspection({
      data: {
        template_id: this.templateId,
      },
      $,
    });

    if (response?.audit_id) {
      $.export("$summary", `Successfully created inspection with ID ${response?.audit_id}.`);
    }

    return response;
  },
};
