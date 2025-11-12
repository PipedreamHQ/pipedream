import app from "../../beaconchain.app.mjs";

export default {
  key: "beaconchain-get-epoch",
  name: "Get Epoch",
  description: "Returns information for a specified epoch by the epoch number or an epoch tag (can be latest or finalized). [See the documentation](https://beaconcha.in/api/v1/docs/index.html#/Epoch/get_api_v1_epoch__epoch_)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    epoch: {
      propDefinition: [
        app,
        "epoch",
      ],
    },
  },
  methods: {
    getEpoch({
      epoch, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/epoch/${epoch}`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getEpoch,
      epoch,
    } = this;

    const response = await getEpoch({
      $,
      epoch,
    });

    $.export("$summary", `Successfully retrieved epoch \`${response.data.epoch}\`.`);
    return response;
  },
};
