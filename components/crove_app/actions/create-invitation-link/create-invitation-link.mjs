import croveApp from "../../crove_app.app.mjs";

export default {
  key: "crove_app-create-invitation-link",
  name: "Create Invitation Link",
  description: "Create invitation link to fill or sign the document. ",
  version: "1.0.1",
  type: "action",
  props: {
    croveApp,
    document_id: {
      propDefinition: [
        croveApp,
        "document_id",
      ],
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
  async run() {
    const apiUrl = `${this.croveApp._getBaseUrl()}/documents/${this.document_id}/document-respondents/create/`;
    var config = {
      url: apiUrl,
      method: "POST",
      data: {
        can_download_document: this.can_download_document,
        submission_required: this.submission_required,
      },
    };
    var resp = await this.croveApp._makeRequest(config);

    var drAuthToken = resp.auth_token;
    var invitationLink = `https://v2.crove.app/documents/${ this.document_id }/fill/overview?dr_auth_token=${ drAuthToken }`;
    resp.invitation_link = invitationLink;
    // if resp.response exist delete it
    if (resp.response) {
      delete resp.response;
    }
    // if resp.respondents exist delete it
    if (resp.respondents) {
      delete resp.respondents;
    }
    // if resp.symbol_table exist delete it
    if (resp.symbol_table) {
      delete resp.symbol_table;
    }
    return resp;
  },
};
