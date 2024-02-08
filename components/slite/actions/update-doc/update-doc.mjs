import slite from "../../slite.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "slite-update-doc",
  name: "Update Document Section",
  description: "Modifies a specific section of a Slite document. [See the documentation](https://slite.com/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    slite,
    docId: {
      propDefinition: [
        slite,
        "docId",
      ],
    },
    updateData: {
      propDefinition: [
        slite,
        "updateData",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.slite.modifyDocumentSection({
      docId: this.docId,
      updateData: this.updateData,
    });

    $.export("$summary", `Updated document section with ID: ${this.docId}`);
    return response;
  },
};
