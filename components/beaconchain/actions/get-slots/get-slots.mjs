import app from "../../beaconchain.app.mjs";

export default {
  key: "beaconchain-get-slots",
  name: "Get Slots",
  description: "Returns all slots for a specified epoch. [See the documentation](https://beaconcha.in/api/v1/docs/index.html#/Epoch/get_api_v1_epoch__epoch__slots)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    epoch: {
      description: "Returns all slots for a specified epoch.",
      propDefinition: [
        app,
        "epoch",
      ],
    },
  },
  methods: {
    getEpochSlots({
      epoch, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/epoch/${epoch}/slots`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      getEpochSlots,
      epoch,
    } = this;

    const response = await getEpochSlots({
      $,
      epoch,
    });

    $.export("$summary", `Successfully retrieved \`${response.data.length}\` slot(s).`);
    return response;
  },
};
