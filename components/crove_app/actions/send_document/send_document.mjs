import crove_app from "../../crove_app.app.mjs";
import { axios } from "@pipedream/platform";

export default {
    key: "crove_app_send_document",
    name: "Send Document",
    description: "Send email invitation link to fill & sign the document.  ",
    version: "0.0.1",
    type: "action",
    props: {
      crove_app,
      document_id: {
        type: "string",
        label: "Document ID",
        async options({ $ }){
            var resp = await axios($, {
                url: "https://v2.api.crove.app/api/integrations/external/documents/?limit=50",
                headers: {
                    'X-API-KEY': `${this.crove_app.$auth.api_key}`,
                },
                method: "GET"
            });
            resp = resp.results;
            return resp.map((item) => ({
                label: item.name,
                value: item.id,
            }));
        }
      },
      email: {
        type: "string",
        label: "Email",
      },
      message: {
        type: "string",
        label: "Message",
        optional: true
      }
    },
    async run({ $ }) {
        const api_url = `https://v2.api.crove.app/api/integrations/external/documents/${this.document_id}/email-invites/create/`;
        return await axios($, {
            url: api_url,
            headers: {
              'X-API-KEY': `${this.crove_app.$auth.api_key}`,
            },
            method: "POST",
            data: {
                email: this.email,
                message: this.message,
            }
        });
    },
  };