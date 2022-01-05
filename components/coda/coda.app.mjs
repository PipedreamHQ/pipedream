import axios from "axios";

export default {
  type: "app",
  app: "coda",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    /**
     * Creates a new Coda doc
     *
     * @param {string} title - Title of the new doc
     * @param {string} timezone - The timezone to use for the newly created
     * doc
     * @param {string} [folderId] - The ID of the folder within to create
     * this doc
     * @returns {string} ID of the new doc
     */
    async createDoc(title, timezone, folderId, sourceDoc = "") {
      const config = {
        method: "post",
        url: "https://coda.io/apis/v1/docs",
        headers: {
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
        data: {
          title,
          timezone,
          folderId,
          sourceDoc,
        },
      };
      return (await axios(config)).data.id;
    },
  },
};
