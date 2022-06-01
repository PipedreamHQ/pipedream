import croveApp from "../../crove_app.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "crove_app-create-invitation-link",
  name: "Create Invitation Link",
  description: "Create invitation link to fill or sign the document. ",
  version: "0.0.1",
  type: "action",
  props: {
    croveApp,
    document_id: {
      type: "string",
      label: "Document ID",
      description: "Document ID of document for which invitation link is to be created.",
      async options({ $ }) {
        var resp = await axios($, {
          url: "https://v2.api.crove.app/api/integrations/external/documents/?limit=50",
          headers: {
            "X-API-KEY": `${this.croveApp.$auth.api_key}`,
          },
          method: "GET",
        });
        resp = resp.results;
        return resp.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    can_download_document: {
      type: "boolean",
      label: "Can Download Document",
      description: "If document can be downloaded or not.",
      optional: true,
    },
    submission_required: {
      type: "boolean",
      label: "Submission Required",
      description: "If submission is required or not.",
      optional: true,
    },
  },
  async run({ $ }) {
    const apiUrl = `https://v2.api.crove.app/api/integrations/external/documents/${this.document_id}/document-respondents/create/`;
    var resp = await axios($, {
      url: apiUrl,
      headers: {
        "X-API-KEY": `${this.croveApp.$auth.api_key}`,
      },
      method: "POST",
      data: {
        can_download_document: this.can_download_document,
        submission_required: this.submission_required,
      },
    });

    var drAuthToken = resp.auth_token;
    var invitationLink = `https://v2.crove.app/documents/${ this.document_id }/fill/overview?dr_auth_token=${ drAuthToken }`;
    resp.invitation_link = invitationLink;
    return resp;
  },
};
