import app from "../../dealport.app.mjs";

export default {
  key: "dealport-get-record",
  name: "Get Cited Record",
  description: "Open a cited Dealport company Record (UUID) or NYC building Record (10-digit BBL) with primary public-filing sources ($0.01 per new Record). [See the documentation](https://app.dealport.com/llms.txt)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    recordId: {
      type: "string",
      label: "Record ID",
      description: "Dealport company UUID from `data[].id` in **Search Companies** or 10-digit NYC property BBL from `data[].bbl` in **Search Commercial Buildings**, e.g. `123e4567-e89b-12d3-a456-426614174000` or `1008350041`.",
    },
  },
  async run({ $ }) {
    const response = await this.app.getRecord({
      $,
      recordId: this.recordId,
    });
    $.export("$summary", `Retrieved Dealport Record ${this.recordId}`);
    return response;
  },
};
