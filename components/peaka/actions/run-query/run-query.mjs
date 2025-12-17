import utils from "../../common/utils.mjs";
import app from "../../peaka.app.mjs";

export default {
  key: "peaka-run-query",
  name: "Run Query",
  description: "Runs a specific query in Peaka and returns the result as line items. [See the documentation](https://docs.peaka.com/api-reference/data-%3E-query/execute-a-query).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    data: {
      type: "string",
      label: "JSON Query String",
      description: "JSON structure as a query. Eg: `{ \"columns\": [ { \"column\": { \"catalogId\": \"2\", \"tableName\": \"mongo_postgresql\", \"columnName\": \"suburb\", \"schemaName\": \"query\" } } ], \"from\": [ { \"catalogId\": \"2\", \"tableName\":  \"mongo_postgresql\", \"schemaName\": \"query\" } ], \"limit\": 50, \"offset\": 0 }` where `catalogId` and `schemaName` are always fixed values.",
    },
  },
  methods: {
    executeQuery({
      projectId, ...args
    } = {}) {
      return this.app.post({
        path: `/data/projects/${projectId}/queries/execute`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      executeQuery,
      projectId,
      data,
    } = this;

    const response = await executeQuery({
      projectId,
      data: utils.valueToObject(data),
    });

    $.export("$summary", `Successfully ran the query in project ID ${projectId}`);
    return response;
  },
};
