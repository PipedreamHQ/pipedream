import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 20;

export default {
  type: "app",
  app: "terraform",
  propDefinitions: {
    orgId: {
      type: "string",
      label: "Organization",
      description: "Identifier of an organization",
      async options({ page }) {
        const { data } = await this.listOrganizations({
          params: {
            "page[number]": page,
          },
        });
        return data?.map(({
          id: value, attributes,
        }) => ({
          value,
          label: attributes.name,
        })) || [];
      },
    },
    workspaceId: {
      type: "string",
      label: "Workspace",
      description: "Identifier of a workspace",
      async options({
        orgId, page,
      }) {
        if (!orgId) {
          return;
        }
        const { data } = await this.listWorkspaces({
          orgId,
          params: {
            "page[number]": page,
          },
        });
        return data?.map(({
          id: value, attributes,
        }) => ({
          value,
          label: attributes.name,
        })) || [];
      },
    },
    configurationVersion: {
      type: "string",
      label: "Configuration Version",
      description: "Specifies the configuration version to use for this run. If the `configuration-version` object is omitted, the run will be created using the workspace's latest configuration version.",
      async options({
        workspaceId, page,
      }) {
        if (!workspaceId) {
          return;
        }
        const { data } = await this.listConfigurationVersions({
          workspaceId,
          params: {
            "page[number]": page,
          },
        });
        if (!data?.length) {
          return [];
        }
        return data?.map(({ id }) => id );
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.terraform.io/api/v2";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_token}`,
        "Content-Type": "application/vnd.api+json",
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listOrganizations(args = {}) {
      return this._makeRequest({
        path: "/organizations",
        ...args,
      });
    },
    listWorkspaces({
      orgId, ...args
    }) {
      return this._makeRequest({
        path: `/organizations/${orgId}/workspaces`,
        ...args,
      });
    },
    listConfigurationVersions({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/configuration-versions`,
        ...args,
      });
    },
    listRuns({
      workspaceId, ...args
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/runs`,
        ...args,
      });
    },
    createRun(args = {}) {
      return this._makeRequest({
        path: "/runs",
        method: "POST",
        ...args,
      });
    },
    async *paginate({
      resourceFn,
      args,
    }) {
      const limit = DEFAULT_LIMIT;
      let total = 0;
      args = {
        ...args,
        params: {
          ...args.params,
          "page[number]": 1,
          "page[size]": limit,
        },
      };

      do {
        const { data } = await resourceFn(args);
        for (const item of data) {
          yield item;
        }
        total = data.length;
        args.params["page[number]"] += 1;
      } while (total === limit);
    },
  },
};
