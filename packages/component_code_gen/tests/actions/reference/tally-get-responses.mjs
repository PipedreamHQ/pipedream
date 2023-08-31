import { axios } from "@pipedream/platform";

export default {
  name: "Get Responses",
  version: "0.0.1",
  key: "tally-get-responses",
  description: "Get a list of responses. [See docs here](https://tallyso.notion.site/Tally-OAuth-2-reference-d0442c679a464664823628f675f43454)",
  type: "action",
  props: {
    tally: {
      type: "app",
      app: "tally",
    },
    formId: {
      label: "Form",
      description: "Select a form",
      type: "string",
      async options() {
        const forms = await this.getForms();
        return forms.map((form) => ({
          label: form.name,
          value: form.id,
        }));
      },
    },
  },
  methods: {
    _accessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://api.tally.so";
    },
    async _makeRequest(path, options = {}, $ = undefined) {
      return axios($ ?? this, {
        url: `${this._apiUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this._accessToken()}`,
        },
        ...options,
      });
    },
    async getForms({ $ } = {}) {
      return this._makeRequest("forms", {}, $);
    },
    async getResponses({
      formId, $,
    }) {
      let allResponses = [];
      let page = 1;

      while (page > 0) {
        const responses = await this._makeRequest(`forms/${formId}/responses`, {
          params: {
            page,
          },
        }, $);

        if (responses.length > 0) {
          allResponses = allResponses.concat(responses);
          page++;
        } else {
          page = 0;
        }
      }

      return allResponses;
    },
  },
  async run({ $ }) {
    const response = await this.getResponses({
      formId: this.formId,
      $,
    });

    $.export("$summary", "Successfully retrieved responses");

    return response;
  },
};
