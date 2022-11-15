import { axios } from "@pipedream/platform";
import constants from "./actions/common/constants.mjs";

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
    extractorId: {
      label: "Extractor Id",
      type: "string",
      description: "Unique identification of extractors, custom models, public models, and models shared in the teams.",
      async options({ prevContext }) {
        return this.listExtractorOptions(prevContext);
      },
    },
    inputDuplicatesStrategy: {
      label: "Input Duplicates Strategy",
      type: "string",
      description: "Indicates what to do with duplicate texts in this request.",
      options: constants.INPUT_DUPLICATES_STRATEGY_OPTS,
      optional: true,
    },
    existingDuplicatesStrategy: {
      label: "Existing Duplicates Strategy",
      type: "string",
      description: "Indicates what to do with texts of this request that already exist in the model.",
      options: constants.EXISTING_DUPLICATES_STRATEGY_OPTS,
      optional: true,
    },
    data: {
      label: "Data",
      type: "string[]",
      description: "A list of up to 500 data elements to classify. Each element must be a string with the text.",
    },
    dataObjectArray: {
      label: "Data Array",
      type: "string[]",
      description: "A list of **data objects**.\n\n**Example:** `[{ \"text\": \"first text\", \"tags\": [\"tag_id_1\", \"tag_name\"], \"markers\": [\"any_marker\", \"other_marker\"] }]`",
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
          },
        }));
        return {
          options: classifiers.map((classifier) => ({
            label: classifier.name,
            value: classifier.id,
          })),
          context: {
            page,
          },
        };
      } catch {
        return {
          options: [],
          context: prevContext,
        };
      }
    },
    async listExtractorOptions(prevContext) {
      const page = (prevContext?.page || 0) + 1;
      try {
        const extractors = await axios(this, this._getRequestParams({
          method: "GET",
          path: "/extractors/",
          params: {
            page,
          },
        }));
        return {
          options: extractors.map((extractor) => ({
            label: extractor.name,
            value: extractor.id,
          })),
          context: {
            page,
          },
        };
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
        },
      }));
    },
    uploadClassifierTrainingData($, classifierId, data) {
      return axios(($ || this), this._getRequestParams({
        method: "POST",
        path: `/classifiers/${classifierId}/data/`,
        data,
      }));
    },
    extractText($, extractorId, data, productionModel) {
      return axios(($ || this), this._getRequestParams({
        method: "POST",
        path: `/extractors/${extractorId}/extract/`,
        data: {
          data,
          production_model: productionModel,
        },
      }));
    },
  },
};
