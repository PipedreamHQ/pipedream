import supabase from "../../supabase.app.mjs";
import fs from "fs";
import { parse } from "csv-parse/sync";

export default {
  key: "supabase-batch-insert-rows",
  name: "Batch Insert Rows",
  description: "Inserts new rows into a database. [See the documentation](https://supabase.com/docs/reference/javascript/insert)",
  version: "0.0.1",
  type: "action",
  props: {
    supabase,
    table: {
      propDefinition: [
        supabase,
        "table",
      ],
      description: "Name of the table to insert rows into",
    },
    source: {
      type: "string",
      label: "Source of data",
      description: "Whether to enter the row data as an array of objects or to import from a CSV file",
      options: [
        "Array",
        "CSV File",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.source === "Array") {
      props.data = {
        type: "string[]",
        label: "Row Data",
        description: "An array of objects, each object representing a row. Enter column names and values as key/value pairs",
      };
    }
    if (this.source === "CSV File") {
      props.filePath = {
        type: "string",
        label: "File Path",
        description: "The path to a csv file in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp)",
      };
    }
    return props;
  },
  methods: {
    parseArray(arr) {
      if (Array.isArray(arr)) {
        return arr.map((item) => {
          return typeof item === "string"
            ? JSON.parse(item)
            : item;
        });
      }
      if (typeof arr === "string") {
        return JSON.parse(arr);
      }
    },
    getRowsFromCSV(filePath) {
      const fileContent = fs.readFileSync(filePath.includes("tmp/")
        ? filePath
        : `/tmp/${filePath}`, "utf-8");
      const rows = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
      });
      return rows;
    },
  },
  async run({ $ }) {
    const data = this.source === "CSV File"
      ? this.getRowsFromCSV(this.filePath)
      : this.parseArray(this.data);

    const response = await this.supabase.insertRow(this.table, data);

    $.export("$summary", `Successfully inserted rows into table ${this.table}`);
    return response;
  },
};
