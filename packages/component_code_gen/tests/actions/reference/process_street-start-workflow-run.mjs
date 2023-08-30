import { axios } from "@pipedream/platform";
import _ from "lodash";

export default {
  key: "process_street-start-workflow-run",
  name: "Start Workflow Run",
  description: "Starts a workflow run. [See the docs here](https://public-api.process.st/api/v1.1/docs/index.html#operation/createWorkflowRun)",
  version: "0.0.1",
  type: "action",
  props: {
    processStreet: {
      type: "app",
      app: "process_street",
    },
    workflowId: {
      type: "string",
      label: "Workflow ID",
      description: "The ID of the Workflow",
      async options() {
        const { workflows } = await this.listWorkflows();
        return workflows.map((workflow) => ({
          label: workflow.name,
          value: workflow.id,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the workflow run",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The due date in the [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601) of the workflow run",
      optional: true,
    },
    shared: {
      type: "boolean",
      label: "Shared",
      description: "Whether the workflow run is shared with other users",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://public-api.process.st/api/v1.1";
    },
    _auth() {
      return this.$auth.api_key;
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        ...opts,
        url: this._baseUrl() + path,
        headers: {
          ...opts.headers,
          "X-API-KEY": this._auth(),
        },
      });
    },
    async listWorkflows(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/workflows",
      });
    },
    async runWorkflow(opts) {
      return this._makeRequest({
        ...opts,
        path: "/workflow-runs",
        method: "post",
      });
    },
  },
  async run({ $ }) {
    const data = _.pickBy(_.pick(this, [
      "workflowId",
      "name",
      "dueDate",
      "shared",
    ]));
    const response = await this.runWorkflow({
      $,
      data,
    });
    $.export("$summary", `Succesfully started workflow run ${this.name || ""}`);
    return response;
  },
};
