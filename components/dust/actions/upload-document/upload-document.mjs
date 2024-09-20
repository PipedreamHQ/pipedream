import dust from "../../dust.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "dust-upload-document",
  name: "Upload Document",
  description: "Adds a document to a chosen Dust data source or folder. [See the documentation](https://docs.dust.tt/reference/post_api-v1-w-wid-data-sources-name-documents-documentid)",
  version: "0.0.1",
  type: "action",
  props: {
    dust,
    document: {
      propDefinition: [
        dust,
        "document",
      ],
    },
    destination: {
      propDefinition: [
        dust,
        "destination",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dust.upsertDocument({
      document: this.document,
      destination: this.destination,
    });

    $.export("$summary", `Successfully uploaded document to destination ${this.destination}`);
    return response;
  },
};
