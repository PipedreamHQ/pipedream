import sidetracker from "../../sidetracker.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "sidetracker-add-row-to-list",
  name: "Add Row to List",
  description: "Add a row to a list. [See the documentation](https://app.sidetracker.io/api/schema/redoc#tag/Lists/operation/ListAddRow)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    sidetracker,
    listId: {
      propDefinition: [
        sidetracker,
        "listId",
      ],
      reloadProps: true,
    },
    data: {
      type: "object",
      label: "Data",
      description: "Enter list data in JSON format",
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.listId) return props;
    const { columns } = await this.sidetracker.getList({
      listId: this.listId,
    });
    for (const column of columns) {
      props[column.name] = {
        type: "string",
        label: column.name,
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      sidetracker,
      listId,
      data,
      ...columnProps
    } = this;

    const rowData = {
      ...parseObject(data),
      ...columnProps,
    };

    const response = await sidetracker.addRowToList({
      $,
      listId,
      data: rowData,
    });

    $.export("$summary", `Successfully added row to list ${listId}`);
    return response;
  },
};
