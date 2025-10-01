import { readFileSync } from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import app from "../../helper_functions.app.mjs";

export default {
  key: "helper_functions-csv-file-to-objects",
  name: "CSV File To Objects",
  description: "Convert a CSV file to an array of objects.",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    filePath: {
      type: "string",
      label: "CSV File Path",
      description: "The path to the file saved to the `/tmp` directory (e.g. `/tmp/example.csv`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
    },
    hasHeaders: {
      type: "boolean",
      label: "File Contains Headers",
      description: "Set to `true` if the first row of the CSV contains headers. If there are headers in the file, the keys of the objects will be the header values. If there are no headers, each object will be an array of values.",
      optional: true,
      default: false,
    },
    skipEmptyLines: {
      type: "boolean",
      label: "Skip Empty Lines",
      description: "Set to `true` to skip empty lines in the file.",
      optional: true,
      default: true,
    },
    skipRecordsWithEmptyValues: {
      type: "boolean",
      label: "Skip Records With Empty Values",
      description: "Set to `true` to skip records with empty values. Don't generate records for lines containing empty values, empty Buffer or equals to `null` and `undefined` if their value was casted.",
      optional: true,
      default: false,
    },
    skipRecordsWithError: {
      type: "boolean",
      label: "Skip Records With Error",
      description: "Set to `true` to skip records with errors. Tolerates parsing errors. It skips the records containing an error inside and directly go process the next record.",
      optional: true,
      default: false,
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      filePath,
      hasHeaders,
      skipEmptyLines,
      skipRecordsWithEmptyValues,
      skipRecordsWithError,
    } = this;

    let fileContent;
    try {
      fileContent = readFileSync(path.resolve(filePath), "utf8");
    } catch (error) {
      console.error("Error reading file:", error);
      throw error;
    }

    try {
      const records = parse(fileContent, {
        columns: hasHeaders,
        skip_empty_lines: skipEmptyLines,
        skip_records_with_empty_values: skipRecordsWithEmptyValues,
        skip_records_with_error: skipRecordsWithError,
      });

      $.export("$summary", `Converted ${records.length} records from CSV to objects.`);
      return records;

    } catch (error) {
      console.error("Error converting CSV to objects:", error);
      throw error;
    }
  },
};
