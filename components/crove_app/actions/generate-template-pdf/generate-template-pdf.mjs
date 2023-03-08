import croveApp from "../../crove_app.app.mjs";

export default {
  key: "crove_app-generate-template-pdf",
  name: "Generate Document PDF From Template",
  description: "Generate PDF of a document created from the template",
  version: "2.0.1",
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

    let rsp = this.croveApp.generatePdfFromTemplate(
      this.template_id,
      this.name,
      response,
      this.background_mode,
    );

    // if rsp.response exist delete it
    if (rsp.response) {
      delete rsp.response;
    }
    // if rsp.respondents exist delete it
    if (rsp.respondents) {
      delete rsp.respondents;
    }
    // if rsp.symbol_table exist delete it
    if (rsp.symbol_table) {
      delete rsp.symbol_table;
    }
    return rsp;
  },
};
