import { ConfigurationError } from "@pipedream/platform";
import dynalist from "../../dynalist.app.mjs";

export default {
  key: "dynalist-edit-document",
  name: "Edit Document Title",
  description: "Edits the title of a specific document in Dynalist. [See the documentation](https://apidocs.dynalist.io/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    newTitle: {
      type: "string",
      label: "New Title",
      description: "The new title for the document or content",
    },
  },
  async run({ $ }) {
    const response = await this.dynalist.editDocumentTitle({
      $,
      data: {
        changes: [
          {
            action: "edit",
            type: "document",
            file_id: this.documentId,
            title: this.newTitle,
          },
        ],
      },
    });

    if (response._code != "Ok") {
      throw new ConfigurationError(response._msg);
    }

    $.export("$summary", `Successfully updated the document title to "${this.newTitle}"`);
    return response;
  },
};
