import canva from "../../canva.app.mjs";

export default {
  key: "canva-export-design",
  name: "Export Design",
  description: "Starts a new job to export a file from Canva. Once the exported file is generated, you can download it using the link(s) provided. The request requires the design ID and the exported file format. [See the documentation](https://www.canva.dev/docs/connect/api-reference/exports/create-design-export-job/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    canva,
    designId: canva.propDefinitions.designId,
    format: canva.propDefinitions.format,
  },
  async run({ $ }) {
    const response = await this.canva.exportDesign({
      designId: this.designId,
      format: this.format,
    });
    $.export("$summary", `Export job started for design ${this.designId} in ${this.format} format`);
    return response;
  },
};
