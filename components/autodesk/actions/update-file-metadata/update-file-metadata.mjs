import autodesk from "../../autodesk.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "autodesk-update-file-metadata",
  name: "Update File Metadata",
  description: "Updates metadata for an existing file in Autodesk. [See the documentation](https://aps.autodesk.com/developer/documentation)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    autodesk,
    fileId: {
      propDefinition: [
        autodesk,
        "fileId",
      ],
    },
    metadata: {
      propDefinition: [
        autodesk,
        "metadata",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.autodesk.updateMetadata();
    $.export("$summary", `Updated metadata for file ${this.fileId}`);
    return response;
  },
};
