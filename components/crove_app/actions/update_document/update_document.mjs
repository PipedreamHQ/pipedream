import croveApp from "../../crove_app.app.mjs";

export default {
  key: "crove_app-update-document",
  name: "Update Document",
  description: "Update values of variables of a document.",
  version: "0.0.1",
  type: "action",
  props: {
    croveApp,
    document_id: {
      propDefinition: [
        croveApp,
        "document_id",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    let documentId = this.document_id;
    let config = {
      url: `${this.croveApp._getBaseUrl()}/documents/${documentId}/`,
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
      url: `${this.croveApp._getBaseUrl()}/documents/${this.document_id}/`,
      method: "GET",
    };

    let resp = await this.croveApp._makeRequest(config);

    let symbolTable = resp.symbol_table;
    let response = {};
    for (var k in symbolTable) {
      response[k] = this[k];
    }

    const apiUrl = `${this.croveApp._getBaseUrl()}/documents/${this.document_id}/update-response/`;

    config = {
      url: apiUrl,
      method: "POST",
      data: {
        response: response,
      },
    };

    return await this.croveApp._makeRequest(config);
  },
};
