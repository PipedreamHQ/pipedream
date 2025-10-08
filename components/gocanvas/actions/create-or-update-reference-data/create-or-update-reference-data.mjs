import gocanvas from "../../gocanvas.app.mjs";
import { parse } from "csv-parse/sync";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "gocanvas-create-or-update-reference-data",
  name: "Create or Update Reference Data",
  description: "Creates or updates GoCanvas reference data. [See the documentation](https://help.gocanvas.com/hc/en-us/article_attachments/26468076609559)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    gocanvas,
    name: {
      type: "string",
      label: "Reference Data Name",
      description: "The attribute name of the dataset to operate on. Will be created if it doesn't already exist.",
    },
    data: {
      type: "string",
      label: "Data",
      description: `A string of comma separated values representing the data to create/update. **Include Column names**:
      \n Example:
      \n  Column1,Column2,Column3
      \n  Data1Column1,Data1Column2,Data1Column3
      \n  Data2Column1,Data2Column2,Data3Column3
      `,
    },
  },
  methods: {
    csvToXml(data) {
      const records = parse(data, {
        columns: true,
        trim: true,
      });

      if (!records?.length) {
        throw new ConfigurationError("No data items found to create/update. Please enter column names and at least 1 row of data.");
      }

      // Extract columns
      const columns = Object.keys(records[0]);
      let result = "<Columns>";
      result += columns.map((col) => `<c>${col}</c>`).join("");
      result += "</Columns>\n<Rows>\n";

      // Extract rows
      result += records
        .map((row) => {
          const rowValues = columns.map((col) => `<v>${row[col]}</v>`).join("");
          return `  <r>${rowValues}</r>`;
        })
        .join("\n");

      result += "\n</Rows>";
      return result;
    },
  },
  async run({ $ }) {
    const response = await this.gocanvas.createUpdateReferenceData({
      $,
      data: `
        <?xml version="1.0" encoding="utf-8"?>
          <List Name="${this.name}">
            ${await this.csvToXml(this.data)}
          </List>
      `,
    });
    $.export("$summary", "Successfully created/updated reference data");
    return response;
  },
};
