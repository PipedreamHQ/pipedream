import canva from "../../canva.app.mjs";
import { axios } from "@pipedream/platform";
import fs from "fs";

export default {
  key: "canva-create-design-import-job",
  name: "Create Design Import Job",
  description: "Starts a new job to import an external file as a new design in Canva. [See the documentation](https://www.canva.dev/docs/connect/api-reference/design-imports/create-design-import-job/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    canva,
    externalFile: {
      type: "string",
      label: "External File",
      description: "The path to the external file to import as a new design",
      optional: false,
    },
    importMetadata: {
      type: "object",
      label: "Import Metadata",
      description: "The metadata about the import",
      optional: false,
    },
  },
  async run({ $ }) {
    const file = fs.readFileSync(this.externalFile);
    const response = await this.canva.importDesign({
      externalFile: file,
      importMetadata: this.importMetadata,
    });
    $.export("$summary", "Successfully started design import job");
    return response;
  },
};
