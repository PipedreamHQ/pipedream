import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";

export default defineApp({
  type: "app",
  app: "smaily",
  propDefinitions: {
    automationWorkflowId: {
      label: "Automation Workflow ID",
      description: "The ID of the automation workflow. E.g. This URL `...sendsmaily.net/workflows/35` the ID will be `35`",
      type: "string",
      async options() {
        const workflows = await this.getAutomationWorkflows();

        return workflows.map((workflow) => ({
          label: workflow.name,
          value: workflow.id,
        }));
      },
    },
    segmentId: {
      label: "Segment ID",
      description: "The ID of the segment",
      type: "string",
      async options() {
        const segments = await this.getSegments();

        return segments.filter((segment) => segment.subscribers_count > 0).map((segment) => ({
          label: segment.name,
          value: segment.id,
        }));
      },
    },
    emails: {
      label: "Emails",
      description: "The emails to run",
      type: "string[]",
      async options({
        segmentId, page,
      }) {
        if (!segmentId) return [];

        const subscribers = await this.getSubscribers({
          params: {
            list: segmentId,
            offset: page,
          },
        });

        return subscribers.map((subscriber) => subscriber.email);
      },
    },
  },
  methods: {
    _subdomain() {
      return this.$auth.subdomain;
    },
    _username() {
      return this.$auth.username;
    },
    _password() {
      return this.$auth.password;
    },
    _apiUrl() {
      return `https://${this._subdomain()}.sendsmaily.net/api`;
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        auth: {
          username: this._username(),
          password: this._password(),
        },
        ...args,
      });
    },
    async getAutomationWorkflows(args = {}) {
      return this._makeRequest({
        path: "/autoresponder.php",
        ...args,
      });
    },
    async getSegments(args = {}) {
      return this._makeRequest({
        path: "/list.php",
        ...args,
      });
    },
    async getSubscribers(args = {}) {
      return this._makeRequest({
        path: "/contact.php",
        ...args,
      });
    },
    async runAutomationWorkflow(args = {}) {
      return this._makeRequest({
        path: "/autoresponder.php",
        method: "post",
        ...args,
      });
    },
    async updateSubscriber(args = {}) {
      return this._makeRequest({
        path: "/contact.php",
        method: "post",
        ...args,
      });
    },
  },
});
