import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 50;

export default {
  type: "app",
  app: "nocodb",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project",
      async options({ workspaceId }) {
        const { list } = await this.listProjects({
          workspaceId,
        });
        return list.map((project) => ({
          label: project.title,
          value: project.id,
        }));
      },
    },
    tableId: {
      type: "string",
      label: "Table ID",
      description: "The ID of the table",
      withLabel: true,
      async options({ projectId }) {
        const { list } = await this.listTables({
          projectId,
        });
        return list.map((table) => ({
          label: table.title,
          value: table.id,
        }));
      },
    },
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The ID of a workspace",
      async options() {
        const { list } = await this.listWorkspaces();
        return list.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    rowId: {
      type: "string",
      label: "Row Id",
      description: "Id of the row",
      async options({
        tableId, page,
      }) {
        const { list } = await this.listTableRow({
          tableId,
          params: {
            offset: page * DEFAULT_LIMIT,
          },
        });
        const rows = Array.isArray(list)
          ? list
          : [
            list,
          ];
        return rows?.map(({ Id }) => `${Id}` ) || [];
      },
    },
    viewId: {
      type: "string",
      label: "View ID",
      description: "The ID of a view",
      async options({
        tableId, page,
      }) {
        const { list } = await this.listViews({
          tableId,
          params: {
            offset: page * DEFAULT_LIMIT,
          },
        });
        return list?.map(({
          id: value, title: label,
        }) => ({
          label,
          value,
        })) || [];
      },
    },
    data: {
      type: "string",
      label: "data",
      description: "Enter JSON-formatted data",
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Fields that will be fetched [See the docs here](https://docs.nocodb.com/developer-resources/rest-apis/#query-params)",
      async options({ tableId }) {
        return this.listTableFields(tableId);
      },
    },
    sort: {
      type: "string[]",
      label: "Sort",
      description: "Order in which the data will be fetched [See the docs here](https://docs.nocodb.com/developer-resources/rest-apis/#query-params)",
      async options({ tableId }) {
        return this.listSortFields(tableId);
      },
    },
    where: {
      type: "string",
      label: "Where",
      description: "Complicated where conditions [See the docs here](https://docs.nocodb.com/developer-resources/rest-apis/#comparison-operators)",
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum records that will be fetched",
    },
  },
  methods: {
    _makeRequest({
      $ = this,
      path,
      apiVersion = "v2",
      ...opts
    }) {
      return axios($, {
        url: `https://${this.$auth.domain}/api/${apiVersion}${path}`,
        headers: {
          "xc-token": this.$auth.api_key,
        },
        ...opts,
      });
    },
    async *paginate({
      fn, args = {}, max,
    }) {
      let hasMore = false;
      let count = 0;
      args.params = {
        ...args.params,
        offset: 0,
        limit: 1000,
      };
      do {
        const {
          list, pageInfo,
        } = await fn(args);
        for (const item of list) {
          args.params.offset++;
          yield item;
          if (max && ++count === max) {
            return;
          }
        }
        hasMore = !pageInfo.isLastPage;
      } while (hasMore);
    },
    listWorkspaces(opts = {}) {
      return this._makeRequest({
        path: "/workspaces",
        apiVersion: "v1",
        ...opts,
      });
    },
    listProjects({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/bases`,
        apiVersion: "v1",
        ...opts,
      });
    },
    listTables({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/meta/bases/${projectId}/tables`,
        ...opts,
      });
    },
    readTable({
      tableId, ...opts
    }) {
      return this._makeRequest({
        path: `/meta/tables/${tableId}`,
        ...opts,
      });
    },
    async listTableFields(tableId) {
      const { columns } = await this.readTable({
        tableId,
      });
      return columns
        .map((column) => column.title);
    },
    async listSortFields(tableId) {
      const { columns } = await this.readTable({
        tableId,
      });
      return columns.reduce((acc, cur) => {
        return acc.concat([
          `${cur.title}`,
          `-${cur.title}`,
        ]);
      }, []);
    },
    createTableRow({
      tableId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/tables/${tableId}/records`,
        ...opts,
      });
    },
    updateTableRow({
      tableId, ...opts
    }) {
      return this._makeRequest({
        method: "PATCH",
        path: `/tables/${tableId}/records`,
        ...opts,
      });
    },
    deleteTableRow({
      tableId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/tables/${tableId}/records`,
        ...opts,
      });
    },
    getTableRow({
      tableId, rowId, ...opts
    }) {
      return this._makeRequest({
        path: `/tables/${tableId}/records/${rowId}`,
        ...opts,
      });
    },
    listTableRow({
      tableId, ...opts
    }) {
      return this._makeRequest({
        path: `/tables/${tableId}/records`,
        ...opts,
      });
    },
    listViews({
      tableId, ...opts
    }) {
      return this._makeRequest({
        path: `/meta/tables/${tableId}/views`,
        ...opts,
      });
    },
  },
};
