import crove_app from "../../crove_app.app.mjs";
import { axios } from "@pipedream/platform";

export default {
    key: "crove_app-create-invitation-link",
    name: "Create Invitation Link",
    description: "Create invitation link to fill or sign the document. ",
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
      can_download_document: {
        type: "boolean",
        label: "Can Download Document",
        optional: true
      },
      submission_required: {
        type: "boolean",
        label: "Submission Required",
        optional: true
      }
    },
    async run({ $ }) {
        const api_url = `https://v2.api.crove.app/api/integrations/external/documents/${this.document_id}/document-respondents/create/`;
        var resp = await axios($, {
            url: api_url,
            headers: {
              'X-API-KEY': `${this.crove_app.$auth.api_key}`,
            },
            method: "POST",
            data: {
                can_download_document: this.can_download_document,
                submission_required: this.submission_required,
            }
        });

        var dr_auth_token = resp.auth_token;
        var invitation_link = `https://v2.crove.app/documents/${ this.document_id }/fill/overview?dr_auth_token=${ dr_auth_token }`
        resp.invitation_link = invitation_link;
        return resp;
    },
  };