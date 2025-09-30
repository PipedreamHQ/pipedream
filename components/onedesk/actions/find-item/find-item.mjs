import app from "../../onedesk.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "onedesk-find-item",
  name: "Find Item",
  description: "Search for an existing item. [See the documentation](https://www.onedesk.com/dev/).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    itemType: {
      optional: false,
      propDefinition: [
        app,
        "itemType",
      ],
    },
    creationTimeValue: {
      type: "string",
      label: "Creation Time Value",
      description: "Item creation date. Eg. `2024-01-28`",
      optional: true,
    },
    creationTimeOperator: {
      type: "string",
      label: "Creation Time Operator",
      description: "Item creation date operator",
      optional: true,
      options: [
        {
          label: "Equal",
          value: "EQ",
        },
        constants.DATE_OPERATOR.GT,
        constants.DATE_OPERATOR.LT,
      ],
    },
    name: {
      type: "string",
      label: "Item Name",
      description: "Name of the item",
    },
  },
  async run({ $ }) {
    const {
      app,
      itemType,
      creationTimeValue,
      creationTimeOperator,
      name,
    } = this;

    const properties = [
      {
        property: "name",
        operation: "CONTAINS",
        value: name,
      },
      {
        property: "creationTime",
        operation: creationTimeOperator || constants.DATE_OPERATOR.LT.value,
        value: creationTimeValue,
      },
    ];

    const results = await app.paginate({
      resourcesFn: app.filterItemDetails,
      resourcesFnArgs: {
        $,
        data: {
          properties: properties.filter(({ value }) => value),
          isAsc: false,
          itemType: [
            itemType,
          ],
        },
      },
      resourceName: "data",
    });

    if (!results.length) {
      $.export("$summary", "No items found.");
    } else {
      $.export("$summary", `Found \`${results.length}\` matching item(s).`);
    }

    return results;
  },
};
