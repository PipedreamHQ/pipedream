import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "postmark",
  propDefinitions: {
    templateAlias: {
      type: "string",
      label: "Template",
      description: "The template to use for this email.",
      async options(context) {
        let { page } = context;
        const data = await this.listTemplates(page++);
        const options =
          data.Templates?.map((obj) => {
            return {
              label: obj.Name,
              value: obj.Alias,
            };
          }) ?? [];

        return {
          options,
          context: {
            page,
          },
        };
      },
    },
  },
  methods: {
    _apikey() {
      return this.$auth.api_key;
    },
    async listTemplates(page) {
      const amountPerPage = 10;
      const offset = page * amountPerPage;

      return this.sharedRequest(this, {
        endpoint: `templates?Count=${amountPerPage}&Offset=${offset}&TemplateType=Standard`,
        method: "GET",
      });
    },
    getHeaders() {
      return {
        "X-Postmark-Server-Token": this._apikey(),
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
    },
    async sharedRequest($, params) {
      const {
        endpoint,
        method,
        data,
      } = params;

      return axios($, {
        url: `https://api.postmarkapp.com/${endpoint}`,
        method,
        headers: this.getHeaders(),
        data,
      });
    },
    async sharedActionRequest($, endpoint, data) {
      return this.sharedRequest($, {
        endpoint,
        method: "POST",
        data,
      });
    },
    async sendSingleEmail($, data) {
      return this.sharedActionRequest($, "email", data);
    },
    async sendEmailWithTemplate($, data) {
      return this.sharedActionRequest($, "email/withTemplate", data);
    },
    async setServerInfo(data) {
      return this.sharedRequest(this, {
        endpoint: "server",
        method: "put",
        data,
      });
    },
  },
};
