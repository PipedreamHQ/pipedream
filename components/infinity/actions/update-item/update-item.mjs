import infinity from "../../infinity.app.mjs";

export default {
  key: "infinity-update-item",
  name: "Update Item",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update an existed item. [See the documentation](https://s3.amazonaws.com/devdocs.startinfinity.com/index.html#items-PUTapi-v2-workspaces--workspace--boards--board_id--items--item_id-)",
  type: "action",
  props: {
    infinity,
    workspaceId: {
      propDefinition: [
        infinity,
        "workspaceId",
      ],
    },
    boardId: {
      propDefinition: [
        infinity,
        "boardId",
        ({ workspaceId }) => ({
          workspaceId,
        }),
      ],
    },
    folderId: {
      propDefinition: [
        infinity,
        "folderId",
        ({
          workspaceId, boardId,
        }) => ({
          workspaceId,
          boardId,
        }),
      ],
      optional: true,
    },
    itemId: {
      propDefinition: [
        infinity,
        "itemId",
        ({
          workspaceId, boardId,
        }) => ({
          workspaceId,
          boardId,
        }),
      ],
    },
    parentId: {
      propDefinition: [
        infinity,
        "itemId",
        ({
          workspaceId, boardId,
        }) => ({
          workspaceId,
          boardId,
        }),
      ],
      label: "Parent Id",
      description: "The Id of the parent item.",
      optional: true,
    },
    valuesNumber: {
      type: "integer",
      label: "Values Quantity",
      description: "The number of values you want to add.",
      reloadProps: true,
    },
  },
  async additionalProps() {
    if (this.workspaceId && this.boardId) {
      return Array.from({
        length: this.valuesNumber,
      }).reduce((acc, _, index) => {
        const pos = index + 1;

        return {
          ...acc,
          [`attributeId-${pos}`]: {
            type: "string",
            label: `Attribute Id ${pos}`,
            description: "The id of the atribute.",
            options: async ({ prevContext }) => {
              let workspaceId = this.workspaceId;
              let boardId = this.boardId;

              const {
                data, after,
              } = await this.infinity.listAttributes({
                workspaceId,
                boardId,
                params: {
                  after: prevContext?.after,
                  limit: 100,
                },
              });

              return {
                options: data.map(({
                  id: value, name: label,
                }) => ({
                  label,
                  value,
                })),
                context: {
                  after,
                },
              };
            },
          },
          [`data-${pos}`]: {
            type: "string",
            label: `Data ${pos}`,
            description: `The data of the atribute ${pos}.`,
          },
        };
      }, {});
    }
  },
  methods: {
    getValue(index) {
      const pos = index + 1;
      const {
        [`attributeId-${pos}`]: attribute_id,
        [`data-${pos}`]: data,
      } = this;
      return {
        attribute_id,
        data,
      };
    },
    getValues() {
      return Array.from({
        length: this.valuesNumber,
      }).map((_, index) => this.getValue(index));
    },
  },
  async run({ $ }) {
    const response = await this.infinity.updateItem({
      $,
      workspaceId: this.workspaceId,
      boardId: this.boardId,
      itemId: this.itemId,
      data: {
        folder_id: this.folderId,
        parent_id: this.parentId,
        values: this.getValues(),
      },
    });

    $.export("$summary", `The item with Id: ${response.id} was successfully updated!`);
    return response;
  },
};
