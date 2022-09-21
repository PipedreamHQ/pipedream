import { Api } from "nocodb-sdk";

export default {
  type: "app",
  app: "nocodb",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project Id",
      description: "The id of the project",
      async options() {
        const { list } = await this.listProjects();
        return list.map((project) => ({
          label: project.title,
          value: project.id,
        }));
      },
    },
    tableName: {
      type: "string",
      label: "Table Name",
      description: "The name of the table",
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
    rowId: {
      type: "string",
      label: "Row Id",
      description: "Id of the row",
    },
    data: {
      type: "any",
      label: "data",
      description: "Enter Json Formated data",
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
    sdk() {
      return new Api({
        baseURL: `https://${this.$auth.domain}`,
        headers: {
          "xc-token": this.$auth.api_key,
        },
      });
    },
    async *paginate({
      fn, params = {}, offset = 0,
    }) {
      let lastPage = false;
      const { query } = params;
      const limit = query.limit || null;
      let count = 0;

      do {
        params.query.offset = offset;
        const {
          list,
          pageInfo: {
            pageSize,
            page,
            isLastPage,
          },
        } = await fn(params);
        for (const d of list) {
          yield d;

          if (limit && ++count === limit) {
            return count;
          }
        }

        offset = pageSize * page;
        lastPage = !isLastPage;
      } while (lastPage);
    },
    async listProjects() {
      return this.sdk().project.list();
    },
    async listTables({ projectId }) {
      return this.sdk().dbTable.list(projectId);
    },
    async readTable({ tableId }) {
      return this.sdk().dbTable.read(tableId);
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
    async createTableRow({
      projectId,
      tableName,
      data,
    }) {
      return this.sdk().dbTableRow.create("v1", projectId, tableName, data);
    },
    async updateTableRow({
      projectId,
      tableName,
      rowId,
      data,
    }) {
      return this.sdk().dbTableRow.update("v1", projectId, tableName, rowId, data);
    },
    async deleteTableRow({
      projectId,
      tableName,
      rowId,
    }) {
      return this.sdk().dbTableRow.delete("v1", projectId, tableName, rowId);
    },
    async getTableRow({
      projectId,
      tableName,
      rowId,
    }) {
      return this.sdk().dbTableRow.read("v1", projectId, tableName, rowId);
    },
    async listTableRow({
      projectId,
      tableName,
      query,
    }) {
      return this.sdk().dbTableRow.list("v1", projectId, tableName, query);
    },
  },
};
