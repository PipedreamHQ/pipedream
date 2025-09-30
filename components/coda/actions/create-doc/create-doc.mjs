import coda from "../../coda.app.mjs";

export default {
  key: "coda-create-doc",
  name: "Create Doc",
  description: "Creates a new doc. [See docs](https://coda.io/developers/apis/v1#operation/createDoc)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    coda,
    title: {
      propDefinition: [
        coda,
        "title",
      ],
    },
    folderId: {
      propDefinition: [
        coda,
        "folderId",
      ],
      description: "The folder within which to create this doc",
    },
  },
  async run({ $ }) {
    let data = {
      title: this.title,
      folderId: this.folderId,
    };

    let response = await this.coda.createDoc($, data);
    $.export("$summary", `Created doc "${response.name}" in folderId: "${response.folderId}" and workspaceId: "${response.workspaceId}"`);
    return response;
  },
};
