import app from "../../dealport.app.mjs";

export default {
  key: "dealport-get-record",
  name: "Get Cited Record",
  description: "Open a cited Dealport company Record (UUID) or NYC building Record (10-digit BBL) with primary public-filing sources ($0.01 per new Record). [See the documentation](https://app.dealport.com/llms.txt)",
  version: "0.0.1",
  type: "action",
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
      description: "Dealport company UUID or 10-digit NYC property BBL.",
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
