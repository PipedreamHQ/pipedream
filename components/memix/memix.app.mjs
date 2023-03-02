import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "memix",
  propDefinitions: {},
  methods: {
    async getTemplates() {
      return await axios(this, {
        method: "get",
        headers: {
          "X-API-Partner": "pipedream",
        },
        url: "https://partner-api.memix.com/templates",
      });
    },

    async getRandomTemplate() {
      const templates = await this.getTemplates();
      return templates[Math.floor(Math.random() * templates.length)];
    },

    gifURIForTemplate(template) {
      return `${constants.MEDIA_ENDPOINT}/memix-${
        template.id
      }.gif?text=${encodeURIComponent(this.caption)}`;
    },
  },
};
