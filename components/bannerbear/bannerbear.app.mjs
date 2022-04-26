import axios from 'axios'

export default {
  type: "app",
  app: "bannerbear",
  propDefinitions: {
    template: {
      type: "string",
      label: "Template",
      description: "BannerBear template. [See the docs](https://developers.bannerbear.com/#get-v2-templates)",
      async options({ prevContext }) {
        const currentPage = prevContext.nextPage || 1
        const templates = await this.fetchTemplates({ page: currentPage });
        const options = this.extractTemplateOptions(templates);

        return this.buildPaginatedOptions(options, currentPage);
      },
    },
  },
  methods: {
    async fetchTemplates(params = {}) {
      const response = await axios.get('https://api.bannerbear.com/v2/templates', {
        headers: {
          'Authorization': `Bearer ${this.getAuthKey()}`
        },
        ...params
      })

      return response.data
    },
    getAuthKey() {
      return this.$auth.api_key
    },
    buildPaginatedOptions(options, currentPage) {
      return {
        options,
        context: {
          nextPage: currentPage + 1,
        },
      };
    },
    extractTemplateOptions(templates) {
      const options = templates.map((template) => {
        const {name, uid} = template

        return {
          label: name || "Untitled",
          value: uid,
        };
      });

      return options;
    },
  },
};
