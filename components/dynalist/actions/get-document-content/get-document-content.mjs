import { ConfigurationError } from "@pipedream/platform";
import dynalist from "../../dynalist.app.mjs";

export default {
  key: "dynalist-get-document-content",
  name: "Get Document Content",
  description: "Fetches the content of a specific document. [See the documentation](https://apidocs.dynalist.io/#get-content-of-a-document)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dynalist,
    documentId: {
      propDefinition: [
        dynalist,
        "documentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.dynalist.fetchDocumentContent({
      $,
      data: {
        file_id: this.documentId,
      },
    });

    if (response._code != "Ok") {
      throw new ConfigurationError(response._msg);
    }

    $.export("$summary", `Successfully fetched content for document ID ${this.documentId}`);
    return response;
  },
};
