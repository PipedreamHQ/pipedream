import croveApp from "../../crove_app.app.mjs";

export default {
  key: "crove_app-generate-template-pdf",
  name: "Generate Document PDF From Template",
  description: "Generate PDF of a document created from the template",
  version: "0.0.1",
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

    var config = {
      url: `${this.croveApp._getBaseUrl()}/documents/create/`,
      method: "POST",
      data: {
        template_id: this.template_id,
      },
    };

    let resp = await this.croveApp._makeRequest(config);

    let documentId = resp.id;

    config = {
      url: `${this.croveApp._getBaseUrl()}/templates/${this.template_id}/`,
      method: "GET",
    };

    resp = await this.croveApp._makeRequest(config);

    let symbolTable = resp.symbol_table;
    let response = {};
    for (var k in symbolTable) {
      response[k] = this[k];
    }

    const apiUrl = `${this.croveApp._getBaseUrl()}/documents/${documentId}/update-response/`;

    config = {
      url: apiUrl,
      method: "POST",
      data: {
        response: response,
      },
    };

    resp =  await this.croveApp._makeRequest(config);

    config = {
      url: `${this.croveApp._getBaseUrl()}/documents/${ documentId }/submit-response/`,
      method: "POST",
    };

    resp =  await this.croveApp._makeRequest(config);

    config = {
      url: `${this.croveApp._getBaseUrl()}/documents/${ documentId }/generate-pdf/`,
      method: "POST",
      data: {
        background_mode: false,
      },
    };

    resp =  await this.croveApp._makeRequest(config);

    return resp;

  },
};
