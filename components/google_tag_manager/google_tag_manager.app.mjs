import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "google_tag_manager",
  propDefinitions: {
    accountId: {
      label: "Account ID",
      description: "The account ID",
      type: "string",
      async options() {
        const { account } = await this.getAccounts();
        const accounts = account || [];

        return accounts.map((account) => ({
          label: account.name,
          value: account.accountId,
        }));
      },
    },
    containerId: {
      label: "Container ID",
      description: "The container ID",
      type: "string",
      async options({ accountId }) {
        const { container: containers } = await this.getContainers({
          accountId,
        });

        return containers.map((container) => ({
          label: container.name,
          value: container.containerId,
        }));
      },
    },
    workspaceId: {
      label: "Workspace ID",
      description: "The workspace ID",
      type: "string",
      async options({
        accountId, containerId,
      }) {
        const { workspace: workspaces } = await this.getWorkspaces({
          accountId,
          containerId,
        });

        return workspaces.map((workspace) => ({
          label: workspace.name,
          value: workspace.workspaceId,
        }));
      },
    },
    tagId: {
      label: "Tag ID",
      description: "The tag ID",
      type: "string",
      async options({
        accountId, containerId, workspaceId,
      }) {
        const { tag: tags } = await this.getTags({
          accountId,
          containerId,
          workspaceId,
        });

        return tags.map((tag) => ({
          label: tag.name,
          value: tag.tagId,
        }));
      },
    },
    variableId: {
      label: "Variable ID",
      description: "The variable ID",
      type: "string",
      async options({
        accountId, containerId, workspaceId,
      }) {
        const { variable: variables } = await this.getVariables({
          accountId,
          containerId,
          workspaceId,
        });

        if (!variables) return [];

        return variables.map((variable) => ({
          label: variable.name,
          value: variable.variableId,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the tag",
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the tag. Learn more about available types in [Tag Dictionary Reference](https://developers.google.com/tag-platform/tag-manager/api/v2/tag-dictionary-reference)",
    },
    liveOnly: {
      type: "boolean",
      label: "Live Only",
      description: "Whether the tag should only fire in the live environment",
      optional: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Any notes or comments about the tag",
      optional: true,
    },
    parameter: {
      type: "string",
      label: "Parameter",
      description: "The list of parameters for the tag. Learn more about available parameters in [Tag Dictionary Reference](https://developers.google.com/tag-platform/tag-manager/api/v2/tag-dictionary-reference)",
    },
    consentSettings: {
      type: "string",
      label: "Consent Settings",
      description: "The consent settings for the tag. Learn more in [Tag Manager API Documentation](https://developers.google.com/tag-platform/tag-manager/api/v2/reference/accounts/containers/workspaces/tags/create#request-body) and [Consent Settings Documentation](https://support.google.com/analytics/answer/9976101)",
      optional: true,
    },
    monitoringMetadata: {
      type: "string",
      label: "Monitoring Metadata",
      description: "The monitoring metadata for the tag. Learn more in [Tag Manager API Doc](https://developers.google.com/tag-platform/tag-manager/api/v2/reference/accounts/containers/workspaces/tags/create#request-body)",
      optional: true,
    },
  },
  methods: {
    _accountId() {
      return this.$auth.accountId;
    },
    _oauthAccessToken() {
      return this.$auth.oauth_access_token;
    },
    _apiUrl() {
      return "https://www.googleapis.com/tagmanager/v2";
    },
    async _makeRequest({
      $ = this, path, ...args
    }) {
      return axios($, {
        url: `${this._apiUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this._oauthAccessToken()}`,
        },
        ...args,
      });
    },
    async getAccounts(args = {}) {
      return this._makeRequest({
        path: "/accounts",
        ...args,
      });
    },
    async getContainers({
      accountId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/containers`,
        ...args,
      });
    },
    async getWorkspaces({
      accountId, containerId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/containers/${containerId}/workspaces`,
        ...args,
      });
    },
    async getTags({
      accountId, containerId, workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}/tags`,
        ...args,
      });
    },
    async getTriggers({
      accountId, containerId, workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}/triggers`,
        ...args,
      });
    },
    async getTag({
      accountId, containerId, workspaceId, tagId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}/tags/${tagId}`,
        ...args,
      });
    },
    async createTag({
      accountId, containerId, workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}/tags`,
        method: "post",
        ...args,
      });
    },
    async updateTag({
      accountId, containerId, workspaceId, tagId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}/tags/${tagId}`,
        method: "put",
        ...args,
      });
    },
    async getVariables({
      accountId, containerId, workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}/variables`,
        ...args,
      });
    },
    async updateVariable({
      accountId, containerId, workspaceId, variableId, ...args
    }) {
      return this._makeRequest({
        path: `/accounts/${accountId}/containers/${containerId}/workspaces/${workspaceId}/variables/${variableId}`,
        method: "put",
        ...args,
      });
    },
  },
};
