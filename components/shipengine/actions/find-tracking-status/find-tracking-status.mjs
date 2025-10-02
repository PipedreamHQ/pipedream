import app from "../../shipengine.app.mjs";

export default {
  key: "shipengine-find-tracking-status",
  name: "Find Tracking Status",
  description: "Retrieves package tracking information. [See the docs](https://shipengine.github.io/shipengine-openapi/#operation/get_tracking_log).",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    getTrackingInfo(args = {}) {
      return this.app.makeRequest({
        path: "/tracking",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      carrierCode,
      trackingNumber,
    } = this;

    const response = await this.getTrackingInfo({
      step,
      params: {
        carrier_code: carrierCode,
        tracking_number: trackingNumber,
      },
    });

    step.export("$summary", `Tracking status for ${trackingNumber} is ${response.status_description}`);

    return response;
  },
};
