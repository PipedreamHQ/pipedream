import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "productlane",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project to upvote",
      async options() {
        const projects = await this.listProjects();
        return projects.map((p) => ({
          label: p.name,
          value: p.id,
        }));
      },
    },
    feedbackEmail: {
      type: "string",
      label: "Email",
      description: "The email for the feedback",
    },
    notify: {
      type: "object",
      label: "Notify",
      description: "Object with email and slack booleans",
    },
    origin: {
      type: "string",
      label: "Origin",
      description: "The origin of the feedback",
      async options() {
        const origins = [
          "option1",
          "option2",
          "option3",
        ]; // replace with actual enum values
        return origins.map((origin) => ({
          label: origin,
          value: origin,
        }));
      },
    },
    painlevel: {
      type: "integer",
      label: "Pain Level",
      description: "The pain level of the feedback",
    },
    text: {
      type: "string",
      label: "Text",
      description: "The text of the feedback",
    },
  },
  methods: {
    _baseUrl() {
      return "https://productlane.com/api/v1";
    },
    async _makeRequest({
      $ = this,
      path,
      headers,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async createContact(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/contacts",
        method: "POST",
      });
    },
    async upvoteProject(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: `/projects/${opts.projectId}/upvote`,
        method: "POST",
      });
    },
    async createFeedback(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/feedback",
        method: "POST",
      });
    },
    async listProjects(opts = {}) {
      return this._makeRequest({
        ...opts,
        path: "/projects",
      });
    },
  },
};
