import croveApp from "../../crove_app.app.mjs";

export default {
  key: "crove_app-generate-template-pdf",
  name: "Generate Document PDF From Template",
  description: "Generate PDF of a document created from the template",
  version: "2.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    croveApp,
    template_id: {
      propDefinition: [
        croveApp,
        "template_id",
      ],
      reloadProps: true,
    },
    name: {
      type: "string",
      label: "Document Name",
      description: "Name of the document.",
      optional: true,
    },
    background_mode: {
      type: "boolean",
      label: "Background Mode",
      description: "Whether to generate pdf in background mode or not.",
      optional: true,
    },
  },
  async additionalProps() {
    let resp = await this.croveApp.getTemplateDetails(this.template_id);
    let symbolTable = resp.symbol_table;
    let props = {};
    for (const k in symbolTable) {
      props[k] = {
        type: "string",
        label: symbolTable[k].name,
        optional: true,
      };
    }
    return props;
  },
  async run() {

    let resp = await this.croveApp.getTemplateDetails(this.template_id);

    let symbolTable = resp.symbol_table;
    let response = {};
    for (const k in symbolTable) {
      response[k] = this[k];
    }

    let rsp = await this.croveApp.generatePdfFromTemplate(
      this.template_id,
      this.name,
      response,
      this.background_mode,
    );

    // Removing returned properties that are not interesting for users
    delete rsp.response;
    delete rsp.respondents;
    delete rsp.symbol_table;
    return rsp;
  },
};
