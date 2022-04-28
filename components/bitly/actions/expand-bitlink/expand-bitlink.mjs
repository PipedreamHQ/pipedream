import bitly from "../../bitly.app.mjs";

export default {
  key: "bitly-expand-bitlink",
  name: "Expand a Bitlink",
  description:
    "Retrieves information about Bitlink using id. [See the docs here](https://dev.bitly.com/api-reference#expandBitlink)",
  version: "0.0.1",
  type: "action",
  props: {
    bitly,
    bitlink_id: {
      type: "string",
      description: "Bitlink ID",
    },
  },
  async run({ $ }) {
    const { bitlink_id } = this;
    const data = { bitlink_id };

    return await this.bitly.expandBitlink(data);
  },
};
