import croveApp from "../../crove_app.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "crove_app-generate-pdf-from-document",
  name: "Generate PDF from Document",
  description: "Generate PDF of a document and return PDF URL.",
  version: "0.0.1",
  type: "action",
  props: {
    croveApp,
    document_id: {
      propDefinition: [
        croveApp,
        "document_id",
      ],
    },
    background_mode: {
      type: "boolean",
      label: "Background Mode",
      description: "Weather to generate pdf in background mode or not.",
      optional: true,
    },
  },
  async run({ $ }) {
    const apiUrl = `https://v2.api.crove.app/api/integrations/external/documents/${this.document_id}/generate-pdf/`;
    return await axios($, {
      url: apiUrl,
      headers: {
        "X-API-KEY": `${this.croveApp.$auth.api_key}`,
      },
      method: "POST",
      data: {
        background_mode: this.background_mode,
      },
    });
  },
};
