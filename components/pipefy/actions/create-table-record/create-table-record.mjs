import pipefy from "../../pipefy.app.mjs";

export default {
  key: "pipefy-create-table-record",
  name: "Create Table Record",
  description: "Creates a new table record. [See the docs here](https://api-docs.pipefy.com/reference/mutations/createTableRecord/)",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
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
      reloadProps: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the new record",
    },
    assignees: {
      propDefinition: [
        pipefy,
        "members",
        (c) => ({
          orgId: c.organization,
        }),
      ],
    },
  },
  async additionalProps() {
    const props = {};
    const fields = await this.pipefy.listTableFields(this.table);
    for (const field of fields) {
      props[field.id] = {
        type: "string",
        label: field.label,
        description: field.description,
        optional: !field.required,
      };
      if (field.options.length > 0) {
        props[field.id].options = field.options;
      }
    }
    return props;
  },
  async run({ $ }) {
  /*
  Example query:

  mutation createNewTableRecord{
    createTableRecord(
        input: {id: 301501717, title: "Test Record" } ) {
            table_record{id status title}
        }
    }
  */
    const fieldsAttributes = [];
    const fields = await this.pipefy.listTableFields(this.table);
    for (const field of fields) {
      if (this[field.id]) {
        fieldsAttributes.push({
          field_id: field.id,
          field_value: this[field.id],
        });
      }
    }

    const variables = {
      tableId: this.table,
      assigneeIds: this.assignees,
      title: this.title,
      fieldsAttributes,
    };

    const response = await this.pipefy.createTableRecord(variables);
    $.export("$summary", "Successfully created table record");
    return response;
  },
};
