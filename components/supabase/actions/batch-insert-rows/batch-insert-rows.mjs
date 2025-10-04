import supabase from "../../supabase.app.mjs";
import { parse } from "csv-parse/sync";
import { getFileStream } from "@pipedream/platform";

export default {
  key: "supabase-batch-insert-rows",
  name: "Batch Insert Rows",
  description: "Inserts new rows into a database. [See the documentation](https://supabase.com/docs/reference/javascript/insert)",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
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
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
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
        label: "File Path or URL",
        description: "Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.pdf).",
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
    async getRowsFromCSV(filePath) {
      const stream = await getFileStream(filePath);
      const fileContent = await this.streamToUtf8(stream);
      const rows = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
      });
      return rows;
    },
    async streamToUtf8(stream) {
      return new Promise((resolve, reject) => {
        let data = "";

        stream.setEncoding("utf-8");

        stream.on("data", (chunk) => data += chunk);
        stream.on("end", () => resolve(data));
        stream.on("error", reject);
      });
    },
  },
  async run({ $ }) {
    const data = this.source === "CSV File"
      ? await this.getRowsFromCSV(this.filePath)
      : this.parseArray(this.data);

    const response = await this.supabase.insertRow(this.table, data);

    $.export("$summary", `Successfully inserted rows into table ${this.table}`);
    return response;
  },
};
