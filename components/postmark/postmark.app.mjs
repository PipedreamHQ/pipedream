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
        const { page } = context;
        return this.listTemplates(page);
      },
    },
  },
  methods: {
    _apikey() {
      return this.$auth.api_key;
    },
    async listTemplates(page) {
      const amountPerPage = 3;
      const offset = page * amountPerPage;

      const data = await axios(this, {
        url: `https://api.postmarkapp.com/templates?Count=${amountPerPage}&Offset=${offset}&TemplateType=Standard`,
        method: "GET",
        headers: this.getHeaders(),
      });

      return data.TotalCount
        ? data.Templates.map((obj) => {
          return {
            label: obj.Name,
            value: obj.Alias,
          };
        })
        : [];

    },
    getHeaders() {
      return {
        "X-Postmark-Server-Token": this._apikey(),
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
    },
    async sharedActionRequest($, endpoint, data) {
      return axios($, {
        url: `https://api.postmarkapp.com/${endpoint}`,
        method: "POST",
        headers: this.getHeaders(),
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
      return axios(this, {
        url: "https://api.postmarkapp.com/server",
        method: "put",
        headers: this.getHeaders(),
        data,
      });
    },
  },
};
