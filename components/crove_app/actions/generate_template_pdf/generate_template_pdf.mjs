import croveApp from "../../crove_app.app.mjs";

export default {
  key: "crove_app-generate-template-pdf",
  name: "Generate Document PDF From Template",
  description: "Generate PDF of a document created from the template",
  version: "1.0.1",
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
    background_mode: {
      type: "boolean",
      label: "Background Mode",
      description: "Whether to generate pdf in background mode or not.",
      optional: true,
    },
  },
  async additionalProps() {
    let templateId = this.template_id;
    let config = {
      url: `${this.croveApp._getBaseUrl()}/templates/${templateId}/`,
      method: "GET",
    };
    let resp = await this.croveApp._makeRequest(config);
    let symbolTable = resp.symbol_table;
    let props = {};
    for (var k in symbolTable) {
      props[k] = {
        type: "string",
        label: symbolTable[k].name,
        optional: true,
      };
    }
    return props;
  },
  async run() {

    
    config = {
      url: `${this.croveApp._getBaseUrl()}/templates/${this.template_id}/`,
      method: "GET",
    };

    let resp = await this.croveApp._makeRequest(config);

    let symbolTable = resp.symbol_table;
    let response = {};
    for (var k in symbolTable) {
      response[k] = this[k];
    }

    var config = {
      url: `${this.croveApp._getBaseUrl()}/helpers/generate-pdf-from-template/`,
      method: "POST",
      data: {
        template_id: this.template_id,
        response: response,
        background_mode: this.background_mode
      },
    };

    return await this.croveApp._makeRequest(config);

  },
};
