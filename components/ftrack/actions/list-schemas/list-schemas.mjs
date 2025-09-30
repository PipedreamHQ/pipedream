import app from "../../ftrack.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "ftrack-list-schemas",
  name: "List Schemas",
  description: "List all schemas. [See the documentation](https://help.ftrack.com/en/articles/1040498-operations#query-schemas)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  methods: {
    querySchemas(args = {}) {
      return this.app.post({
        data: [
          {
            action: "query_schemas",
          },
        ],
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const [
      response,
    ] = await this.querySchemas({
      step,
    });

    step.export("$summary", `Successfully listed ${utils.summaryEnd(response.length, "schema")}.`);

    return response;
  },
};
