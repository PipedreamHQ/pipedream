import app from "../../shipengine.app.mjs";

export default {
  key: "shipengine-start-tracking-package",
  name: "Start Tracking a Package",
  description: "Allows you to subscribe to tracking updates for a package. [See the docs](https://shipengine.github.io/shipengine-openapi/#operation/start_tracking).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    carrierCode: {
      label: "Carrier Code",
      description: "Carrier code used to retrieve tracking information. E.g. `stamps_com`",
      propDefinition: [
        app,
        "carrierId",
        () => ({
          mapper: ({
            friendly_name: label, carrier_code: value,
          }) => ({
            label,
            value,
          }),
        }),
      ],
    },
    trackingNumber: {
      label: "Tracking Number",
      description: "The tracking number associated with a shipment. E.g. `9405511899223197428490`",
      propDefinition: [
        app,
        "labelId",
        () => ({
          mapper: ({ tracking_number: value }) => value,
        }),
      ],
    },
  },
  methods: {
    startTrackingPackage(args = {}) {
      return this.app.makeRequest({
        method: "post",
        path: "/tracking/start",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      carrierCode,
      trackingNumber,
    } = this;

    await this.startTrackingPackage({
      step,
      params: {
        carrier_code: carrierCode,
        tracking_number: trackingNumber,
      },
    });

    step.export("$summary", `Tracking started for ${carrierCode} with ${trackingNumber}`);
  },
};
