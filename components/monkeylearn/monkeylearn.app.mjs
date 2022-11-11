import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "monkeylearn",
  propDefinitions: {
    classifierId: {
      label: "Classifier Id",
      type: "string",
      description: "Unique identification of classifiers, custom models, public models, and models shared in the teams.",
      async options({ prevContext }) {
        return this.listClassifiersOptions(prevContext);
      },
    },
    data: {
      label: "Data",
      type: "string[]",
      description: "A list of up to 500 data elements to classify. Each element must be a string with the text.",
    },
    productionModel: {
      label: "Production Model",
      type: "boolean",
      description: "Indicates if the extractions are performed by the production model. Only use this parameter on custom models. Note that you first need to deploy your model to production.",
      optional: true,
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.monkeylearn.com/v3";
    },
    _getHeaders() {
      return {
        "content-type": "application/json",
        "Authorization": `Token ${this.$auth.api_key}`,
      };
    },
    _getRequestParams(opts = {}) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    async listClassifiersOptions(prevContext) {
      const page = (prevContext?.page || 0) + 1;
      try {
        const classifiers = await axios(this, this._getRequestParams({
          method: "GET",
          path: "/classifiers/",
          params: {
            page,
          }
        }));
        return {
          options: classifiers.map((classifier) => ({
            label: classifier.name,
            value: classifier.id,
          })),
          context: {
            page,
          },
        }
      } catch {
        return {
          options: [],
          context: prevContext,
        };
      }
    },
    classifyText($, classifierId, data, productionModel) {
      return axios(($ || this), this._getRequestParams({
        method: "POST",
        path: `/classifiers/${classifierId}/classify/`,
        data: {
          data,
          production_model: productionModel,
        }
      }));
    },
  },
};
