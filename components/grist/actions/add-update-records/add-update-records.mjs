import app from "../../grist.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "grist-add-update-records",
  name: "Add Or Update Records",
  description: "Add records in a specified table or updates existing matching records. [See the documentation](https://support.getgrist.com/api/#tag/records/operation/replaceRecords)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    noParse: {
      propDefinition: [
        app,
        "noParse",
      ],
    },
    onMany: {
      type: "string",
      label: "On Many",
      description: "Which records to update if multiple records are found to match.",
      optional: true,
      options: [
        {
          value: "first",
          label: "The first matching record (default)",
        },
        {
          value: "none",
          label: "Do not update anything",
        },
        {
          value: "all",
          label: "Update all matches",
        },
      ],
    },
    noAdd: {
      type: "boolean",
      label: "No Add",
      description: "Set to true to prohibit adding records.",
      optional: true,
    },
    noUpdate: {
      type: "boolean",
      label: "No Update",
      description: "Set to true to prohibit updating records.",
      optional: true,
    },
    records: {
      description: app.propDefinitions.records.description + " Instead of an id, a `require` object is provided, with the same structure as `fields`. If no query parameter options are set, then the operation is as follows. First, we check if a record exists matching the values specified for columns in `require`. If so, we update it by setting the values specified for columns in fields. If not, we create a new record with a combination of the values in `require` and `fields`, with `fields` taking priority if the same column is specified in both. The query parameters allow for variations on this behavior. Eg. `[ { \"require\": { \"pet\": \"cat\" }, \"fields\": { \"popularity\": 67 } } ]`",
      propDefinition: [
        app,
        "records",
      ],
    },
  },
  methods: {
    addUpdateRecords({
      docId, tableId, ...args
    } = {}) {
      return this.app.put({
        path: `/docs/${docId}/tables/${tableId}/records`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      addUpdateRecords,
      docId,
      tableId,
      noParse: noparse,
      onMany: onmany,
      noAdd: noadd,
      noUpdate: noupdate,
      records,
    } = this;

    await addUpdateRecords({
      $,
      docId,
      tableId,
      params: {
        noparse,
        onmany,
        noadd,
        noupdate,
      },
      data: {
        records: utils.parseArray(records),
      },
    });

    $.export("$summary", "Successfully ran this action");

    return {
      success: true,
    };
  },
};
