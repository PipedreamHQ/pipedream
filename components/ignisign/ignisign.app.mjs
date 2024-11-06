import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ignisign",
  propDefinitions: {
    signerprofileid: {
      type: "string",
      label: "Signer Profile ID",
      description: "The unique identifier of the signer profile",
    },
    firstname: {
      type: "string",
      label: "First Name",
      description: "The first name of the signer",
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the signer",
    },
    externalid: {
      type: "string",
      label: "External ID",
      description: "An external identifier for the signer",
      optional: true,
    },
    lastname: {
      type: "string",
      label: "Last Name",
      description: "The last name of the signer",
      optional: true,
    },
    phonenumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the signer",
      optional: true,
    },
    nationality: {
      type: "string",
      label: "Nationality",
      description: "The nationality of the signer in ISO 3166-1 alpha-2",
      optional: true,
    },
    birthdate: {
      type: "string",
      label: "Birth Date",
      description: "The birth date of the signer",
      optional: true,
    },
    birthplace: {
      type: "string",
      label: "Birthplace",
      description: "The place of birth of the signer",
      optional: true,
    },
    birthcountry: {
      type: "string",
      label: "Birth Country",
      description: "The country of birth of the signer in ISO 3166-1 alpha-2",
      optional: true,
    },
    documentid: {
      type: "string",
      label: "Document ID",
      description: "The unique identifier for the document to be signed",
    },
    signerid: {
      type: "string",
      label: "Signer ID",
      description: "The unique identifier of the signer",
    },
    signrequestid: {
      type: "string",
      label: "Sign Request ID",
      description: "The identifier of the signature request you want to get the proof for",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.ignisign.io";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    async createSigner(opts = {}) {
      const data = {
        signerProfileId: this.signerprofileid,
        firstName: this.firstname,
        email: this.email,
        externalId: this.externalid,
        lastName: this.lastname,
        phoneNumber: this.phonenumber,
        nationality: this.nationality,
        birthDate: this.birthdate,
        birthPlace: this.birthplace,
        birthCountry: this.birthcountry,
      };
      return this._makeRequest({
        method: "POST",
        path: `/v4/applications/${this.$auth.appId}/envs/${this.$auth.appEnv}/signers`,
        data,
        ...opts,
      });
    },
    async initDocumentSignature(opts = {}) {
      const data = {
        documentId: this.documentid,
        signerId: this.signerid,
      };
      return this._makeRequest({
        method: "POST",
        path: `/v4/applications/${this.$auth.appId}/envs/${this.$auth.appEnv}/signature-requests`,
        data,
        ...opts,
      });
    },
    async retrieveSignatureProof(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: `/v4/signature-proofs/${opts.signrequestid}/proof-file`,
        ...opts,
      });
    },
    async emitSignatureProofEvent() {
      const proofs = await this._makeRequest({
        path: "/v4/emit-signature-proofs",
      });

      for (const proof of proofs) {
        this.$emit(proof, {
          id: proof.id,
          summary: `New signature proof generated: ${proof.id}`,
          ts: Date.now(),
        });
      }
    },
  },
};
