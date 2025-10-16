import retable from "../../retable.app.mjs";

export default {
  key: "retable-update-record",
  name: "Update Record",
  description: "Update an existing record in Retable. [See the documentation](https://docs.retable.io/retable-user-guide/retable-api/api#update-row)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    retable,
    workspaceId: {
      propDefinition: [
        retable,
        "workspaceId",
      ],
    },
    projectId: {
      propDefinition: [
        retable,
        "projectId",
        (c) => ({
          workspaceId: c.workspaceId,
        }),
      ],
    },
    retableId: {
      propDefinition: [
        retable,
        "retableId",
        (c) => ({
          projectId: c.projectId,
        }),
      ],
    },
    rowId: {
      propDefinition: [
        retable,
        "rowId",
        (c) => ({
          retableId: c.retableId,
        }),
      ],
    },
    columnIds: {
      propDefinition: [
        retable,
        "columnIds",
        (c) => ({
          retableId: c.retableId,
        }),
      ],
      description: "The column(s) to update",
      withLabel: true,
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.columnIds?.length) {
      return props;
    }
    for (const columnId of this.columnIds) {
      props[columnId.value] = {
        type: "string",
        label: `${columnId.label} Value`,
      };
    }
    return props;
  },
  async run({ $ }) {
    const columns = this.columnIds.map(({ value }) => ({
      column_id: value,
      update_cell_value: this[value],
    }));

    const response = await this.retable.updateRecord({
      retableId: this.retableId,
      data: {
        rows: [
          {
            row_id: this.rowId,
            columns,
          },
        ],
      },
      $,
    });

    if (response?.data[0]) {
      $.export("$summary", `Successfully updated row with ID ${response.data[0]}.`);
    }

    return response;
  },
};
