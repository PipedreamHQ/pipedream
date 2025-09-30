import app from "../../chatpdf.app.mjs";

export default {
  key: "chatpdf-delete-pdf",
  name: "Delete PDF",
  description: "Deletes one or more PDFs from ChatPDF using their source IDs. [See the documentation](https://www.chatpdf.com/docs/api/backend)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    sources: {
      type: "string[]",
      label: "Source IDs",
      description: "An array of source IDs of the PDFs to delete",
    },
  },
  methods: {
    deletePdfs(args = {}) {
      return this.app.post({
        path: "/sources/delete",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      deletePdfs,
      sources,
    } = this;

    const response = await deletePdfs({
      $,
      data: {
        sources,
      },
    });

    $.export("$summary", "Successfully deleted PDFs");

    return response || {
      success: true,
    };
  },
};
