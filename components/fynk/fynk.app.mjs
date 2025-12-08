import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "fynk",
  propDefinitions: {
    templateUuid: {
      type: "string",
      label: "Template",
      description: "The template to use as a basis for the new document",
      async options({ page }) {
        const { data } = await this.listTemplates({
          params: {
            page: page + 1,
            per_page: 100,
          },
        });
        return data?.map((template) => ({
          label: template.name,
          value: template.uuid,
        })) || [];
      },
    },
    documentUuid: {
      type: "string",
      label: "Document",
      description: "The document to operate on",
      async options({ page }) {
        const { data } = await this.listDocuments({
          params: {
            page: page + 1,
            per_page: 100,
          },
        });
        return data?.map((doc) => ({
          label: doc.name,
          value: doc.uuid,
        })) || [];
      },
    },
    partyUuid: {
      type: "string",
      label: "Party",
      description: "The party to operate on",
      async options(opts) {
        const { documentUuid } = opts;
        if (!documentUuid) {
          return [];
        }
        const { data } = await this.listDocumentParties({
          documentUuid,
        });
        return data?.map((party) => ({
          label: party.entity_name || party.reference || party.uuid,
          value: party.uuid,
        })) || [];
      },
    },
    metadataValueUuid: {
      type: "string",
      label: "Metadata Value",
      description: "The metadata value to update",
      async options(opts) {
        const { documentUuid } = opts;
        if (!documentUuid) {
          return [];
        }
        const { data } = await this.listDocumentMetadataValues({
          documentUuid,
        });
        return data?.map((mv) => ({
          label: `${mv.metadata.display_name}: ${mv.value || "(empty)"}`,
          value: mv.uuid,
        })) || [];
      },
    },
    tagUuids: {
      type: "string[]",
      label: "Tags",
      description: "Tags to assign to the document",
      optional: true,
      async options({ page }) {
        const { data } = await this.listTags({
          params: {
            page: page + 1,
            per_page: 100,
          },
        });
        return data?.map((tag) => ({
          label: tag.name,
          value: tag.uuid,
        })) || [];
      },
    },
    documentType: {
      type: "string",
      label: "Document Type",
      description: "The type of document",
      optional: true,
      options: [
        {
          label: "Contract",
          value: "contract",
        },
        {
          label: "Quote",
          value: "quote",
        },
        {
          label: "Form",
          value: "form",
        },
        {
          label: "Other",
          value: "other",
        },
      ],
    },
    entityType: {
      type: "string",
      label: "Entity Type",
      description: "What kind of entity this party represents",
      optional: true,
      options: [
        {
          label: "Business",
          value: "business",
        },
        {
          label: "Person",
          value: "person",
        },
      ],
    },
    scope: {
      type: "string",
      label: "Scope",
      description: "When this is `internal_and_external`, collaborators from this party may change the party's information",
      optional: true,
      options: [
        {
          label: "Internal",
          value: "internal",
        },
        {
          label: "Internal and External",
          value: "internal_and_external",
        },
      ],
    },
    targetStage: {
      type: "string",
      label: "Target Stage",
      description: "The stage to move the contract to",
      options: [
        {
          label: "Review",
          value: "review",
        },
        {
          label: "Signing",
          value: "signing",
        },
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.fynk.com/v1/api";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_token}`,
        "Accept": "application/json",
        "Content-Type": "application/json",
      };
    },
    async _makeRequest({
      $ = this,
      path,
      method = "GET",
      data = null,
      params = null,
      headers = {},
      ...args
    }) {
      const config = {
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...this._getHeaders(),
          ...headers,
        },
        ...(data && {
          data,
        }),
        ...(params && {
          params,
        }),
        ...args,
      };
      return axios($, config);
    },
    async listTemplates(args = {}) {
      return this._makeRequest({
        path: "/templates",
        ...args,
      });
    },
    async listDocuments(args = {}) {
      return this._makeRequest({
        path: "/documents",
        ...args,
      });
    },
    async listDocumentParties({
      documentUuid, ...args
    } = {}) {
      return this._makeRequest({
        path: `/documents/${documentUuid}/parties`,
        ...args,
      });
    },
    async listDocumentMetadataValues({
      documentUuid, ...args
    } = {}) {
      return this._makeRequest({
        path: `/documents/${documentUuid}/metadata-values`,
        ...args,
      });
    },
    async listTags(args = {}) {
      return this._makeRequest({
        path: "/tags",
        ...args,
      });
    },
    async createDocumentFromTemplate(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/documents/create-from-template",
        ...args,
      });
    },
    async updateDocumentMetadataValue({
      documentUuid, metadataValueUuid, ...args
    } = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/documents/${documentUuid}/metadata-values/${metadataValueUuid}`,
        ...args,
      });
    },
    async updateDocumentParty({
      documentUuid, partyUuid, ...args
    } = {}) {
      return this._makeRequest({
        method: "PUT",
        path: `/documents/${documentUuid}/parties/${partyUuid}`,
        ...args,
      });
    },
    async moveDocumentToReview({
      documentUuid, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/documents/${documentUuid}/stage-transitions/review`,
        ...args,
      });
    },
    async moveDocumentToSigning({
      documentUuid, ...args
    } = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/documents/${documentUuid}/stage-transitions/signing`,
        ...args,
      });
    },
  },
};
