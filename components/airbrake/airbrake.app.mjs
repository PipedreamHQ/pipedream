import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "airbrake",
  propDefinitions: {
    projectId: {
      label: "Project ID",
      description: "The project ID",
      type: "integer",
      async options({ page }) {
        const { projects } = await this.getProjects({
          params: {
            page: page + 1,
          },
        });

        return projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      },
    },
  },
  methods: {
    _apiKey() {
      return this.$auth.api_key;
    },
    _apiUrl() {
      return "https://api.airbrake.io/api/v4";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        ...args,
        params: {
          ...args.params,
          key: this._apiKey(),
        },
      });
    },
    async getProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        ...args,
      });
    },
    async getGroups({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/groups`,
        ...args,
      });
    },
    async getNotices({
      projectId, groupId, ...args
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/groups/${groupId}/notices`,
        ...args,
      });
    },
    async getProjectNotices({
      projectId, ...args
    }) {
      const { groups } = await this.getGroups({
        projectId,
        ...args,
      });

      let allNotices = [];

      for (const group of groups) {
        let page = 1;

        while (true) {
          const { notices } = await this.getNotices({
            projectId,
            groupId: group.id,
            params: {
              page,
              limit: 100,
            },
          });

          allNotices = allNotices.concat(notices);

          if (notices.length < 100) {
            break;
          }

          page++;
        }
      }

      return {
        notices: allNotices,
      };
    },
  },
};
