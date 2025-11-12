import croveApp from "../../crove_app.app.mjs";

export default {
  key: "crove_app-create-document",
  name: "Create Document",
  description: "Create a new document.",
  version: "1.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    croveApp,
    name: {
      type: "string",
      label: "Name",
      description: "Name of document",
    },
    template_id: {
      propDefinition: [
        croveApp,
        "template_id",
      ],
    },
  },
  async run() {
    const apiUrl = `${this.croveApp._getBaseUrl()}/documents/create/`;
    const config = {
      url: apiUrl,
      method: "POST",
      data: {
        name: this.name,
        template_id: this.template_id,
      },
    };
    let response = await this.croveApp._makeRequest(config);

    // Removing returned properties that are not interesting for users
    delete response.response;
    delete response.respondents;
    delete response.symbol_table;
    return response;
  },
};
