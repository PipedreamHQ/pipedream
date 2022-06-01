import croveApp from "../../crove_app.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "crove_app-create-document",
  name: "Create Document",
  description: "Create a new document.",
  version: "0.0.1",
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
  async run({ $ }) {
    const apiUrl = "https://v2.api.crove.app/api/integrations/external/documents/create/";
    return await axios($, {
      url: apiUrl,
      headers: {
        "X-API-KEY": `${this.croveApp.$auth.api_key}`,
      },
      method: "POST",
      data: {
        name: this.name,
        template_id: this.template_id,
      },
    });
  },
};
