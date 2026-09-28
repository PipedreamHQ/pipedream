import { ConfigurationError } from "@pipedream/platform";
import googleDocs from "../../google_docs.app.mjs";
import {
  API_MIN_COLUMN_WIDTH, COLUMN_WIDTH_TYPES, DEFAULT_TABLE_TOTAL_WIDTH, EVENLY_DISTRIBUTED,
  FIT_TO_CONTENT, FIXED_WIDTH, MIN_COLUMN_WIDTH, POINTS,
} from "../../common/constants.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "google_docs-set-table-column-width",
  name: "Set Table Column Width",
  description: `Set the width of one or more table columns in a Google Doc. This is the only column property the Docs API exposes, so it does not style column text - use **Format Table Cell** for backgrounds, borders and padding. Identify the table with **Find Table Text**, **Table Index**, or leave both blank when the document has only one table. \`${FIT_TO_CONTENT}\` sizes each column to its content (estimated from the longest line in its cells, since the API has no auto-fit), \`${FIXED_WIDTH}\` applies **Width** to each selected column, and \`${EVENLY_DISTRIBUTED}\` resets them to equal widths. Use **Find Document** to resolve a document's name to its ID. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#UpdateTableColumnPropertiesRequest)`,
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    googleDocs,
    documentId: {
      propDefinition: [
        googleDocs,
        "documentId",
      ],
    },
    find: {
      type: "string",
      label: "Find Table Text",
      description: "Text appearing in a cell of the table to resize. The action locates the table containing the first match. Only top-level tables are searched. Takes precedence over **Table Index**; **Table Start Index** wins over both.",
      optional: true,
    },
    matchCase: {
      propDefinition: [
        googleDocs,
        "matchCase",
      ],
    },
    tableIndex: {
      type: "integer",
      label: "Table Index",
      description: "0-based position of the table in the document, in document order. An alternative to **Find Table Text**, which wins if both are set.",
      min: 0,
      optional: true,
    },
    tableStartIndex: {
      type: "integer",
      label: "Table Start Index",
      description: "Character index the table starts at. An escape hatch for callers that already know it; prefer **Find Table Text** or **Table Index**. Takes precedence over both.",
      min: 1,
      optional: true,
    },
    tabId: {
      propDefinition: [
        googleDocs,
        "styleTabId",
      ],
    },
    widthType: {
      type: "string",
      label: "Width Type",
      description: `How to size the columns. \`${FIT_TO_CONTENT}\` estimates what each column's content needs and keeps the table no wider than **Total Width**, so a table of short cells stays narrow. \`${FIXED_WIDTH}\` applies **Width** to every selected column. \`${EVENLY_DISTRIBUTED}\` resets the selected columns to equal widths and ignores **Width**.`,
      options: COLUMN_WIDTH_TYPES,
      default: FIT_TO_CONTENT,
    },
    width: {
      type: "integer",
      label: "Width",
      description: `Column width in points (1 inch = 72 PT), e.g. \`120\` (min ${API_MIN_COLUMN_WIDTH} PT). Required when **Width Type** is \`${FIXED_WIDTH}\`, ignored otherwise. Values wider than the page are accepted by Docs and make the table overflow it.`,
      min: API_MIN_COLUMN_WIDTH,
      optional: true,
    },
    totalWidth: {
      type: "integer",
      label: "Total Width",
      description: `Ceiling in points for the whole table when **Width Type** is \`${FIT_TO_CONTENT}\` (min ${MIN_COLUMN_WIDTH} PT per column, so a smaller value is raised to fit). Defaults to ${DEFAULT_TABLE_TOTAL_WIDTH} PT, the printable width of a US Letter page with 1-inch margins. Resizing only some columns spends only their share of it.`,
      min: MIN_COLUMN_WIDTH,
      optional: true,
      default: DEFAULT_TABLE_TOTAL_WIDTH,
    },
    columnIndices: {
      type: "integer[]",
      label: "Column Indices",
      description: "0-based indices of the columns to resize, e.g. `[0, 2]`. Omit to resize every column in the table.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      googleDocs,
      documentId,
      find,
      matchCase,
      tableIndex,
      tableStartIndex,
      tabId,
      widthType,
      width,
      columnIndices,
    } = this;
    const totalWidth = this.totalWidth || DEFAULT_TABLE_TOTAL_WIDTH;

    if (widthType === FIXED_WIDTH && !width) {
      throw new ConfigurationError(`Width is required when Width Type is ${FIXED_WIDTH}. Provide a width in points, or switch Width Type to ${FIT_TO_CONTENT} or ${EVENLY_DISTRIBUTED}.`);
    }

    const tableStartLocation = await googleDocs.resolveTableLocation(documentId, {
      find,
      matchCase,
      tableIndex,
      tableStartIndex,
      tabId,
    });

    const tables = googleDocs.flattenTables(
      await googleDocs.getTabBodyContent(documentId, tableStartLocation.tabId),
    );
    const table = utils.selectTableAtIndex(tables, tableStartLocation.index);
    if (!table) {
      throw new ConfigurationError(`No table starts at index ${tableStartLocation.index} in document ${documentId}. Run the Get Document action to confirm the table's position.`);
    }

    const columnCount = table.table.columns
      ?? table.table.tableRows?.[0]?.tableCells?.length
      ?? 0;
    const requested = (columnIndices?.length
      ? columnIndices
      : Array.from({
        length: columnCount,
      }, (_, index) => index)).map((value) => ({
      value,
      index: Number(value),
    }));
    const invalid = requested.filter(({ index }) => !Number.isInteger(index)
      || index < 0
      || index >= columnCount);
    if (invalid.length) {
      throw new ConfigurationError(`Column index ${invalid.map(({ value }) => JSON.stringify(value)).join(", ")} is not usable: the table has ${columnCount} column(s), so valid indices are 0 to ${columnCount - 1}.`);
    }
    const targets = [
      ...new Set(requested.map(({ index }) => index)),
    ];

    // The API rejects a width mask for EVENLY_DISTRIBUTED.
    const uniform = {
      [EVENLY_DISTRIBUTED]: {
        tableColumnProperties: {
          widthType: EVENLY_DISTRIBUTED,
        },
        fields: "widthType",
      },
      [FIXED_WIDTH]: {
        tableColumnProperties: {
          widthType: FIXED_WIDTH,
          width: {
            magnitude: width,
            unit: POINTS,
          },
        },
        fields: "widthType,width",
      },
    }[widthType];

    const requests = uniform
      ? [
        {
          updateTableColumnProperties: {
            tableStartLocation,
            columnIndices: targets,
            ...uniform,
          },
        },
      ]
      : utils.resolveColumnWidths({
        table,
        targets,
        widthType,
        width,
        totalWidth,
      }).map(({
        index, magnitude,
      }) => ({
        updateTableColumnProperties: {
          tableStartLocation,
          columnIndices: [
            index,
          ],
          tableColumnProperties: {
            widthType: FIXED_WIDTH,
            width: {
              magnitude,
              unit: POINTS,
            },
          },
          fields: "widthType,width",
        },
      }));

    await googleDocs.batchUpdate(documentId, requests);

    const applied = requests.map(({ updateTableColumnProperties: request }) => ({
      columnIndices: request.columnIndices,
      widthType: request.tableColumnProperties.widthType,
      width: request.tableColumnProperties.width?.magnitude,
    }));
    $.export("$summary", `Resized ${targets.length} column(s) of the table at index ${tableStartLocation.index} in document ${documentId}`);

    return {
      documentId,
      tableStartLocation,
      columnCount,
      applied,
    };
  },
};
