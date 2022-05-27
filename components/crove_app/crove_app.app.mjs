import { axios } from "@pipedream/platform";

export default {
    type: "app",
    app: "crove_app",
    propDefinitions: {},
    methods: {
      // this.$auth contains connected account data
      authKeys() {
        console.log(Object.keys(this.$auth));
      },
      async _makeRequest(options = {}, $ = this) {
        const config = {
          ...options
        };
  
        return axios($, config);
      },
    },
  };