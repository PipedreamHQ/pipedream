import utils from "../../common/utils.mjs";
import app from "../../roamresearch.app.mjs";

export default {
  key: "roamresearch-append-blocks",
  name: "Append Blocks",
  description: "Generic append blocks for Roam Research pages. [See the documentation](https://roamresearch.com/#/app/developer-documentation/page/kjnAseQ-K).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    location: {
      type: "object",
      label: "Location",
      description: "The location to append the block to. [See the documentation](https://roamresearch.com/#/app/developer-documentation/page/kjnAseQ-K).",
    },
    appendData: {
      type: "string[]",
      label: "Append Data",
      description: "The data to append to the block. [See the documentation](https://roamresearch.com/#/app/developer-documentation/page/kjnAseQ-K).",
    },
  },
  async run({ $ }) {
    const {
      app,
      location,
      appendData,
    } = this;

    const response = await app.appendBlocks({
      $,
      data: {
        location,
        ["append-data"]: utils.parseArray(appendData),
      },
    });

    $.export("$summary", "Successfully ran append blocks.");
    return response;
  },
};
