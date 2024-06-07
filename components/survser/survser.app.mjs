import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "survser",
  propDefinitions: {},
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.survser.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async getSurveys() {
      return this._makeRequest({
        path: "/surveys",
      });
    },
    async getSurveyResponses(surveyId) {
      return this._makeRequest({
        path: `/surveys/${surveyId}/responses`,
      });
    },
    async emitNewSurveyResponse(surveyId) {
      const prevResponses = await this.getSurveyResponses(surveyId);
      setInterval(async () => {
        const currentResponses = await this.getSurveyResponses(surveyId);
        if (currentResponses.length > prevResponses.length) {
          this.$emit(currentResponses, {
            summary: `New response in survey ${surveyId}`,
            id: currentResponses[currentResponses.length - 1].id,
          });
        }
      }, 5000);
    },
  },
};
