import infinity from "../../infinity.app.mjs";

export default {
  key: "infinity-create-item",
  name: "Create Item",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new item. [See the documentation](https://s3.amazonaws.com/devdocs.startinfinity.com/index.html#items-POSTapi-v2-workspaces--workspace--boards--board_id--items)",
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
    },
    valuesNumber: {
      type: "integer",
      label: "Number of attributes",
      description: "The number of Attributes you'd like to have in the item.",
      reloadProps: true,
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
      label: "Parent Item ID",
      description: "The Id of the parent item.",
      optional: true,
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
            label: `Attribute ID ${pos}`,
            description: "The id of the attribute.",
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
    const response = await this.infinity.createItem({
      $,
      workspaceId: this.workspaceId,
      boardId: this.boardId,
      data: {
        folder_id: this.folderId,
        parent_id: this.parentId,
        values: this.getValues(),
      },
    });

    $.export("$summary", `A new item with Id: ${response.id} was successfully created!`);
    return response;
  },
};
