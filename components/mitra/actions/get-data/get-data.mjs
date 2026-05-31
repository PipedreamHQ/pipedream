import mitra from "../../mitra.app.mjs";

export default {
  key: "mitra-get-data",
  name: "Get Data",
  description: "Fetches data from the specified table, allowing dynamic filters via query parameters. [See the documentation](https://mitralab.io/docs/api)",
  version: "0.0.1",
  type: "action",
  props: {
    mitra,
    tableName: {
      propDefinition: [
        mitra,
        "tableName",
      ],
    },
    params: {
      type: "object",
      label: "Query Parameters",
      description: "Dynamic filters for querying records (e.g., `status`, `hours_gt`).",
    },
  },
  methods: {
    fetchData({
      tableName, ...args
    } = {}) {
      return this.app._makeRequest({
        tableName,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      fetchData,
      tableName,
      params,
    } = this;

    const response = await fetchData({
      tableName,
      params,
    });
    $.export("$summary", "Succesfully fetched data from the database.");
    return response;
  },
};
