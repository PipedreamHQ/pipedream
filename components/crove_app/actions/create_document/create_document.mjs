import crove_app from "../../crove_app.app.mjs";
import { axios } from "@pipedream/platform";

export default {
    key: "crove_app_create_document",
    name: "Create Document",
    description: "Create a new document.",
    version: "0.0.2",
    type: "action",
    props: {
      crove_app,
      name: {
        type: "string",
        label: "Name",
      },
      template_id: {
        type: "string",
        label: "Template ID",
        async options({ $ }){
            var resp = await axios($, {
                url: "https://v2.api.crove.app/api/integrations/external/templates/?limit=50",
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
      }
    },
    async run({ $ }) {
        const api_url = `https://v2.api.crove.app/api/integrations/external/documents/create/`;
        return await axios($, {
            url: api_url,
            headers: {
              'X-API-KEY': `${this.crove_app.$auth.api_key}`,
            },
            method: "POST",
            data: {
                name: this.name,
                template_id: this.template_id,
            }
        });
    },
  };