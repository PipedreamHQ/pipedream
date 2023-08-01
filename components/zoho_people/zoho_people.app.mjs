import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "zoho_people",
  propDefinitions: {
    form: {
      type: "string",
      label: "Form",
      description: "The form to insert a new record",
      async options() {
        const res = await this.listForms();
        return res.response.result.map((form) => ({
          label: form.displayName,
          value: form.formLinkName,
        }));
      },
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log((this.$auth));
    },
    _getAccessToken() {
      return this.$auth.oauth_access_token;
    },
    _getBaseUrl() {
      return "https://people.zoho.com/people/api/";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Zoho-oauthtoken ${this._getAccessToken()}`,
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return axios(ctx, axiosOpts);
    },
    async listForms() {
      return this._makeHttpRequest({
        path: "/forms",
      });
    },
    async listFieldsOfForm(formLinkName) {
      return this._makeHttpRequest({
        path: `/forms/${formLinkName}/components`,
      });
    },
    async insertRecord(formLinkName, data) {
      return this._makeHttpRequest({
        method: "POST",
        path: `/forms/json/${formLinkName}/insertRecord`,
        params: {
          inputData: JSON.stringify(data),
        },
      });
    },
    async updateRecord(formLinkName, recordId, data) {
      return this._makeHttpRequest({
        method: "POST",
        path: `/forms/json/${formLinkName}/updateRecord`,
        params: {
          inputData: JSON.stringify(data),
          recordId,
        },
      });
    },
  },
};
