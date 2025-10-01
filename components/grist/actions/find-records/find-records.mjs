import utils from "../../common/utils.mjs";
import app from "../../grist.app.mjs";

export default {
  key: "grist-find-records",
  name: "Find Records",
  description: "Searches for records in a specified table. [See the documentation](https://support.getgrist.com/api/#tag/records/operation/listRecords)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    docId: {
      propDefinition: [
        app,
        "docId",
      ],
    },
    tableId: {
      propDefinition: [
        app,
        "tableId",
        ({ docId }) => ({
          docId,
        }),
      ],
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "This is a JSON object mapping column names to arrays of allowed values. For example, to filter column pet for values cat and dog, the filter would be `{\"pet\": [\"cat\", \"dog\"]}`. Multiple columns can be filtered. For example the filter for pet being either `cat` or `dog`, AND `size` being either `tiny` or `outrageously small`, would be `{\"pet\": [\"cat\", \"dog\"], \"size\": [\"tiny\", \"outrageously small\"]}`",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Return at most this number of rows. A value of 0 is equivalent to having no limit.",
      optional: true,
    },
  },
  methods: {
    findRecords({
      docId, tableId, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/docs/${docId}/tables/${tableId}/records`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      findRecords,
      docId,
      tableId,
      filter,
      limit,
    } = this;

    filter && utils.valueToObject(filter);

    const response = await findRecords({
      $,
      docId,
      tableId,
      params: {
        filter,
        limit,
      },
    });

    $.export("$summary", `Successfully found \`${response.records.length}\` record(s) in the table.`);

    return response;
  },
};
