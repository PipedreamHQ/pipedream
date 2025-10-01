import bitly from "../../bitly.app.mjs";

export default {
  key: "bitly-expand-bitlink",
  name: "Expand a Bitlink",
  description:
    "Retrieves information about Bitlink using id. [See the docs here](https://dev.bitly.com/api-reference#expandBitlink)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    bitly,
    bitlinkId: {
      type: "string",
      description: "This is the shortened url",
      label: "Enter Bitlink url",
    },
  },
  async run() {
    const data = {
      bitlink_id: this.bitlinkId,
    };
    return await this.bitly.expandBitlink(data);
  },
};
