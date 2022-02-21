import axios from "axios";

export default {
  type: "app",
  app: "figma",
  propDefinitions: {
    teamId: {
      type: "string",
      label: "Team Id",
      description: "Your team Id. It is not currently possible to programmatically obtain the team id of a user just from a token. To obtain a team id, navigate to a team page of a team you are a part of. The team id will be present in the URL after the word team and before your team name.",
    },
    projectId: {
      type: "string",
      label: "Project Id",
      description: "Id of the project to list files from",
      async options({ teamId }) {
        const projects = await this.listTeamProjects(teamId);
        return projects.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    fileId: {
      type: "string",
      label: "File Id",
      description: "Id of the file to perform your action.",
      async options({ projectId }) {
        const files = await this.listProjectFiles(projectId);
        return files.map((item) => ({
          label: item.name,
          value: item.key,
        }));
      },
    },
    commentId: {
      type: "string",
      label: "Comment Id",
      description: "The comment to reply to, if any. This must be a root comment, that is, you cannot reply to a comment that is a reply itself (a reply has a parent_id)",
      optional: true,
      async options({ fileId }) {
        const files = await this.listFileComments(fileId);
        return files.map((item) => {
          const message = item.message.length > 50
            ? `${item.message.substr(0, 50)}...`
            : item.message;

          return {
            label: `"${message}" - by ${item.user.handle} at ${item.created_at}`,
            value: item.id,
          };
        });
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://api.figma.com";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _getAxiosParams(opts = {}) {
      const res = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return res;
    },
    async listTeamProjects(teamId) {
      const res = await axios(this._getAxiosParams({
        method: "GET",
        path: `/v1/teams/${teamId}/projects`,
      }));
      return res.data?.projects;
    },
    async listProjectFiles(projectId) {
      const res = await axios(this._getAxiosParams({
        method: "GET",
        path: `/v1/projects/${projectId}/files`,
      }));
      return res.data?.files;
    },
    async listFileComments(fileId) {
      const res = await axios(this._getAxiosParams({
        method: "GET",
        path: `/v1/files/${fileId}/comments`,
      }));
      return res.data?.comments;
    },
  },
};
