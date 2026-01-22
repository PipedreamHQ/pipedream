import pdfApiIo from "../../pdf_api_io.app.mjs";

export default {
  key: "pdf_api_io-list-templates",
  name: "List Templates",
  description: "List all templates of a user on PDF-API.io. [See the documentation](https://pdf-api.io/en/docs/api/templates)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pdfApiIo,
  },
  async run({ $ }) {
    const templates = await this.pdfApiIo.listTemplates({
      $,
    });

    $.export("$summary", `Successfully listed ${templates?.length ?? 0} template${templates?.length === 1
      ? ""
      : "s"}`);

    return templates;
  },
};
