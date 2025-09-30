import pipefy from "../../pipefy.app.mjs";

export default {
  key: "pipefy-update-table-record",
  name: "Update Table Record",
  description: "Updates a table record. [See the docs here](https://api-docs.pipefy.com/reference/mutations/updateTable/)",
  version: "0.1.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipefy,
    organization: {
      propDefinition: [
        pipefy,
        "organization",
      ],
    },
    table: {
      propDefinition: [
        pipefy,
        "table",
        (c) => ({
          orgId: c.organization,
        }),
      ],
    },
    record: {
      propDefinition: [
        pipefy,
        "record",
        (c) => ({
          tableId: c.table,
        }),
      ],
    },
    status: {
      propDefinition: [
        pipefy,
        "status",
        (c) => ({
          tableId: c.table,
        }),
      ],
    },
    title: {
      type: "string",
      label: "Title",
      description: "The new title of the record",
      optional: true,
    },
  },
  async run({ $ }) {
  /*
  Example query:

  mutation updateTableRecord{
    updateTableRecord(
        input: {id: 397325159, title: "UpdatedTableRecord" } ) {
            table_record{id title}
        }
    }

  */

    const { table_record: record } = await this.pipefy.getTableRecord(this.record);
    const variables = {
      recordId: this.record,
      title: this.title || record.title,
      statusId: this.status || record.status.id,
    };

    const response = await this.pipefy.updateTableRecord(variables);
    $.export("$summary", "Successfully updated table record");
    return response;
  },
};
