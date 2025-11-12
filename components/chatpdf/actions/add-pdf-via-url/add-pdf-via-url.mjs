import app from "../../chatpdf.app.mjs";

export default {
  key: "chatpdf-add-pdf-via-url",
  name: "Add PDF Via URL",
  description: "Adds a PDF from a publicly accessible URL to ChatPDF, returning a source ID for interactions. [See the documentation](https://www.chatpdf.com/docs/api/backend)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    url: {
      type: "string",
      label: "PDF URL",
      description: "The URL of the publicly accessible PDF",
    },
  },
  methods: {
    addPdfByUrl(args = {}) {
      return this.app.post({
        path: "/sources/add-url",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      addPdfByUrl,
      url,
    } = this;

    const response = await addPdfByUrl({
      $,
      data: {
        url,
      },
    });

    $.export("$summary", `Successfully added PDF with source ID \`${response.sourceId}\``);
    return response;
  },
};
