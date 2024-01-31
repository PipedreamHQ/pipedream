import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "google_cloud_vision_api",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "Identifier of a project",
      async options({ prevContext }) {
        const params = prevContext.nextPageToken
          ? {
            pageToken: prevContext.nextPageToken,
          }
          : {};
        const {
          projects, nextPageToken,
        } = await this.listProjects({
          params,
        });
        const options = projects?.map(({
          projectId: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            nextPageToken,
          },
        };
      },
    },
  },
  methods: {
    _makeRequest({
      $ = this,
      url,
      projectId,
      ...args
    }) {
      return axios($, {
        url,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "x-goog-user-project": projectId,
        },
        ...args,
      });
    },
    listProjects(args = {}) {
      return this._makeRequest({
        url: "https://cloudresourcemanager.googleapis.com/v1/projects",
        ...args,
      });
    },
    detectDataInImage(args = {}) {
      return this._makeRequest({
        method: "POST",
        url: "https://vision.googleapis.com/v1/images:annotate",
        ...args,
      });
    },
  },
};
