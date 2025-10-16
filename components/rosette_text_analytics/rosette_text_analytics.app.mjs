import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "rosette_text_analytics",
  propDefinitions: {
    nameOne: {
      type: "string",
      label: "Name One",
      description: "Primary name for comparison or translation",
    },
    nameTwo: {
      type: "string",
      label: "Name Two",
      description: "Secondary name for comparison",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name to be translated",
    },
    targetLanguage: {
      type: "string",
      label: "Target Language",
      description: "Target language code for translation or analysis",
      async options() {
        const response = await this.getLanguages();
        const languages = response.supportedLanguagePairs;
        return languages.map(({ target }) => ({
          label: target.language,
          value: target.language,
        }));
      },
    },
    content: {
      type: "string",
      label: "Content",
      description: "Text content to extract entities from",
    },
    calculateConfidence: {
      type: "boolean",
      label: "Calculate Confidence",
      description: "Include confidence scores in entity extraction results",
      optional: true,
    },
    calculateSalience: {
      type: "boolean",
      label: "Calculate Salience",
      description: "Include salience values indicating entity relevance",
      optional: true,
    },
    includeDBpediaTypes: {
      type: "boolean",
      label: "Include DBpedia Types",
      description: "Include DBpedia types associated with extracted entities",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.rosette.com/rest";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "X-RosetteAPI-Key": `${this.$auth.api_key}`,
          ...headers,
        },
      });
    },
    async matchName(args = {}) {
      return this._makeRequest({
        path: "/v1/name-similarity",
        method: "post",
        ...args,
      });
    },
    async translateName(args = {}) {
      return this._makeRequest({
        path: "/v1/name-translation",
        method: "post",
        ...args,
      });
    },
    async extractEntities(args = {}) {
      return this._makeRequest({
        path: "/v1/entities",
        method: "post",
        ...args,
      });
    },
    async getLanguages(args = {}) {
      return this._makeRequest({
        path: "/v1/name-translation/supported-languages",
        ...args,
      });
    },
  },
};
