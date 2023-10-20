import utils from "../../common/utils.mjs";
import monday from "../../monday.app.mjs";

export default {
  key: "monday-create-item",
  name: "Create Item",
  description: "Creates an item. [See the documentation](https://api.developer.monday.com/docs/items-queries#create-an-item)",
  type: "action",
  version: "0.0.7",
  props: {
    monday,
    boardId: {
      propDefinition: [
        monday,
        "boardId",
      ],
    },
    groupId: {
      propDefinition: [
        monday,
        "groupId",
        ({ boardId }) => ({
          boardId: +boardId,
        }),
      ],
    },
    itemName: {
      propDefinition: [
        monday,
        "itemName",
      ],
    },
    columns: {
      propDefinition: [
        monday,
        "column",
        (c) => ({
          boardId: c.boardId,
        }),
      ],
      type: "string[]",
      description: "Select columns to fill",
      reloadProps: true,
    },
    createLabels: {
      propDefinition: [
        monday,
        "itemCreateLabels",
      ],
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.columns) {
      return props;
    }
    for (const column of this.columns) {
      let description;
      if (column === "status") {
        description = "Value for status. [Status Index Value Map](https://view.monday.com/1073554546-ad9f20a427a16e67ded630108994c11b?r=use1)";
      } else if (column === "person") {
        description = "The ID of the person/user to add to item";
      } else if (column === "date4") {
        description = "Enter date of item in YYYY-MM-DD format. Eg. `2022-09-02`";
      } else {
        description = `Value for column ${column}. See the [Column Type Reference](https://developer.monday.com/api-reference/docs/column-types-reference) to learn more about entering column type values.`;
      }
      props[column] = {
        type: "string",
        label: column,
        description,
      };
    }
    return props;
  },
  methods: {
    getEmailValue(value) {
      let email = value;
      if (typeof value === "string") {
        try {
          email = JSON.parse(value);
        } catch {
          email = {
            text: value,
            email: value,
          };
        }
      }
      return email;
    },
  },
  async run({ $ }) {
    const columnValues = {};
    if (this.columns?.length > 0) {
      for (const column of this.columns) {
        if (column === "email") {
          columnValues[column] = this.getEmailValue(this[column]);
          continue;
        }
        columnValues[column] = this[column];
      }
    }
    const {
      data,
      errors,
      error_message: errorMessage,
    } =
      await this.monday.createItem({
        boardId: +this.boardId,
        groupId: utils.emptyStrToUndefined(this.groupId),
        itemName: utils.emptyStrToUndefined(this.itemName),
        columnValues: utils.strinfied(columnValues),
        createLabels: utils.emptyStrToUndefined(this.createLabels),
      });

    if (errors) {
      throw new Error(`Failed to create item: ${errors[0].message}`);
    }

    if (errorMessage) {
      throw new Error(`Failed to create item: ${errorMessage}`);
    }

    const { id: itemId } = data.create_item;

    $.export("$summary", `Successfully created a new item with ID: ${itemId}`);

    return itemId;
  },
};
