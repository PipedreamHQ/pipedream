import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "crove_app",
  propDefinitions: {
    document_id: {
      type: "string",
      label: "Document ID",
      description: "Document ID of document.",
      async options({ $ }) {
        var resp = await axios($, {
          url: "https://v2.api.crove.app/api/integrations/external/documents/?limit=50",
          headers: {
            "X-API-KEY": `${this.$auth.api_key}`,
          },
          method: "GET",
        });
        resp = resp.results;
        return resp.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    }
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    async _makeRequest(options = {}, $ = this) {
      const config = {
        ...options,
      };

      return axios($, config);
    },
  },
};
