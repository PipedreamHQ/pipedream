import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "postmark",
  propDefinitions: {
    templateAlias: {
      type: "string",
      label: "Template",
      description: "The template to use for this email.",
      async options() {
        return this.listTemplates();
      },
    },
  },
  methods: {
    _apikey() {
      return this.$auth.api_key;
    },
    async listTemplates($ = this) {
      const data = await axios($, {
        url: "https://api.postmarkapp.com/templates?Count=500&Offset=0&TemplateType=Standard",
        headers: this.getHeaders(),
        method: "GET",
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
        headers: this.getHeaders(),
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
    async setServerInfo(params) {
      return axios(this, {
        method: "put",
        path: "https://api.postmarkapp.com/server",
        params,
        headers: this.getHeaders(),
      });
    },
  },
};
