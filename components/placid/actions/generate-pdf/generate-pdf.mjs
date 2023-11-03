import placid from "../../placid.app.mjs";

export default {
  key: "placid-generate-pdf",
  name: "Generate PDF",
  description: "Creates a new PDF based on a specified template. [See the documentation](https://placid.app/docs/2.0/rest/pdfs)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    placid,
    templateId: {
      propDefinition: [
        placid,
        "templateId",
      ],
    },
    layers: {
      type: "object",
      label: "Layers",
      description: "The layers of the template",
    },
  },
  async run({ $ }) {
    const response = await this.placid.createPdf({
      templateId: this.templateId,
      layers: this.layers,
    });
    $.export("$summary", `Successfully created PDF with ID: ${response.id}`);
    return response;
  },
};
