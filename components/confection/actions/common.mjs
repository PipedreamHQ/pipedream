import { axios } from "@pipedream/platform";
import confection from "../confection.app.mjs";

export default {
  props: { confection },
  methods: {
    /**
     * Send POST request to Confection Live API and return the results
     *
     * @param {object} $ - Pipedream $ object
     * @param {string} url - Confection Live API url
     * @returns {Promise<object>} - Results from the Live API
     */
    async postRequest($, url) {
      const { data } = await axios($, {
        url,
        method: "POST",
        data: { key: this.confection.$auth.secret_key },
        headers: { Accept: "application/json" },
      });

      return data;
    },
  },
};
