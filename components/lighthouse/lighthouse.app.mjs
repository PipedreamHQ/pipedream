import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lighthouse",
  propDefinitions: {
    projectId: {
      label: "Project ID",
      description: "The project ID",
      type: "string",
      async options() {
        const { projects } = await this.getProjects();

        return projects.map(({ project }) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
    milestoneId: {
      label: "Milestone ID",
      description: "The milestone ID",
      type: "string",
      async options({ projectId }) {
        const { milestones } = await this.getMilestones({
          projectId,
        });

        return milestones.map(({ milestone }) => ({
          label: milestone.title,
          value: milestone.id,
        }));
      },
    },
  },
  methods: {
    _apiToken() {
      return this.$auth.api_token;
    },
    _domain() {
      return this.$auth.domain;
    },
    _apiUrl() {
      return `https://${this._domain()}.lighthouseapp.com`;
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}.json`,
        headers: {
          "X-LighthouseToken": this._apiToken(),
          "Content-type": "application/json",
        },
        ...args,
      });
    },
    async getProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        ...args,
      });
    },
    async createProject(args = {}) {
      return this._makeRequest({
        path: "/projects",
        method: "post",
        ...args,
      });
    },
    async getTickets({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/tickets`,
        ...args,
      });
    },
    async createTicket({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/tickets`,
        method: "post",
        ...args,
      });
    },
    async getMilestones({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/milestones`,
        ...args,
      });
    },
    async createMilestone({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/milestones`,
        method: "post",
        ...args,
      });
    },
    async getMessages({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/messages`,
        ...args,
      });
    },
  },
};
