import kovapdf from "../../kovapdf.app.mjs";

export default {
  key: "kovapdf-list-signature-requests",
  name: "List Signature Requests",
  description: "List your signature requests, newest first, with their ID, title and status. Use an ID with **Get Signature Request** or **Download Document**. [See the documentation](https://www.kovapdf.com/developers/docs)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    kovapdf,
  },
  async run({ $ }) {
    const { requests } = await this.kovapdf.listSignatureRequests({
      $,
    });
    const count = requests.length;
    $.export("$summary", `Successfully retrieved ${count} signature request${count === 1
      ? ""
      : "s"}`);
    return requests;
  },
};
