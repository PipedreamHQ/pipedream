import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "v7_darwin",
  propDefinitions: {
    id: {
      type: "string",
      label: "Dataset ID",
      description: "ID of the Dataset",
      async options() {
        const endusersIds = await this.listDatasets();
        return endusersIds.map(({
          id, name,
        }) => ({
          value: id,
          label: name,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the new dataset",
    },
    annotatorsCanCreateTags: {
      type: "boolean",
      label: "Annotators Can Create Tags",
      description: "Flag to specify whether annotators are allowed to create tags for the specified dataset",
    },
    annotatorsCanInstantiateWorkflows: {
      type: "boolean",
      label: "Annotators Can Instantiate Workflows",
      description: "Flag to specify whether annotators can get assigned items in 'new' status",
    },
    anyoneCanDoubleAssign: {
      type: "boolean",
      label: "Anyone Can Double Assign",
      description: "Flag to specify whether users can be assigned to different stages in the same workflow",
    },
    instructions: {
      type: "string",
      label: "Instructions",
      description: "Dataset instructions for annotators",
    },
    public: {
      type: "boolean",
      label: "Public",
      description: "Flag to specify whether the dataset should be publicly accessible",
    },
    reviewersCanAnnotate: {
      type: "boolean",
      label: "Reviewers Can Annotate",
      description: "Flag to specify whether reviewers are allowed to create annotations in review stages",
    },
    workPrioritization: {
      type: "string",
      label: "Work Prioritization",
      description: "Specification for sorting items when annotators request new items",
      options: constants.PRIORITY_OPTIONS,
    },
  },
  methods: {
    _baseUrl() {
      return "https://darwin.v7labs.com/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `ApiKey ${this.$auth.api_key}`,
          "Content-Type": "application/json",
        },
      });
    },
    async createDataset(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/datasets",
        ...args,
      });
    },
    async updateDataset({
      id, ...args
    }) {
      return this._makeRequest({
        method: "put",
        path: `/datasets/${id}`,
        ...args,
      });
    },
    async addInstructions({
      dataset_id, ...args
    }) {
      return this._makeRequest({
        method: "put",
        path: `/datasets/${dataset_id}`,
        ...args,
      });
    },
    async listDatasets(args = {}) {
      return this._makeRequest({
        path: "/datasets",
        ...args,
      });
    },
  },
};
