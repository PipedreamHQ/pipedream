import axios from "axios";

export default {
  type: "app",
  app: "coda",
  propDefinitions: {
    docTitle: {
      type: "string",
      label: "Doc Title",
      description: "Title of the doc",
      optional: true,
    },
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "The ID of the folder",
      optional: true,
    },
    sourceDoc: {
      type: "string",
      label: "Source Doc ID",
      description: "A doc ID from which to create a copy.",
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
  },
};
