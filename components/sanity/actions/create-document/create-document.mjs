import sanity from "../../sanity.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "sanity-create-document",
  name: "Create Document",
  description: "Create a document in a dataset in Sanity. [See the documentation](https://www.sanity.io/docs/http-reference/actions)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    sanity,
    dataset: {
      propDefinition: [
        sanity,
        "dataset",
      ],
    },
    documentId: {
      type: "string",
      label: "Document ID",
      description: "A unique identifier for the document to create",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of document to create. Example: `post`",
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "Additional fields to add to the document. Example: `{\"title\":\"My First Post\",\"slug\":{\"current\":\"my-first-post\"},\"body\":[{\"_type\":\"block\",\"children\":[{\"_type\":\"span\",\"text\":\"Hello world!\"}]}]}`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.sanity.createDocument({
      $,
      dataset: this.dataset,
      data: {
        actions: [
          {
            actionType: "sanity.action.document.create",
            publishedId: this.documentId,
            document: {
              _id: `drafts.${this.documentId}`,
              _type: this.type,
              ...parseObject(this.additionalFields),
            },
          },
        ],
      },
    });

    $.export("$summary", "Successfully created document");
    return response;
  },
};
