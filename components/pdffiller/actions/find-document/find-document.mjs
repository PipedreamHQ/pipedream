import pdffiller from "../../pdffiller.app.mjs";

export default {
  key: "pdffiller-find-document",
  name: "Find Document",
  description: "Enables searching capabilities for documents by name. [See the documentation](https://pdffiller.readme.io/reference/get_v2-templates)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pdffiller,
    alert: {
      type: "alert",
      alertType: "info",
      content: "You can use exact name of a file or with asterisks. For example, file*.doc will match file1.doc and file_test.pdf.",
    },
    name: {
      propDefinition: [
        pdffiller,
        "name",
      ],
    },
    folderId: {
      propDefinition: [
        pdffiller,
        "folderId",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const responseTemp = this.pdffiller.paginate({
      fn: this.pdffiller.listDocuments,
      params: {
        folder_id: this.folderId,
        name: this.name,
      },
    });

    const responseArray = [];
    for await (const item of responseTemp) {
      responseArray.push(item);
    }

    $.export("$summary", `Found ${responseArray.length} document(s) with the name "${this.name}"`);
    return responseArray;
  },
};
