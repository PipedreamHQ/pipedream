import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "alt_text_generator_ai",
  propDefinitions: {},
  methods: {
    generateAltText({
      $ = this, data, ...opts
    }) {
      return axios($, {
        url: "https://alttextgeneratorai.com/api/wp",
        method: "POST",
        data: {
          ...data,
          wpkey: `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
  },
};
