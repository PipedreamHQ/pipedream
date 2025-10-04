import thoughtfulgpt from "../../thoughtful_gpt.app.mjs";

export default {
  key: "thoughtful_gpt-process-csv-files",
  name: "Process CSV Files",
  description: "Analyzes provided CSV data, generates queries, and creates data visualizations. [See the documentation](https://docs.thoughtfulgpt.com/thoughtfulgpt-documentation/product-guide/api-reference)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    thoughtfulgpt,
    csvData: {
      type: "string",
      label: "CSV Data",
      description: "The CSV data to be analyzed",
    },
    process: {
      type: "string",
      label: "Process",
      description: "Type of process to be executed on CSV data",
    },
    prompt: {
      type: "string",
      label: "Prompt",
      description: "Prompt for the data processing",
    },
  },
  async run({ $ }) {
    const response = await this.thoughtfulgpt.analyzeCSV({
      $,
      data: {
        csv_data: this.csvData,
        process: this.process,
        prompt: this.prompt,
      },
    });
    $.export("$summary", "Successfully processed CSV data.");
    return response;
  },
};
