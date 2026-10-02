import { Caesar } from "caesar-search";

export default {
  type: "app",
  app: "caesar",
  propDefinitions: {
    query: {
      type: "string",
      label: "Query",
      description: "The search query.",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of ranked results to return, from 1 to 50.",
      optional: true,
      min: 1,
      max: 50,
      default: 10,
    },
    mode: {
      type: "string",
      label: "Mode",
      description: "Search mode. `standard` is the recommended default, `fast` lowers latency, and `research` does deeper retrieval.",
      optional: true,
      options: [
        "fast",
        "standard",
        "research",
      ],
      default: "standard",
    },
    docId: {
      type: "string",
      label: "Document ID",
      description: "A Caesar `doc_id` returned by a previous **Search Web** result. Provide this or a Canonical URL.",
      optional: true,
    },
    canonicalUrl: {
      type: "string",
      label: "Canonical URL",
      description: "The URL of the document to read. Provide this or a Document ID.",
      optional: true,
    },
    include: {
      type: "string[]",
      label: "Include",
      description: "Which parts of the document to return.",
      optional: true,
      options: [
        "metadata",
        "passages",
        "content",
      ],
    },
  },
  methods: {
    /**
     * Creates a Caesar SDK client authenticated with the connected account's
     * API key. Caesar requires a key on every request.
     * @returns {Caesar} A configured Caesar client.
     */
    _client() {
      if (!this._caesarClient) {
        this._caesarClient = new Caesar({
          apiKey: this.$auth.api_key,
        });
      }
      return this._caesarClient;
    },
    /**
     * Runs a ranked web search over Caesar.
     * @param {object} opts - Search options.
     * @param {string} opts.query - The search query.
     * @param {number} [opts.maxResults] - Maximum number of results, from 1 to 50.
     * @param {string} [opts.mode] - Search mode: `fast`, `standard`, or `research`.
     * @returns {Promise<object>} The search response, including a `results` array.
     */
    search({
      query, maxResults, mode,
    }) {
      return this._client().search(query, {
        maxResults,
        mode,
      });
    },
    /**
     * Reads a document as clean markdown by `doc_id` or canonical URL.
     * @param {object} opts - Read options.
     * @param {string} opts.target - A Caesar `doc_id` or a canonical URL.
     * @param {string} [opts.query] - Optional query to focus the most relevant passages.
     * @param {string[]} [opts.include] - Which parts of the document to return.
     * @returns {Promise<object>} The document response, including `content` and provenance.
     */
    read({
      target, query, include,
    }) {
      return this._client().read(target, {
        query,
        include,
      });
    },
  },
};
