import slite from "../../slite.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "slite-create-doc",
  name: "Create Document in Slite",
  description: "Creates a new document within a chosen parent document or private channel. [See the documentation](https://slite.com/api)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    slite,
    parentId: {
      propDefinition: [
        slite,
        "parentId",
      ],
    },
    docTitle: {
      propDefinition: [
        slite,
        "docTitle",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.slite.createDocument({
      parentId: this.parentId,
      docTitle: this.docTitle,
    });

    $.export("$summary", `Successfully created document '${this.docTitle}'`);
    return response;
  },
};
