import thoughtfulgpt from "../../thoughtfulgpt.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "thoughtfulgpt-process-csv-files",
  name: "Process CSV Files",
  description: "Analyzes provided CSV data, generates queries, and creates data visualizations. [See the documentation](https://docs.thoughtfulgpt.com/thoughtfulgpt-documentation/product-guide/api-reference)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    thoughtfulgpt,
    csvFile: {
      type: "string",
      label: "CSV File",
      description: "The CSV file to be analyzed",
    },
  },
  async run({ $ }) {
    const response = await this.thoughtfulgpt.analyzeCSV({
      csvFile: this.csvFile,
    });
    $.export("$summary", "Successfully processed CSV file");
    return response;
  },
};
