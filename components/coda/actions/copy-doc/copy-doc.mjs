import coda from "../../coda.app.mjs";

export default {
  key: "coda-copy-doc",
  name: "Copy Doc",
  description: "Creates a copy of the specified doc. [See docs](https://coda.io/developers/apis/v1#operation/createDoc)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    coda,
    docId: {
      propDefinition: [
        coda,
        "docId",
      ],
      label: "Source Doc ID",
      description: "The doc from which to create a copy",
    },
    title: {
      propDefinition: [
        coda,
        "title",
      ],
      description: "Title of the newly copied doc. Defaults to `\"Copy of <originalTitle>\"`",
    },
    folderId: {
      propDefinition: [
        coda,
        "folderId",
      ],
      description: "The folder within which to copy this doc",
    },
  },
  async run({ $ }) {
    let data = {
      title: this.title,
      folderId: this.folderId,
      sourceDoc: this.docId,
    };

    let response = await this.coda.createDoc($, data);
    $.export("$summary", `Copied to new doc "${response.name}" in folderId: "${response.folderId}" and workspaceId: "${response.workspaceId}"`);
    return response;
  },
};
