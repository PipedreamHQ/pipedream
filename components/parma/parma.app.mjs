import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "parma",
  propDefinitions: {
    relationshipType: {
      type: "string",
      label: "Relationship Type",
      description: "The type of relationship (contact or company)",
      options: [
        "contact",
        "company",
      ],
    },
    source: {
      type: "string",
      label: "Source",
      description: "The source of the relationship",
    },
    target: {
      type: "string",
      label: "Target",
      description: "The target of the relationship",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the relationship",
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description: "Additional context related to the relationship",
      optional: true,
    },
    relationshipId: {
      type: "string",
      label: "Relationship ID",
      description: "The ID of the relationship to search for",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the note",
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the note",
    },
    relatedTo: {
      type: "string",
      label: "Related To",
      description: "Associate the note to a specific item in Parma",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.parma.ai/api/v1";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async createRelationship({
      source, target, type, metadata,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/relationships",
        data: {
          source,
          target,
          type,
          metadata,
        },
      });
    },
    async getRelationship({ relationshipId }) {
      return this._makeRequest({
        method: "GET",
        path: `/relationships/${relationshipId}`,
      });
    },
    async addNote({
      content, title, relatedTo,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/notes",
        data: {
          content,
          title,
          relatedTo,
        },
      });
    },
    async emitNewRelationshipEvent({ relationshipType }) {
      console.log(`New relationship of type ${relationshipType} created`);
    },
  },
};
