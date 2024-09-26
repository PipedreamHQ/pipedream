import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "orbit",
  propDefinitions: {
    workspaceSlug: {
      type: "string",
      label: "Workspace Slug",
      description: "The workspace slug to use",
      async options() {
        const res = await this.getAllWorkspaces();
        return res.data.map((workspace) => ({
          label: workspace.attributes.name,
          value: workspace.attributes.slug,
        }));
      },
    },
    workspaceMemberSlug: {
      type: "string",
      label: "Workspace Member Slug",
      description: "The workspace member slug to use",
      async options({
        workspaceSlug,
        page,
      }) {
        const res = await this.getWorkspaceMembers(workspaceSlug, page + 1);
        return res.data.map((member) => ({
          label: member.attributes.name,
          value: member.attributes.slug,
        }));
      },
    },
    activityType: {
      type: "string",
      label: "Activity Type",
      description: "The activity type to use",
      optional: true,
      async options({ workspaceSlug }) {
        const res = await this.getActivityTypes(workspaceSlug);
        return res.data.map((activityType) => ({
          label: activityType.attributes.key,
          value: activityType.attributes.key,
        }));
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://app.orbit.love/api/v1";
    },
    _getApiToken() {
      return this.$auth.api_token;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "accept": "application/json",
        "Authorization": `Bearer ${this._getApiToken()}`,
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return axios(ctx, axiosOpts);
    },
    async getAllWorkspaces() {
      return this._makeHttpRequest({
        path: "/workspaces",
      });
    },
    async getWorkspaceMembers(workspaceSlug, page) {
      return this._makeHttpRequest({
        path: `/${workspaceSlug}/members`,
        params: {
          page,
        },
      });
    },
    async createActivity(workspaceSlug, workspaceMemberSlug, activity) {
      return this._makeHttpRequest({
        method: "POST",
        path: `/${workspaceSlug}/members/${workspaceMemberSlug}/activities`,
        data: activity,
      });
    },
    async createMember(workspaceSlug, member) {
      return this._makeHttpRequest({
        method: "POST",
        path: `/${workspaceSlug}/members`,
        data: member,
      });
    },
    async createNote(workspaceSlug, workspaceMemberSlug, note) {
      return this._makeHttpRequest({
        method: "POST",
        path: `/${workspaceSlug}/members/${workspaceMemberSlug}/notes`,
        data: note,
      });
    },
    async getMemberByIdentity(workspaceSlug, query) {
      return this._makeHttpRequest({
        method: "GET",
        path: `/${workspaceSlug}/members/find`,
        params: query,
      });
    },
    async getActivityTypes(workspaceSlug) {
      return this._makeHttpRequest({
        method: "GET",
        path: `/${workspaceSlug}/activity_types`,
      });
    },
    async createHook(workspaceSlug, hook) {
      return this._makeHttpRequest({
        method: "POST",
        path: `/${workspaceSlug}/hooks`,
        data: hook,
      });
    },
    async deleteHook(workspaceSlug, hookId) {
      return this._makeHttpRequest({
        method: "DELETE",
        path: `/${workspaceSlug}/hooks/${hookId}`,
      });
    },
  },
};
