import pdffiller from "../../pdffiller.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "pdffiller-find-document",
  name: "Find Document",
  description: "Enables searching capabilities for documents by name. [See the documentation](https://pdffiller.readme.io/reference/get_v2-templates)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    pdffiller,
    name: {
      propDefinition: [
        pdffiller,
        "name",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.pdffiller.searchDocumentsByName({
      name: this.name,
    });
    $.export("$summary", `Found ${response.length} document(s) with the name "${this.name}"`);
    return response;
  },
};
