import app from "../../beaconchain.app.mjs";

export default {
  key: "beaconchain-get-execution-blocks",
  name: "Get Execution Blocks",
  description: "Retrieve execution blocks by execution block number. [See the documentation](https://beaconcha.in/api/v1/docs/index.html#/Execution/get_api_v1_execution_block__blockNumber_)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    blockNumbers: {
      type: "string[]",
      label: "Block Number",
      description: "Enter one or more execution block numbers, up to a maximum of 100.",
    },
  },
  methods: {
    getExecutionBlocks({
      blockNumber, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/execution/block/${blockNumber}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getExecutionBlocks,
      blockNumbers,
    } = this;

    const response = await getExecutionBlocks({
      $,
      blockNumber: Array.isArray(blockNumbers)
        ? blockNumbers.map((value) => value.trim()).join(",")
        : blockNumbers,
    });

    $.export("$summary", "Successfully retrieved execution blocks.");
    return response;
  },
};
