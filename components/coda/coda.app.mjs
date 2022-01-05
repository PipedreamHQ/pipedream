import axios from "axios";

export default {
  type: "app",
  app: "coda",
  propDefinitions: {
    title: {
      type: "string",
      label: "Doc Title",
      description: "Title of the doc",
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of the folder",
    },
    sourceDoc: {
      type: "string",
      label: "Source Doc ID",
      description: "A doc ID from which to create a copy.",
    },
    isOwner: {
      type: "boolean",
      label: "Is Owner Docs",
      description: "Show only docs owned by the user.",
    },
    isPublished: {
      type: "boolean",
      label: "Is Published Docs",
      description: "Show only published docs.",
    },
    query: {
      type: "string",
      label: "Search Query",
      description: "Search term used to filter down results.",
    },
    isStarred: {
      type: "boolean",
      label: "Is Starred Docs",
      description: "If true, returns docs that are starred. If false, returns docs that are not starred.",
    },
    inGallery: {
      type: "boolean",
      label: "In Gallery Docs",
      description: "Show only docs visible within the gallery.",
    },
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "Show only docs belonging to the given workspace.",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum number of results to return in this query.",
      default: 25,
      min: 1,
      max: 50,
    },
    pageToken: {
      type: "string",
      label: "Page Token",
      description: "An opaque token used to fetch the next page of results.",
    },
    paginate: {
      type: "boolean",
      label: "Auto-Paginate",
      description: "By default, list all docs matching search results across all result pages. Set to `false` to limit results to the first page.",
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    /**
     * Creates a new Coda doc
     *
     * @param {string} title - Title of the new doc
     * @param {string} folderId - The ID of the folder within to create this
     * doc
     * @param {string} [sourceDoc] - An optional doc ID from which to create a
     * copy
     * @returns {string} ID of the newly created doc
     */
    async createDoc(title, folderId, sourceDoc = "") {
      const config = {
        method: "post",
        url: "https://coda.io/apis/v1/docs",
        headers: {
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        data: {
          title,
          folderId,
          sourceDoc,
        },
      };
      return (await axios(config)).data.id;
    },
    /**
     * List Coda docs according to parameters
     *
     * @param {object} [params] - Optional Query Parameters
     * @param {boolean} params.isOwner
     * @param {boolean} params.isPublished
     * @param {string} params.query
     * @param {string} params.sourceDoc
     * @param {boolean} params.isStarred
     * @param {boolean} params.inGallery
     * @param {string} params.workspaceId
     * @param {string} params.folderId
     * @param {int} params.limit
     * @param {string} params.pageToken
     *
     * @returns {object[]} Array of listed Docs
     */
    async listDocs(params = {}) {
      const config = {
        method: "get",
        url: "https://coda.io/apis/v1/docs",
        headers: {
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        params,
      };
      return (await axios(config)).data;
    },
  },
};
