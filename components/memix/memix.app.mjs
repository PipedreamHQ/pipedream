import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "memix",
  propDefinitions: {},
  methods: {
    async getTemplates({ $ = this }) {
      return axios($, {
        headers: {
          "X-API-Partner": "pipedream",
        },
        url: `${constants.PARTNER_API_ENDPOINT}/templates`,
      });
    },

    async getRandomTemplate({ $ = this }) {
      const templates = await this.getTemplates({
        $,
      });
      return templates[Math.floor(Math.random() * templates.length)];
    },

    gifURIForTemplate(template, caption) {
      return `${constants.MEDIA_ENDPOINT}/memix-${
        template.id
      }.gif?text=${encodeURIComponent(caption)}`;
    },
  },
};
