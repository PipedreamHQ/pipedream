import retable from "../../retable.app.mjs";

export default {
  key: "retable-add-record",
  name: "Add Record",
  description: "Add a new record in Retable. [See the documentation](https://docs.retable.io/retable-user-guide/retable-api/api#insert-row)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
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
    columnIds: {
      propDefinition: [
        retable,
        "columnIds",
        (c) => ({
          retableId: c.retableId,
        }),
      ],
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
      cell_data: this[value],
    }));

    const response = await this.retable.createRecord({
      retableId: this.retableId,
      data: {
        data: [
          {
            columns,
          },
        ],
      },
      $,
    });

    if (response?.data?.rows[0].row_id) {
      $.export("$summary", `Successfully inserted row with ID ${response.data.rows[0].row_id}.`);
    }

    return response;
  },
};
