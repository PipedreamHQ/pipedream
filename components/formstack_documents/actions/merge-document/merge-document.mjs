import formstackDocuments from "../../formstack_documents.app.mjs";

export default {
  key: "formstack_documents-merge-document",
  name: "Merge Document",
  description: "Initiates a merge process using provided data. [See documentation](https://www.webmerge.me/developers?page=documents)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    formstackDocuments,
    documentId: {
      propDefinition: [
        formstackDocuments,
        "documentId",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    const { fields } = await this.formstackDocuments.getDocument({
      documentId: this.documentId,
    });
    for (const field of Object.keys(fields)) {
      props[field] = {
        type: "string",
        label: field,
        description: `${field} value`,
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      key, fields,
    } = await this.formstackDocuments.getDocument({
      documentId: this.documentId,
      $,
    });

    const data = {};
    for (const field of Object.keys(fields)) {
      data[field] = this[field];
    }

    const response = await this.formstackDocuments.mergeDocument({
      documentId: this.documentId,
      documentKey: key,
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully initiated merge of document with ID: ${this.documentId}.`);
    }

    return response;
  },
};
